import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

interface IValidationOptions {
  body?: ObjectSchema;
  headers?: ObjectSchema;
  query?: ObjectSchema;
  params?: ObjectSchema;
}

const validateRequest = (options: IValidationOptions) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (options.body) {
      const { error, value } = options.body.validate(req.body);
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      req.body = value;
    }

    if (options.headers) {
      const { error, value } = options.headers.validate(req.headers);
      if (error) {
        res.status(401).json({ message: error.message });
        return;
      }
      req.headers = value;
    }

    if (options.query) {
      const { error, value } = options.query.validate(req.query);
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      req.query = value;
    }

    if (options.params) {
      const { error, value } = options.params.validate(req.params);
      if (error) {
        res.status(400).json({ message: error.message });
        return;
      }
      req.params = value;
    }

    next();
  };
};

export default validateRequest;
