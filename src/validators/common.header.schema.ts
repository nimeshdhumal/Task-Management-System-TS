import Joi from 'joi';

const commonHeaderSchema = Joi.object({
    'content-type': Joi.string().valid('application/json').required()
}).options({ allowUnknown: true });

export default commonHeaderSchema;