import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';

interface ErrorResponse {
  message?: string;
  data?: string | object;
  [key: string]: any;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();
  
    let responseData = {
      type: 'error',
      status: status,
      message: 'Unknown error',
      notifyUser: false
    };
  
    const errorResponse = exception.getResponse();
    
    if (typeof errorResponse === 'object' && errorResponse !== null) {
      responseData = { ...responseData, ...errorResponse };
    }
  
    response.status(status).json(responseData);
  }
}
