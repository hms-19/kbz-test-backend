const Joi = require("joi")

exports.TagSchema = Joi.object({
    name: Joi
            .string()
            .required()
            .messages({
                'string.base': 'Name must be a string',
                'string.empty': 'Name is required',
                'any.required': 'Name is required',
              }),    
}).options({ allowUnknown: true });