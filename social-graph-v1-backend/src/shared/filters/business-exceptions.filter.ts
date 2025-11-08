import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { BusinessLogicException, BusinessErrorType } from '../errors/business-errors';

@Catch(BusinessLogicException)
export class BusinessExceptionsFilter implements ExceptionFilter {
  catch(exception: BusinessLogicException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status =
      exception.type === BusinessErrorType.NOT_FOUND ? HttpStatus.NOT_FOUND :
      exception.type === BusinessErrorType.PRECONDITION_FAILED ? HttpStatus.PRECONDITION_FAILED :
      HttpStatus.BAD_REQUEST;
    res.status(status).json({ statusCode: status, message: exception.message });
  }
}