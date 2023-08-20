const categoryModel = require("../models/categories.model")
const { validationResponse } = require("../utils")
const { CategorySchema } = require("../validators/categories.validate")

exports.list = async (req, res) => {
    try {
        const categories = await categoryModel.list(req.body)
        const total_count = await categoryModel.find({}).countDocuments()
        let transformedData = []
        if(categories.length > 0){
            transformedData = categories.map(data => data.transform(data))
        }
        
        return res.send({
            status: 0,
            data: transformedData,
            total_count
        })
        
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}

exports.create = async (req, res) => {
    try {
        const { error, value } = CategorySchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {

            const category = new categoryModel(value)

            await category.save()

            return res.send({
                status: 0,
                message: 'Category Created Successfully !'
            })
        }
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}

exports.detail = async (req, res) => {
    try {
        const category = await categoryModel.findOne({category_id: req.body.id})
        
        if(category){

            return res.send({
                status: 0,
                data: category.transform()
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'Category Not Found !'
            })
        }
        
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}

exports.update = async (req, res) => {
    try {
        const { error, value } = CategorySchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {
            const category = await categoryModel.findOne({category_id: value.id})

            if(category){

                await categoryModel.findOneAndUpdate({category_id: req.body.id},value,{returnOriginal: false})
                
                return res.send({
                    status: 0,
                    message: 'Category Updated Successfully !'
                })
            }
            else{
                return res.send({
                    status: 1,
                    message: 'Category Not Found !'
                })
            }
        }
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const category = await categoryModel.findOne({category_id: req.body.id})
        
        if(category){

            await categoryModel.findOneAndDelete({category_id: req.body.id})
            
            return res.send({
                status: 0,
                message: 'Category Deleted Successfully !'
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'Category Not Found !'
            })
        }
        
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}