import joi from "joi";

export enum Products {
  HAND = "hand",
  FOOT = "foot",
  FACE = "face",
  BODY = "body",
}

export const uploadFileSchema = joi.object({
  product: joi.string().valid(...Object.values(Products)),
});
