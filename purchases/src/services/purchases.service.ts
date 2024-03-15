import { Injectable } from '@nestjs/common'
import slugify from 'slugify'
import { PrismaService } from 'src/database/prisma/prisma.service'

interface CreateProductRequest {
  title: string
}

@Injectable()
export class PurchasesService {
  constructor(private prisma: PrismaService) { }

  async getAllPurchases() {
    return await this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
  }
}
