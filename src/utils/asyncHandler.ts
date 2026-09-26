import type { NextFunction, Request, RequestHandler, Response } from "express";

export function asyncHandler(
  funchandler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler {
  return function wrapperFunction(req, res, next) {
    funchandler(req, res, next).catch(next);
  };
}
