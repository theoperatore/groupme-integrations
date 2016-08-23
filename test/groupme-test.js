'use strict';

import groupme from '../groupme';

groupme('automated test\n\none last test to assure newlines are interpreted correctly').then(body => {
  console.log('success', body);
}).catch(err => {
  console.log('error', err);
})