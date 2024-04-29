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

/*
 * Feel free to change this as much as you like, but don't add a default export
 */

import { Fragment } from 'react';
import { Typography } from '@mui/material';

export function App() {
  return (
    <Fragment>
      <Typography component="h1" variant="h5">
        Hello World
      </Typography>
    </Fragment>
  );
}