const { deleteFileFromS3 } = require("../config/s3")
const blogModel = require("../models/blogs.model")
const categoriesModel = require("../models/categories.model")
const tagsModel = require("../models/tags.model")
const { validationResponse } = require("../utils")
const { uploadFile } = require("../utils/file")
const { BlogSchema } = require("../validators/blogs.validate")
const gravatar = require('gravatar')
const path = require('path');

exports.list = async (req, res) => {
    try {
        const blogs = await blogModel.list(req.body)
        let total_count = await blogModel.find({}).countDocuments()
        if(req.body.title){
            total_count = await blogModel.find({title: req.body.title}).countDocuments()
        }
        let transformedData = []
        if(blogs.length > 0){
            transformedData = blogs.map(data => data.transform(data))
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
        const { error, value } = BlogSchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {

            let category = await categoriesModel.findOne({category_id: value.category_id})

            if(!category){
                return res.send({
                    status : 1,
                    message: "Category Not Found"
                });
            }

            value.category = category._id

            let tags = []

            for(let i = 0; i < value.tag_ids.length; i++){
                const tag = await tagsModel.findOne({tag_id: value.tag_ids[i]})
                if(tag){
                    tags.push(tag._id)
                }
                else{
                    return res.send({
                        status: 1,
                        message: "Tag Not Found !"
                    })
                }
            }

            value.tags = tags

            let avatar = gravatar.url(value.name, {s: '100', r: 'x', d: 'retro'}, true)

            if(value.avatar){
                let result = await uploadFile(value.avatar)

                if(result.status == 1){
                    return res.send(result)
                }

                avatar = req.protocol + '://' + req.get('host') + '/images/'+result.data.Key
            }

            value.avatar = avatar

            if(value.image){
                let result = await uploadFile(value.image)

                if(result.status == 1){
                    return res.send(result)
                }

                value.image = req.protocol + '://' + req.get('host') + '/images/'+result.data.Key
            }

            const blog = new blogModel(value)

            await blog.save()

            return res.send({
                status: 0,
                message: 'Blog Created Successfully !'
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
        const blog = await blogModel.findOne({blog_id: req.body.id})
        
        if(blog){

            return res.send({
                status: 0,
                data: blog.transform(blog,req.body?.lang)
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'blog Not Found !'
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
        const { error, value } = BlogSchema.validate(req.body, {
            abortEarly: false,
        });
        
        if (error) {
            const errors = validationResponse(error)
            return res.send({
                status : 1,
                errors
            });
        } else {
            const blog = await blogModel.findOne({blog_id: value.id})

            if(blog){

                let category = await categoriesModel.findOne({category_id: value.category_id})

            if(!category){
                return res.send({
                    status : 1,
                    message: "Category Not Found"
                });
            }

            value.category = category._id

            let tags = []

            for(let i = 0; i < value.tag_ids.length; i++){
                const tag = await tagsModel.findOne({tag_id: value.tag_ids[i]})
                if(tag){
                    tags.push(tag._id)
                }
                else{
                    return res.send({
                        status: 1,
                        message: "Tag Not Found !"
                    })
                }
            }

            value.tags = tags

            let avatar = gravatar.url(value.name, {s: '100', r: 'x', d: 'retro'}, true)

            if(value.avatar){
                let result = await uploadFile(value.avatar)

                if(result.status == 1){
                    return res.send(result)
                }

                avatar = req.protocol + '://' + req.get('host') + '/images/'+result.data.Key
            }

            value.avatar = avatar

            if(blog.avatar){
                const key = path.basename(blog.avatar)
                await deleteFileFromS3(key)
            }

            if(value.image){
                let result = await uploadFile(value.image)

                if(result.status == 1){
                    return res.send(result)
                }

                value.image = req.protocol + '://' + req.get('host') + '/images/'+result.data.Key
            }

            if(blog.image){
                const key = path.basename(blog.image)
                await deleteFileFromS3(key)
            }


            await blogModel.findOneAndUpdate({blog_id: req.body.id},value,{returnOriginal: false})
            
            return res.send({
                status: 0,
                message: 'Blog Updated Successfully !'
            })
            }
            else{
                return res.send({
                    status: 1,
                    message: 'Blog Not Found !'
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
        const blog = await blogModel.findOne({blog_id: req.body.id})
        
        if(blog){

            if(blog.avatar){
                const key = path.basename(blog.avatar)
                await deleteFileFromS3(key)
            }

            if(blog.image){
                const key = path.basename(blog.image)
                await deleteFileFromS3(key)
            }

            await blogModel.findOneAndDelete({blog_id: req.body.id})
            
            return res.send({
                status: 0,
                message: 'Blog Deleted Successfully !'
            })
        }
        else{
            return res.send({
                status: 1,
                message: 'Blog Not Found !'
            })
        }
        
    } catch (error) {
        return res.send({
            status: 1,
            message: error?.message
        })
    }
}