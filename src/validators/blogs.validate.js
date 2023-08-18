const Joi = require("joi")

exports.BlogSchema = Joi.object({
    title: Joi
            .string()
            .required()
            .messages({
                'string.base': 'Title must be a string',
                'string.empty': 'Title is required',
                'any.required': 'Title is required',
              }),    
   description: Joi
            .string()
            .required()
            .messages({
                'string.base': 'Description must be a string',
                'string.empty': 'Description is required',
                'any.required': 'Description is required',
              }),
  image: Joi
            .string()
            .required()
            .messages({
                'string.base': 'Image must be a string',
                'string.empty': 'Image is required',
                'any.required': 'Image is required',
              }),  
  author: Joi
            .string()
            .required()
            .messages({
                'string.base': 'Author must be a string',
                'string.empty': 'Author is required',
                'any.required': 'Author is required',
              }), 
  read_time: Joi
            .number()
            .required()
            .messages({
                'number.base': 'Read Time must be a number',
                'any.required': 'Read Time is required',
              }), 
              
  category_id: Joi
            .number()
            .required()
            .messages({
                'number.base': 'Category Id must be a number',
                'any.required': 'Category is required',
              }), 
  tag_ids: Joi
            .required()
            .messages({
                'any.required': 'Tag is required',
              }), 
}).options({ allowUnknown: true });