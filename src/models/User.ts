/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType({
  isAbstract: true,
})
export class User {
  @Field((_type) => ID, {
    nullable: false,
  })
  id!: number;

  @Field((_type) => String, {
    nullable: false,
  })
  uuid!: string;

  @Field((_type) => String, {
    nullable: false,
  })
  email!: string;

  @Field((_type) => String, {
    nullable: false,
  })
  password!: string;

  @Field((_type) => Date, {
    nullable: false,
  })
  createdAt!: Date;

  @Field((_type) => Date, {
    nullable: false,
  })
  updatedAt!: Date;
}
