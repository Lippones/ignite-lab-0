import { UseGuards } from '@nestjs/common'
import {
  Resolver,
  Mutation,
  Args,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql'
import { AuthorizationGuard } from 'src/http/auth/authorization.guard'
import { Purchase } from '../models/purchases'
import { CreatePurchaseInput } from '../inputs/create-purchase-input'
import { AuthUser, CurrentUser } from 'src/http/auth/current-user'
import { PurchasesService } from 'src/services/purchases.service'
import { Product } from '../models/product'
import { ProductsService } from 'src/services/products.service'
import { CustomersService } from 'src/services/customers.service'
import { GraphQLError } from 'graphql'

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchaseService: PurchasesService,
    private productsService: ProductsService,
    private customersService: CustomersService,
  ) { }

  @Query(() => [Purchase])
  @UseGuards(AuthorizationGuard)
  purchases() {
    return this.purchaseService.getAllPurchases()
  }

  @ResolveField(() => Product)
  product(@Parent() purchase: Purchase) {
    return this.productsService.getProductById({
      productId: purchase.productId,
    })
  }

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') { productId }: CreatePurchaseInput,
    @CurrentUser() user: AuthUser,
  ) {
    const customer = await this.customersService.getCustomerByAuthUserId(
      user.sub,
    )

    if (!customer) throw new Error('Customer not found')

    const purchase = await this.purchaseService.createPurchase({
      productId,
      customerId: customer.id,
    })

    return purchase
  }
}
