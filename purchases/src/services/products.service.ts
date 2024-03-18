import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma/prisma.service'
import slugify from 'slugify'

interface CreateProductRequest {
  title: string
}

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) { }

  async getAllProducts() {
    return await this.prisma.product.findMany()
  }

  async getProductById({ productId }: { productId: string }) {
    return await this.prisma.product.findUnique({
      where: {
        id: productId,
      },
    })
  }

  async createProduct({ title }: CreateProductRequest) {
    const slug = slugify(title, {
      lower: true,
    })

    const productWithSameSlug = await this.prisma.product.findUnique({
      where: {
        slug,
      },
    })

    if (productWithSameSlug) {
      throw new Error('Another product with same slug already exists.')
    }

    const product = await this.prisma.product.create({
      data: {
        title,
        slug,
      },
    })

    return product
  }
}
