import argparse
import codecs
import requests
import json
import time
from pprint import pprint
from subprocess import call

parser = argparse.ArgumentParser(description='Run simc on all members of .')
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


# Main
guildRoster = getGuildRoster( args.guild )
filteredRoster = filterGuild( guildRoster, 100 )
filteredRoster.sort()

# Load history file
historyData = open('history.json')
history = json.load(historyData)
historyData.close()

pprint( history )
#For any character over the specified ilvl, that has had gear changes in the last hour
charactersForSimulation = []
historyEntries = []

for character in filteredRoster:
 itemsInfo = getItems( character )
 ilvl = itemsInfo[ "items" ][ "averageItemLevelEquipped" ]
 lastModified =  itemsInfo[ "lastModified" ]
 items = itemsInfo[ "items" ]
 if( ilvl >= 670 and "{}{}".format( character, lastModified ) not in history ):
 	print( "{}  {}: {}".format( lastModified, ilvl, character ) )
 	print( "{}".format( int(time.time() ) ) )
 	historyEntries.append( "{}{}".format( character, lastModified ) )

#Savw this run
fileh=open( 'history.json', 'wb')
json.dump({'history':historyEntries}, fileh, indent=4)
fileh.close()

 #	print( "{}: {}".format( character, ilvl) )
 #	for info in items:
 #		if hasattr(items[info], "__len__") and "id" in items[info]:
 #			print( "{}: {}".format( items[info][ "id" ], items[info][ "name" ] ) )
 #	charactersForSimulation.append( character)



