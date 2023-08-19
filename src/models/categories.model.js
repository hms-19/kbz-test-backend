const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
    },
    blogs_count: {
      type: Number,
      default: 0
    },
    category_id: Number,
},{
    timestamps: true,
})

schema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
      try {
        const lastDoc = await mongoose.model('Category', schema)
          .findOne({}, {}, { sort: { category_id: -1 } }).exec();
  
        doc.category_id = lastDoc ? lastDoc.category_id + 1 : 1;
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
        'name',
        'blogs_count'
    ]
    let transformed = {}

    fields.forEach((field) => {
        transformed[field] = this[field];
    });

    transformed["id"] = this['category_id']
    return transformed
  },
})

schema.statics = ({

  list({page = 1, per_page = 10}){

    let select = "category_id name blogs_count"

    if(per_page == 'all'){
      return this.find({})
        .select(select)
        .sort({createdAt: -1 })
        .exec();  
    }
    
    return this.find({})
      .select(select)
      .sort({createdAt: -1 })
      .skip(per_page * (page - 1))
      .limit(per_page)
      .exec();
  },

})

schema.plugin(uniqueValidator);

module.exports = mongoose.model('Category', schema);



