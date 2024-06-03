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

import { Field, ObjectType } from "type-graphql"

@ObjectType("Key")
export class Key {
  @Field()
    id!: string 
  @Field()
    key!: string
}
