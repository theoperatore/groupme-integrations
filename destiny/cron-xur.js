'use strict';

import { CronJob } from 'cron';

const CRON_TIME = '00 30 4 * * 5';

export default function (execute) {

  return new CronJob(CRON_TIME, () => {
    execute('xur');
  }, null, false, 'America/Chicago');
  
}