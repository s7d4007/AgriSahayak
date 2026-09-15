import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === 'production' && statusCode === 500
      ? 'Internal server error'
      : err.message || 'Internal server error';

  console.error(`[ERROR] ${err.stack || err.message}`);

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

export const createError = (message: string, statusCode = 500): ApiError => {
  const error: ApiError = new Error(message);
  error.statusCode = statusCode;
  return error;
};
