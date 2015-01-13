import argparse
import codecs
import requests
import json
import os
import time
from pprint import pprint
from subprocess import call


parser = argparse.ArgumentParser(description='Run simc on all members of .')
parser.add_argument('--bin', help='Full path to the simc binary')
parser.add_argument('--region', help='Region name' )
parser.add_argument('--server', help='Server name' )
parser.add_argument('--guild', help='Guild name')
parser.add_argument('--force', help='Skip changed checks in gear')

args = parser.parse_args()

# Defaults
if args.region == None:
	args.region = "us"

if args.server == None:
	args.server = "kiljaeden"

if args.guild == None:
	args.guild = "stage clear"

# Load wow apikey
# Load guilds file
apikeyContents=open('wowapikey')
apikey = apikeyContents.readline()

urlRoot = ".api.battle.net/wow"



def getGuildRoster( guild ):
	site = "https://" + args.region + urlRoot + "/guild/" + args.server + "/" + args.guild + "?fields=members"
	return getWoWAPI( site )

def filterGuild( guild, level ):
	filteredGuild = []
	if "members" in guild:
		for member in guild["members"]:
			character = member["character"]
			if character["level"] >= level:
				filteredGuild.append( character["name"] )
	return filteredGuild

def getItems( character ):
	site = "https://" + args.region + urlRoot + "/character/" + args.server + "/" + character + "?fields=items"
	return getWoWAPI( site )

def getWoWAPI( site ):
	finalSite = site + "&locale=en_US&apikey=" + apikey
	response = requests.get( finalSite )
	j = json.loads( response.content.decode('utf-8') )
	return j

def writeHistory( history ):
	#Save this run
	handle = open( 'history.json', 'r+')
	json.dump({'history':historyEntries}, handle, indent=4 )
	handle.close()
	return

# Main
guildRoster = getGuildRoster( args.guild )
filteredRoster = filterGuild( guildRoster, 100 )
filteredRoster.sort()

# Load and then delete the history file
history = []
historyData = open('history.json', 'r+')
try: 
    history = json.load( historyData )
except ValueError: 
	history = []
historyData.close()

#For any character over the specified ilvl, that has had gear changes in the last hour
historyEntries = []

fileh =open( 'history.json', 'w+')
for character in filteredRoster:
	itemsInfo = getItems( character )
	ilvl = itemsInfo[ "items" ][ "averageItemLevelEquipped" ]
	lastModified =  itemsInfo[ "lastModified" ]
	items = itemsInfo[ "items" ]
	formattedCharacterInfo = "{} {} {}".format( character, ilvl, lastModified )
	if( ilvl >= 670 ):
	 	historyEntries.append( formattedCharacterInfo )
	 	writeHistory( historyEntries )

	if( ilvl >= 670 ):
		if( formattedCharacterInfo not in history[ 'history'] ):
			print( "Modified: {}".format( formattedCharacterInfo ) )
			call( [ args.bin, "armory={},{},{}".format( args.region, args.server, character ), "threads=7", "thread_priority=low", "iterations=100000", "calculate_scale_factors=1", "html={}/{}_spec01.html".format( "sims", character ) ] )
			call( [ args.bin, "armory={},{},{}".format( args.region, args.server, character ), "threads=7", "thread_priority=low", "iterations=100000", "calculate_scale_factors=1", "spec=inactive", "html={}/{}_spec02.html".format( "sims", character ) ] )
	else:
			print( "Up to Date: {}".format( formattedCharacterInfo ) )



 #	print( "{}: {}".format( character, ilvl) )
 #	for info in items:
 #		if hasattr(items[info], "__len__") and "id" in items[info]:
 #			print( "{}: {}".format( items[info][ "id" ], items[info][ "name" ] ) )
 #	charactersForSimulation.append( character)



