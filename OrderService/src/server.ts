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

import dotenv from 'dotenv';
dotenv.config();

import app from './app';

app.listen(3015, () => {
  console.log(`Server Running on port 3015`);
  console.log('API Testing UI: http://localhost:3015/api/v0/docs/');
});