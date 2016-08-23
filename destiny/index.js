'use strict';

import { Promise } from 'es6-promise';

import { getDestinyResource } from '../ops/gateway';
import endpoints from './endpoints';
import * as util from './destiny-utility';

let classMap = {
  '671679327': 'Hunter',
  '2271682572': 'Warlock',
  '3655393761': 'Titan'
};

function handleXur(args) {
  return getDestinyResource(endpoints.xur).then((body) => {
    let Response = body.Response;
    let items = [];

    if (Response) {
      let definitions = Response.definitions.items;
      let saleItems = util.findExoticSaleItems(Response.data.saleItemCategories);

      items = saleItems.map(itm => {
        let i = definitions[itm.item.itemHash];
        return { text: `${i.itemName} : ${i.itemDescription}`, img: endpoints.icon + i.icon };
      })
    }

    if (items.length === 0) {
      items.push({
        text: 'The Nine are tired from selling you plebs all this shit...'
      })
    }

    return items;

  }).catch(err => err);
}


function handlePlayerSearch(args) {
  let url = endpoints.player.replace('%s', args[0]);
  let classes = args.slice(1);

  classes = classes.length === 0 ? ['hunter', 'titan', 'warlock'] : classes;

  let id = 0;
  let name = '';

  return getDestinyResource(url).then(body => {
    let Response = body.Response;

    if (Response && Response.length > 0) {
      let membershipId = body.Response[0].membershipId;
      let displayName = body.Response[0].displayName;
      id = membershipId;
      name = displayName;
      return {membershipId, displayName};
    }
    
    throw {type: 'NOT_FOUND', message: `Error: player [${args[0]}] not found`};

  }).then(user => {
    
    let statsUrl = endpoints.stats.replace('%s', id);
    return getDestinyResource(statsUrl).then(body => {

      let classMap = {
        '671679327': 'Hunter',
        '2271682572': 'Warlock',
        '3655393761': 'Titan'
      };

      let filterClasses = classes.reduce((obj, name) => {
        obj[name.toLowerCase()] = 1;
        return obj;
      }, {});

      return body.Response.data.characters.map(char => {
        return {
          psn: user.displayName,
          className: classMap[char.characterBase.classHash], 
          characterId: char.characterBase.characterId,
          time: util.parseMinutes(char.characterBase.minutesPlayedTotal),
          lightLevel: char.characterBase.powerLevel,
          level: char.levelProgression.level,
          emblem: endpoints.icon + char.emblemPath
        }
      }).filter(char => filterClasses[char.className.toLowerCase()] === 1);
    })

  }).then(charStats => {

    let characterUrls = charStats.map(char => endpoints.character.replace('%m', id).replace('%c', char.characterId));

    return Promise.all(characterUrls.map(getDestinyResource)).then(aggregatedStats => {
      return aggregatedStats.map((stats, i) => {
        let categories = stats.Response.allPvP.allTime;

        if (categories) {
          return util.assign(charStats[i], {
            bestWeapon: categories.weaponBestType.basic.displayValue,
            kills: categories.kills.basic.displayValue,
            deaths: categories.deaths.basic.displayValue,
            averageLifespan: categories.averageLifespan.basic.displayValue,
            averageScorePerLife: categories.averageScorePerLife.basic.displayValue,
            longestKillSpree: categories.longestKillSpree.basic.displayValue
          })  
        }

        return charStats[i];
      })
    })

  }).then(charStats => {

    return charStats.map(c => {
      let crucible = [];

      if (c.bestWeapon) {
        crucible = [
          ``,
          `---------- crucible ----------`,
          `  Kills:  ${c.kills}`,
          `  Deaths:  ${c.deaths}`,
          `  Avg Life:  ${c.averageLifespan}`,
          `  Avg Score/Life:  ${c.averageScorePerLife}`,
          `  Best Weapon:  ${c.bestWeapon}`,
          `  Best Kill Sreak: ${c.longestKillSpree}`
        ];
      }

      return {
        img: c.emblem,
        text: [
                `${c.psn}'s ${c.className}:`,
                ``,
                `  Lvl:  ${c.level} [ ${c.lightLevel} ]`,
                `  Time:  ${c.time.days}d ${c.time.hours}h ${c.time.mins}m`,
                ...crucible
              ].join('\n')
      }
    })

  })
}


function handleWeaponSearch(args) {
  return Promise.reject({type: 'NOT_IMPLEMENTED', message: 'Error: cannot search weapons yet'});
}

function getCharacterIds(membershipId) {
  let statsUrl = endpoints.stats.replace('%s', membershipId);
  return getDestinyResource(statsUrl).then(body => {
    console.log(body);
    return body.Response.data.characters.map(character => {
      return {
        characterId: character.characterBase.characterId,
        className: classMap[character.characterBase.classHash],
      }
    })
  })
}

function getPlayerMembershipId(name) {
  let url = endpoints.player.replace('%s', name);

  return getDestinyResource(url).then(body => {
    let Response = body.Response;
    if (Response && Response.length > 0) {
      let { membershipId, membershipType } = body.Response[0];
      return { membershipId, membershipType };
    }
    
    throw {type: 'NOT_FOUND', message: `Error: player [${args[0]}] not found`};
  });
}

function getPlayerCharacterInfo(name, classes) {
  let filterClasses = classes.reduce((obj, name) => {
    obj[name.toLowerCase()] = 1;
    return obj;
  }, {});

  return getPlayerMembershipId(name).then(membershipKeys => {
    console.log('membershipKeys:', membershipKeys);
    return membershipKeys;
  }).then(membershipKeys => {
    return getCharacterIds(membershipKeys.membershipId).then(characterIds => {
      console.log('charIds:', characterIds);
      return {
        membershipId: membershipKeys.membershipId,
        membershipType: membershipKeys.membershipType,
        characterIds: characterIds.filter(char => filterClasses[char.className.toLowerCase()] === 1)
      }
    });
  })  
}

function getPlayerCrucibleActivities(membershipId, characterId) {
  let url = endpoints.activities.replace('%s', membershipId);
  url = url.replace('%c', characterId);

  return getDestinyResource(url).then(res => {
    return res.Response.data;
  })
}

function handleKD(args) {
  let name = args[0];
  let classes = args.slice(1);
  classes = classes.length === 0 ? ['hunter', 'titan', 'warlock'] : classes;

  return getPlayerCharacterInfo(name, classes).then(pcInfo => {

    let characterUrls = pcInfo.characterIds.map(char => endpoints.character.replace('%m', pcInfo.membershipId).replace('%c', char.characterId))
    return Promise.all(characterUrls.map(getDestinyResource)).then(resps => {
      return resps.map((res, i) => {
        let categories = res.Response.allPvP.allTime;
        let stats = {};
        if (categories) {
          stats.kd = categories.killsDeathsRatio.basic.displayValue;
        }

        return { stats, character: pcInfo.characterIds[i] };
      });
    })
  }).then(characterInfos => {
    let formattedChars = characterInfos.map(char => {
      return `${char.character.className}: ${char.stats.kd || 'No Crucible K/D'}`;
    });

    return [{
      text: [`----- ${name}'s K/Ds -----`,
            ...formattedChars,
            ].join('\n')
    }]
  })
}


export default function mixin() {
  return {
    xur: handleXur,
    player: handlePlayerSearch,
    weapon: handleWeaponSearch,
    kd: handleKD,
  }
}
