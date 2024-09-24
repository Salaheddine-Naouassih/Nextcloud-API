import joi from "joi";
import { Request, Response, NextFunction } from "express";

export const validateBody = (schema: joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    console.log({ error });
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i: any) => i.message).join(",");
      res.status(400).json({ error: message });
    }
  };
};
