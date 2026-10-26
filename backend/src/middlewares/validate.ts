import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

export const validate = (schema: ZodType, source: 'body' | 'query' | 'params' = 'body'): RequestHandler =>
  (request, _response, next) => {
    const result = schema.safeParse(request[source]);
    if (!result.success) {
      next(result.error);
      return;
    }
    request[source] = result.data;
    next();
  };