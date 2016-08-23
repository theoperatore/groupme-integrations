Groupme Bots
------------

A small collection of services that I use for my groupme integrations.

Pokemon API
-----------

Query the pokemon api using the keyword `#pkmn`. then just the name of the pokemon!

```javascript
// in the groupme app
#pkmn blastoise
```

Destiny Integrations
--------------------

Query for different player stats. It only searches through `PSN` accounts so far, but easily mapped to xbone as well. 

The command needs a `psnId` and returns all of the characters for that user. Can also filter for a character class types. Any combination of the ones you want just sepearate them with a space.

```javascript
#player <psnId> [warlock|titan|hunter]
```

Can also query for Xur's inventory when he's around on the weekends:

```javascript
#xur
```

And for the competative...you can search for player K/Ds:

```javascript
#kd <psnId>
```

TODOS
-----

- do all of the clean up
- think of more interesting stats that people want to see
- Destiny stat ticker?
- Destiny psuedo-real-time stat aggregator?
- Search Destiny weapons/perks/items
- More pokemon stats integrations

