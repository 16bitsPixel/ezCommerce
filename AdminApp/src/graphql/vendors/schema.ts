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
import { IsUUID } from "class-validator";

@ObjectType()
export class Vendor {
  @Field()
  @IsUUID()
    vendorId!: string 
  @Field()
    accepted!: string
  @Field()
    name!: string
}