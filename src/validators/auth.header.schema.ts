import Joi from "joi";

const authHeaders = Joi.object({
    authorization: Joi.string()
        .pattern(/^Bearer\s.+$/)
        .required()
        .messages({
            "any.required": "Authorization header is required",
            "string.pattern.base": "Authorization must be Bearer token",
        }),
}).options({ allowUnknown: true });

export default authHeaders;