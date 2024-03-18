import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { resolve } from 'node:path'
import { DatabaseModule } from 'src/database/database.module'
import { ProductsResolver } from './graphql/resolvers/products.resolver'
import { PurchasesService } from 'src/services/purchases.service'
import { PurchaseResolver } from './graphql/resolvers/purchases.resolver'
import { ProductsService } from 'src/services/products.service'
import { CustomersService } from 'src/services/customers.service'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [
    // Resolvers
    ProductsResolver,
    PurchaseResolver,

    // Services
    ProductsService,
    PurchasesService,
    CustomersService,
  ],
})
export class HttpModule { }
