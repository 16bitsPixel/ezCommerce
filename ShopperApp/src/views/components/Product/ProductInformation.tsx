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
  description: string[];
  price: number;
  // rating: number;
}

export function ProductInformation({name, description, price/*, rating*/}: ProductInfoProps) {
  return (
    <Box>
      <Typography variant="h5" gutterBottom style = {{fontWeight: 'bold'}}>
        {name}
      </Typography>
      <Divider style = {{margin: '1vh 0 1vh 0'}}/>
      <Typography variant="h4" gutterBottom>
        ${price}
      </Typography>
      {description.map((desc, index) => (
        <li key={index} style={{ fontSize: '1.2 rem', paddingBottom: '18px' }}>
          {desc}
        </li>
      ))}
      <Divider style = {{margin: '1vh 0 1vh 0'}}/>
    </Box>
  )
}
