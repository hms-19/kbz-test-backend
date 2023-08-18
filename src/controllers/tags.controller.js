const tagModel = require("../models/tags.model")
const { validationResponse } = require("../utils")
const { TagSchema } = require("../validators/tags.validate")

exports.list = async (req, res) => {
    try {
        const tags = await tagModel.list(req.body)
        const total_count = await tagModel.find({}).countDocuments()
        let transformedData = []
        if(tags.length > 0){
            transformedData = tags.map(data => data.transform(data))
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
        const { error, value } = TagSchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {

            const tag = new tagModel(value)

            await tag.save()

            return res.send({
                status: 0,
                message: 'Tag Created Successfully !'
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
        const tag = await tagModel.findOne({tag_id: req.body.id})
        
        if(tag){

            return res.send({
                status: 0,
                data: tag.transform(tag,req.body?.lang)
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'Tag Not Found !'
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
        const { error, value } = TagSchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {
            const tag = await tagModel.findOne({tag_id: value.id})

            if(tag){

                await tagModel.findOneAndUpdate({tag_id: req.body.id},value,{returnOriginal: false})
                
                return res.send({
                    status: 0,
                    message: 'Tag Updated Successfully !'
                })
            }
            else{
                return res.send({
                    status: 1,
                    message: 'Tag Not Found !'
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
        const tag = await tagModel.findOne({tag_id: req.body.id})
        
        if(tag){

            await tagModel.findOneAndDelete({tag_id: req.body.id})
            
            return res.send({
                status: 0,
                message: 'Tag Deleted Successfully !'
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'Tag Not Found !'
            })
        }
        
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}