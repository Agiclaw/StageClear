﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Linq;

using Microsoft.AspNet.FileSystems;

namespace Server
{
    /// <summary>
    /// Looks up files using embedded resources in the specified assembly.
    /// This file system is case sensitive.
    /// </summary>
    public class ExtendedEmbeddedResourceFileSystem : IFileSystem
    {
        private readonly Assembly _assembly;
        private readonly string _baseNamespace;
        private readonly DateTime _lastModified;

        /// <summary>
        /// Initializes a new instance of the <see cref="EmbeddedResourceFileSystem" /> class using the specified
        /// assembly and empty base namespace.
        /// </summary>
        /// <param name="assembly"></param>
        public ExtendedEmbeddedResourceFileSystem(Assembly assembly)
            : this(assembly, string.Empty)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="EmbeddedResourceFileSystem" /> class using the specified
        /// assembly and base namespace.
        /// </summary>
        /// <param name="assembly">The assembly that contains the embedded resources.</param>
        /// <param name="baseNamespace">The base namespace that contains the embedded resources.</param>
        public ExtendedEmbeddedResourceFileSystem(Assembly assembly, string baseNamespace)
        {
            if (assembly == null)
            {
                throw new ArgumentNullException("assembly");
            }
            // Note: For ProjectK resources don't have a namespace anymore, just a directory path. Use '/' instead of '.'.
            _baseNamespace = string.IsNullOrEmpty(baseNamespace) ? string.Empty : baseNamespace + "/";
            _assembly = assembly;
            // REVIEW: Does this even make sense?
            _lastModified = DateTime.Now;
        }

        /// <summary>
        /// Locate a file at the given path
        /// </summary>
        /// <param name="subpath">The path that identifies the file</param>
        /// <param name="fileInfo">The discovered file if any</param>
        /// <returns>True if a file was located at the given path</returns>
        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            // "/file.txt" expected.
            if (string.IsNullOrEmpty(subpath) || subpath[0] != '/')
            {
                fileInfo = null;
                return false;
            }

            string fileName = subpath.Substring(1);  // Drop the leading '/'
            string resourcePath = _baseNamespace + fileName;
            if (_assembly.GetManifestResourceInfo(resourcePath) == null)
            {
                fileInfo = null;
                return false;
            }
            fileInfo = new EmbeddedResourceFileInfo(_assembly, resourcePath, fileName, _lastModified);
            return true;
        }

        /// <summary>
        /// Enumerate a directory at the given path, if any.
        /// This file system uses a flat directory structure. Everything under the base namespace is considered to be one directory.
        /// </summary>
        /// <param name="subpath">The path that identifies the directory</param>
        /// <param name="contents">The contents if any</param>
        /// <returns>True if a directory was located at the given path</returns>
        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            // The file name is assumed to be the remainder of the resource name.
            var pathPrefix = Path.Combine(_baseNamespace, subpath).Replace('\\', '/');
            if (pathPrefix.StartsWith("/"))
            {
                pathPrefix = pathPrefix.Substring(1);
            }

            IList<IFileInfo> entries = new List<IFileInfo>();
            HashSet<string> seenDirectories = new HashSet<string>();

            // TODO: The list of resources in an assembly isn't going to change. Consider caching.
            string[] resources = _assembly.GetManifestResourceNames();
            for (int i = 0; i < resources.Length; i++)
            {
                string resourceName = resources[i];
                if (resourceName.StartsWith(pathPrefix))
                {
                    var pathIndex = resourceName.IndexOf('/', pathPrefix.Length);

                    if (pathIndex < 0)
                    {
                        entries.Add(new EmbeddedResourceFileInfo(
                            _assembly, resourceName, resourceName.Substring(pathPrefix.Length), DateTime.Now ) );
                    }
                    else
                    {
                        var directoryPath = resourceName.Substring(0, pathIndex);

                        if (!seenDirectories.Contains(directoryPath))
                        {
                            seenDirectories.Add(directoryPath);
                            var directoryName = resourceName.Substring(pathPrefix.Length, pathIndex - pathPrefix.Length);
                            entries.Add(new EmbeddedResourceFileInfo(
                                _assembly, directoryPath, directoryName, DateTime.Now, true));
                        }
                    }
                }
            }

            contents = entries;
            return entries.Any();
        }

        /// <inheritdoc />
        public bool TryGetParentPath(string subpath, out string parentPath)
        {
            if (string.IsNullOrEmpty(subpath) ||
                subpath[0] != '/' ||
                subpath.Equals("/", StringComparison.Ordinal))
            {
                // If the path does not start with the root, or are already at the root, return false.
                parentPath = null;
                return false;
            }

            parentPath = "/";
            return true;
        }

        private class EmbeddedResourceFileInfo : IFileInfo
        {
            private readonly Assembly _assembly;
            private readonly DateTime _lastModified;
            private readonly string _resourcePath;
            private readonly string _fileName;
            private readonly bool _isDirectory;

            private long? _length;

            public EmbeddedResourceFileInfo(Assembly assembly, string resourcePath, string fileName, DateTime lastModified, bool isDirectory = false)
            {
                _assembly = assembly;
                _lastModified = lastModified;
                _resourcePath = resourcePath;
                _fileName = fileName;
                _isDirectory = isDirectory;
            }

            public long Length
            {
                get
                {
                    if (!_length.HasValue)
                    {
                        using (Stream stream = _assembly.GetManifestResourceStream(_resourcePath))
                        {
                            _length = stream.Length;
                        }
                    }
                    return _length.Value;
                }
            }

            // Not directly accessible.
            public string PhysicalPath
            {
                get { return null; }
            }

            public string Name
            {
                get { return _fileName; }
            }

            public DateTime LastModified
            {
                get { return _lastModified; }
            }

            public bool IsDirectory
            {
                get { return _isDirectory; }
            }

            public Stream CreateReadStream()
            {
                Stream stream = _assembly.GetManifestResourceStream(_resourcePath);
                if (!_length.HasValue)
                {
                    _length = stream.Length;
                }
                return stream;
            }
        }
    }
}

