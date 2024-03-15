import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { resolve } from 'node:path'
import { TestResolver } from './test.resolver'
import { DatabaseModule } from 'src/database/database.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: resolve(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [TestResolver],
})
export class HttpModule { }
