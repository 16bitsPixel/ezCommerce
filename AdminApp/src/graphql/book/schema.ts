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
import { Matches } from "class-validator";

@ObjectType()
export class Book {
  @Field()
  @Matches(/^(97(8|9))?\d{9}(\d|X)$/)
    isbn!: string 
  @Field()
    title!: string
  @Field()
    author!: string
  @Field()
    publisher!: string
}
