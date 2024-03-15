import { UseGuards } from '@nestjs/common'
import { Resolver, Mutation, Args, Query } from '@nestjs/graphql'
import { AuthorizationGuard } from 'src/http/auth/authorization.guard'
import { ProductsService } from 'src/services/products.service'
import { CreateProductInput } from '../inputs/create-product-input'
import { Product } from '../models/product'

@Resolver()
export class ProductsResolver {
  constructor(private productsService: ProductsService) { }

  @Query(() => [Product])
  // @UseGuards(AuthorizationGuard)
  products() {
    return this.productsService.getAllProducts()
  }

  @Mutation(() => Product)
  @UseGuards(AuthorizationGuard)
  createProduct(@Args('data') { title }: CreateProductInput) {
    return this.productsService.createProduct({
      title,
    })
  }
}
