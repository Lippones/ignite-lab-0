import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GqlExecutionContext } from '@nestjs/graphql'
import { auth } from 'express-oauth2-jwt-bearer'

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCE: string
  private AUTH0_DOMAIN: string

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCE = this.configService.get('AUTH0_AUDIENCE') ?? ''
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? ''
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const httpContext = context.switchToHttp()
    // const req = httpContext.getRequest()
    // const res = httpContext.getResponse()
    // const next = httpContext.getNext()
    const { req, res } = GqlExecutionContext.create(context).getContext()

    const checkJWT = auth({
      audience: this.AUTH0_AUDIENCE,
      issuerBaseURL: `${this.AUTH0_DOMAIN}`,
      tokenSigningAlg: 'RS256',
    })

    return new Promise((resolve, reject) => {
      checkJWT(req, res, (err) => {
        if (err) {
          reject(new UnauthorizedException(err))
        } else {
          resolve(true)
        }
      })
    })
  }
}
