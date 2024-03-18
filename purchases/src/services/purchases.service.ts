import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'

interface CreatePurchaseRequest {
  productId: string
  customerId: string
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

  async createPurchase({ customerId, productId }: CreatePurchaseRequest) {
    const product = await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })

    if (!product) throw new Error('Product not found')

    const purchase = await this.prisma.purchase.create({
      data: {
        customerId,
        productId,
      },
    })

    return purchase
  }
}
