using Microsoft.AspNet.FileSystems;
using System;
using System.Collections.Generic;
using System.Collections;
using System.Linq;

namespace Server
{
    public class FileSystemList : IList<IFileSystem>, IFileSystem
    {
        private IList<IFileSystem> fileSystems = new List<IFileSystem>();

        public IFileSystem this[int index]
        {
            get
            {
                return fileSystems[index];
            }

            set
            {
                fileSystems[index] = value;
            }
        }

        public int Count
        {
            get
            {
                return fileSystems.Count;
            }
        }

        public bool IsReadOnly
        {
            get
            {
                return false;
            }
        }

        public void Add(IFileSystem item)
        {
            fileSystems.Add(item);
        }

        public void Clear()
        {
            fileSystems.Clear();
        }

        public bool Contains(IFileSystem item)
        {
            return fileSystems.Contains(item);
        }

        public void CopyTo(IFileSystem[] array, int arrayIndex)
        {
            fileSystems.CopyTo(array, arrayIndex);
        }

        public IEnumerator<IFileSystem> GetEnumerator()
        {
            return fileSystems.GetEnumerator();
        }

        public int IndexOf(IFileSystem item)
        {
            return fileSystems.IndexOf(item);
        }

        public void Insert(int index, IFileSystem item)
        {
            fileSystems.Insert(index, item);
        }

        public bool Remove(IFileSystem item)
        {
            return fileSystems.Remove(item);
        }

        public void RemoveAt(int index)
        {
            fileSystems.RemoveAt(index);
        }

        public bool TryGetDirectoryContents(string subpath, out IEnumerable<IFileInfo> contents)
        {
            var any = false;
            contents = Enumerable.Empty<IFileInfo>();
            IEnumerable<IFileInfo> currentContents;

            foreach (var fileSystem in this)
            {
                if (fileSystem.TryGetDirectoryContents(subpath, out currentContents))
                {
                    contents = contents.Union(currentContents);
                    any = true;
                }
            }

            return any;
        }

        public bool TryGetFileInfo(string subpath, out IFileInfo fileInfo)
        {
            foreach (var fileSystem in this)
            {
                if (fileSystem.TryGetFileInfo(subpath, out fileInfo))
                {
                    return true;
                }
            }

            fileInfo = null;
            return false;
        }

        public bool TryGetParentPath(string subpath, out string parentPath)
        {
            foreach (var fileSystem in this)
            {
                if (fileSystem.TryGetParentPath(subpath, out parentPath))
                {
                    return true;
                }
            }

            parentPath = null;
            return false;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return fileSystems.GetEnumerator();
        }
    }
}