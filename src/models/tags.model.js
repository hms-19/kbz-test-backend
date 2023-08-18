const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
    name : {
        type: String,
        required : true,
    },
    tag_id: Number,
},{
    timestamps: true,
})

schema.pre('save', async function (next) {
    const doc = this;
    if (doc.isNew) {
      try {
        const lastDoc = await mongoose.model('Tag', schema)
          .findOne({}, {}, { sort: { tag_id: -1 } }).exec();
  
        doc.tag_id = lastDoc ? lastDoc.tag_id + 1 : 1;
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
    ]
    let transformed = {}

    fields.forEach((field) => {
        transformed[field] = this[field];
    });

    transformed["id"] = this['tag_id']
    return transformed
  },
})

schema.statics = ({

  list({page = 1, per_page = 10}){

    let select = "tag_id name"

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

module.exports = mongoose.model('Tag', schema);



