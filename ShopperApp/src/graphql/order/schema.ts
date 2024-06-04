import { Field, ObjectType, InputType } from "type-graphql"
// import { Matches } from "class-validator";

@ObjectType('order')
export class Order {
  @Field()
    orderId!: string
  @Field()
    accountId!: string
  @Field(() => [String]) 
    productId!: string[]
  @Field(() => Date)
    date!: Date
  @Field()
    status!: string
  @Field(() => [Number])
    quantities!: number[]
}

@InputType('InputOrder')
export class InputOrder {
  @Field()
    account_id!: string
  @Field(() => [String]) 
    product_id!: string[]
  @Field(() => [Number])
    quantities!: number[]
}
@ObjectType('orderOutput')
export class output{
  @Field()
    account_id!: string
  @Field(() => [String]) 
    product_id!: string[]
  @Field(() => [Number])
    quantities!: number[]
}