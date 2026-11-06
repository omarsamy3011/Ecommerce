import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('from interceptor before request');

    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        console.log('after controller');
        console.log(`time takein is ${Date.now() - now} ms`);
      }),
      map((data) => ({
        data,
        timeTaken: `${Date.now() - now} ms`,
        status: 200,
      })),
    );
  }
}
