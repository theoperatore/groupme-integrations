'use strict';

let base = 'https://www.bungie.net/platform/destiny/';
let icon = 'https://www.bungie.net';
let xur = `${base}advisors/xur/?definitions=true`;
let player = `${base}searchDestinyPlayer/2/%s`;
let stats = `${base}2/Account/%s/Summary/`;
let character = `${base}Stats/2/%m/%c/`;
let activities = `${base}2/Account/%s/Character/%c/Activities?definitions=true`;


const endpoints = {
  icon,
  xur,
  player,
  stats,
  character,
  activities,
}

export default endpoints;