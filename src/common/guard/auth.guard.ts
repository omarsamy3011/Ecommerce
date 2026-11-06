import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../service/Token/token.service';

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    let request: AuthenticatedRequest;

    switch (context.getType<'http' | 'graphql'>()) {
      case 'http':
        request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        break;
      case 'graphql': {
        const graphqlContext = GqlExecutionContext.create(context).getContext<{
          req?: AuthenticatedRequest;
        }>();
        request = graphqlContext?.req as AuthenticatedRequest;
        break;
      }
      default:
        throw new UnauthorizedException('Unsupported execution context');
    }

    if (!request) {
      throw new UnauthorizedException('Request context is missing');
    }

    const authorization = request.headers.authorization;
    const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];

    if (!token) {
      throw new UnauthorizedException('Authorization header is required');
    }

    try {
      const payload = this.tokenService.decodeToken(token);
      if (typeof payload === 'string') {
        throw new UnauthorizedException('Invalid token payload');
      }

      request.user = payload;
      return true;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new UnauthorizedException('Invalid or expired token');
      }

      throw error;
    }
  }
}
