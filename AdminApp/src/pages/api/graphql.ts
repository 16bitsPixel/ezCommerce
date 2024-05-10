/*
#######################################################################
#
# Copyright (C) 2020-2022 David C. Harrison. All right reserved.
#
# You may not use, distribute, publish, or modify this code without 
# the express written permission of the copyright holder.
#
#######################################################################
*/

import { createYoga } from 'graphql-yoga'
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from "type-graphql"

import { AuthResolver } from '../../graphql/auth/resolver'
import { nextAuthChecker } from '../../graphql/auth/checker';

const schema = buildSchemaSync({
  resolvers: [AuthResolver],
  validate: true, 
  authChecker: nextAuthChecker,
});

export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
})