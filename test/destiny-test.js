'use strict';

import destinyMixin from '../destiny';
import { getDestinyResource } from '../ops/gateway';
import endpoints from '../destiny/endpoints';

let destiny = destinyMixin();

let classMap = {
  '671679327': 'Hunter',
  '2271682572': 'Warlock',
  '3655393761': 'Titan'
};

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

function getCharacterStats(membershipId) {
  let statsUrl = endpoints.stats.replace('%s', membershipId);
  return getDestinyResource(statsUrl).then(body => {
    return body.Response;
  })
}

function getPlayerCharacterInfo(name, classes) {
  let filterClasses = classes.reduce((obj, name) => {
    obj[name.toLowerCase()] = 1;
    return obj;
  }, {});

  return getPlayerMembershipId(name).then(membershipKeys => {
    return membershipKeys;
  }).then(membershipKeys => {
    return getCharacterStats(membershipKeys.membershipId);
  })  
}

// search xur
// destiny.xur().then(items => {
//   console.log(items);
// }).catch(err => console.log(err));


// search for a player
// destiny.player(['abersoto']).then(items => {
//   console.log(items);
// }).catch(err => console.log(err));

// setInterval(() => {
//   destiny.player(['abersoto', 'warlock']).then(warlock => {
//     console.log(warlock);
//   }).catch(err => console.log(err));
// }, 10000);

// destiny.kd(['abersoto']).then(kd => {
//   console.log(kd);
// }).catch(err => console.log(err));

getPlayerCharacterInfo('abersoto', ['warlock'])
.then(charInfo => {
  console.log(charInfo.data.characters[0]);
})
.catch(err => {
  console.log(err);
});
