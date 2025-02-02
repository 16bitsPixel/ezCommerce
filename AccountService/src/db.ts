/*
#######################################################################
#
# Copyright (C) 2022-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { Pool } from 'pg';

const pool = new Pool({
  host: (process.env.POSTGRES_HOST || 'localhost'),
  port: + (process.env.POSTGRES_PORT || 5433),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

export { pool };