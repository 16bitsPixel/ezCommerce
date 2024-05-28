
import { createYoga } from 'graphql-yoga'
import 'reflect-metadata'; // must come before buildSchema
import { buildSchemaSync } from "type-graphql"

import { AuthResolver } from '../../graphql/auth/resolver'
import { nextAuthChecker } from '../../graphql/auth/checker';
import { VendorResolver } from '../../graphql/vendors/resolver';
import { printSchema } from 'graphql';
const schema = buildSchemaSync({
  resolvers: [VendorResolver],
  validate: true, 
  authChecker: nextAuthChecker,
});
console.log(printSchema(schema));
export default createYoga({
  schema,
  // Needed to be defined explicitly because our endpoint lives at a different path other than `/graphql`
  graphqlEndpoint: '/api/graphql',
})
