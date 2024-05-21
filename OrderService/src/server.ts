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

app.listen(3013, () => {
  console.log(`Server Running on port 3013`);
  console.log('API Testing UI: http://localhost:3013/api/v0/docs/');
});