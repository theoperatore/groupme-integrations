'use strict';

import { Router } from 'express';
import { BotService } from './ops/service';


let router = Router();
let bot = BotService();


router.post('/', (req, res) => {

  bot(req.body.text);
  res.status(200).end();

})

export default router;