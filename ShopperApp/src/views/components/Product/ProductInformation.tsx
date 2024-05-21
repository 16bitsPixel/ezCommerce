/*
#######################################################################
#
# Copyright (C) 2020-2024 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without
# the express written permission of the copyright holder.
#
#######################################################################
*/
import React from 'react';

import { Box, Typography, Divider } from '@mui/material';

interface ProductInfoProps {
  name: string;
  price: number;
  rating: number;
}

export function ProductInformation({name, price, rating}: ProductInfoProps) {
  console.log(name);
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>
      <Divider/>
    </Box>
  )
}
