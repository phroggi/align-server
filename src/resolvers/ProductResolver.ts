/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { Resolver, Mutation, Arg, Field, Ctx, ObjectType, Query } from "type-graphql";

import { Product } from "../models/Product";
import { MyContext } from "../types";

const prisma = new PrismaClient();

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class ProductResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Product], { nullable: true })
  product?: Product[];
}

@Resolver(Product)
export class ProductResolver {
  @Query(() => [Product])
  async allProducts() {
		const product = await prisma.product.findMany()
		if (!product) {
			throw new Error(`No products found`);
		}
		return {
			product
		}


  }

	@Query(() => Product)
}
