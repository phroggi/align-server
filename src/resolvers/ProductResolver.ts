/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import "reflect-metadata";
import { PrismaClient } from "@prisma/client";
import { Resolver, Mutation, Arg, Field, Query, InputType, Int } from "type-graphql";

import Product from "../models/Product";
// import { MyContext } from "../types";

const prisma = new PrismaClient();

@InputType()
export class ProductCreateInput {
  @Field()
  slug: string;

  @Field()
  title: string;

  @Field()
  image?: string;

  @Field()
  description: string;

  @Field()
  price: number;

  @Field()
  features: string;
}

@InputType()
export class ProductUpdateInput extends ProductCreateInput {
  @Field()
  id: number;
}

@Resolver(Product)
export default class ProductResolver {
  @Query(() => [Product])
  async allProducts() {
    const product = await prisma.product.findMany();
    if (!product) {
      throw new Error(`No products found`);
    }
    return {
      product,
    };
  }

  @Query(() => Product)
  async searchByProductId(@Arg("id") id: number) {
    const product = await prisma.product.findUnique({
      where: { id },
    });

    return {
      product,
    };
  }

  @Mutation(() => Product)
  async createProduct(@Arg("data") data: ProductCreateInput) {
    const product = await prisma.product.create({
      data: {
        ...data,
      },
    });

    return {
      product,
    };
  }

  @Mutation(() => Product)
  async deleteProduct(@Arg("id", (_type) => Int!) id: number) {
    const product = await prisma.product.delete({
      where: { id },
    });

    return {
      product,
    };
  }

  @Mutation(() => Product)
  async updateProduct(@Arg("data") data: ProductUpdateInput) {
    const product = await prisma.product.update({
      where: { id: data.id },
      data: data,
    });

    return {
      product,
    };
  }
}
