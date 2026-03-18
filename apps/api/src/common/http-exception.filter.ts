import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();
      const message = typeof body === 'object' && body && 'message' in body
        ? (body as { message?: string | string[] }).message
        : exception.message;
      this.logger.warn(`HTTP ${status}: ${JSON.stringify(message)}`);
      res.status(status).json(
        typeof body === 'object' && body && typeof body === 'object'
          ? body
          : { statusCode: status, message },
      );
      return;
    }

    const message = exception instanceof Error ? exception.message : 'Unknown error';
    const stack = exception instanceof Error ? exception.stack : undefined;
    this.logger.error(`Unhandled error: ${message}`, stack);

    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: 500,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'production' ? undefined : message,
    });
  }
}
