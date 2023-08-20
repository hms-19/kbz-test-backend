const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    title : {
        type: String,
        required : true,
    },
    description : {
        type: String,
        required : true,
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: false
    },
    read_time: {
        type: Number,
        required: true
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    category: {
        type: mongoose.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    blog_id: Number,
},{
    timestamps: true,
})

schema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
      try {
        const lastDoc = await mongoose.model('Blog', schema)
          .findOne({}, {}, { sort: { blog_id: -1 } }).exec();
  
        doc.blog_id = lastDoc ? lastDoc.blog_id + 1 : 1;
        next();
      } catch (err) {
        next(err);
      }
    } else {
      next();
    }
});

schema.methods = ({
  transform (data = this) {
    let fields = [
        'title',
        'description',
        'image',
        'author',
        'avatar',
        'read_time',
        'tags',
        'category',
        'createdAt'
    ]
    let transformed = {}

    fields.forEach((field) => {
        transformed[field] = this[field];
    });

    transformed["id"] = this['blog_id']
    return transformed
  },
})

schema.statics = ({

  list({page = 1, per_page = 10, title = '', category_id = '', tag_id = ''}){

    let populate = [
        {
            path: 'tags',
            select: {_id: 0, name: '$name', id: '$tag_id' },                    
            model: 'Tag',
            options: { lean: true },
        },
        {
            path: 'category',
            select: {_id: 0, name: '$name', id: '$category_id' },                    
            model: 'Category',
            options: { lean: true },
        },
    ]

    let select = "-updatedAt -__v -_id"

    let filter = {}
        
    if(title != ''){
        let regex = new RegExp(title, 'i') 

        filter = {title: {$regex: regex}}
    }

    if(category_id != ''){
        filter = {category: category_id}
    }

    if(tag_id != ''){
        filter = {tags: tag_id}
    }

    return this.find(filter)
      .populate(populate)
      .select(select)
      .sort({createdAt: -1 })
      .skip(per_page * (page - 1))
      .limit(per_page)
      .exec();
  },

  population(){
    let populate = [
        {
            path: 'tags',
            select: {_id: 0, name: '$name', id: '$tag_id' },                    
            model: 'Tag',
            options: { lean: false },
        },
        {
            path: 'category',
            select: {_id: 0, name: '$name', id: '$category_id' },                    
            model: 'Category',
            options: { lean: false },
        },
    ]

    return populate
  }

})

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Blog', schema);



