const mongoose = require("mongoose") 
const { mongo, env } = require("./vars");
mongoose.Promise = Promise;

mongoose.connection.on('error', (err) => {
    console.log("ERROR == " + err)
    process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connect = async () => {
    mongoose
	  .connect(mongo.uri,  {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
	.then(() => {
		console.log("MongoDb connected !")
	})

    return mongoose.connection;   
}
