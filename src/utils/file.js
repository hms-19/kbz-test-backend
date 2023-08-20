const { getRandomNumbers } = require(".");
const { uploadFileToS3, getFileStream } = require("../config/s3");
const { file } = require("../config/vars");
exports.getFileExtensionFromBase64 = (base64Data) => {
    const dataUrlRegex = /^data:image\/(\w+);base64,/;
    const matches = base64Data.match(dataUrlRegex);
  
    if (matches && matches.length > 1) {
      return matches[1].toLowerCase();
    }
  
    return null;
}

exports.checkBase64FileSize = (base64Data)  => {
  const buffer = Buffer.from(base64Data, 'base64');
  const fileSizeInBytes = buffer.length;
  const fileSizeInKB = fileSizeInBytes / 1024;
  return fileSizeInKB;
}

exports.isBase64Image = (str) => {
  const base64ImageRegex = /^data:image\/(jpeg|jpg|png|gif|webp|avif);base64,/;
  return base64ImageRegex.test(str);
}

exports.uploadFile = async (base64) => {
    if(this.isBase64Image(base64)){
      const fileSizeKB = this.checkBase64FileSize(base64);
      const fileExtension = this.getFileExtensionFromBase64(base64);
      if(fileExtension == null){
          fileExtension = 'png'
      }
      const fileName = getRandomNumbers()+Date.now()+ '.'+fileExtension;
      const base64Image = base64.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
      
      if(fileSizeKB > file.upload_image_size){
          return {
            status: 1,
            message: 'File size should be under '+ file.upload_image_size+' KB'
        }
      }

      let data = await uploadFileToS3(base64Image,fileName)
      
      return {
        status: 0,
        data
      }

  }
  else{
      return {
        status: 1,
        message: 'Image is not Base64 .'
    }
  }
}

exports.getImage = async (req, res) => {

  const key = req.params.key

  const readStream = getFileStream(key)
  
  readStream.on('error', (err) => {
    console.error('Error reading image:', err);
  });

  readStream.pipe(res)

}