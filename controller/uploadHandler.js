const catchAsync = require("../utils/catchAsync");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const request = require('./../helpers/request')
const {uploadfileQuery, updateContatImage} = require('./../helpers/queries')


exports.uploadImage = catchAsync(async (req, res, next) =>{
    const { name, type, base64str, id } = req.body.input;

    let fileBuffer = Buffer.from(base64str,'base64')
    let streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                    console.log(error)
                  reject(error);
                }
              }
            );
    
           streamifier.createReadStream(fileBuffer).pipe(stream);
        });
    };
    
    async function upload(fileBuffer,id) {
        let result = await streamUpload(fileBuffer); 

        const response = await request(uploadfileQuery,{id})
         
      
    return res.json({
        image_url: result.url
      })
    }
    
    upload(fileBuffer, id);

})



exports.uploadContactImage =  async (req, res) => {

 
  const { name, type, base64str, id } = req.body.input;
 
  console.log('inside handler')
  const fileStr = base64str;
  const uploadedResponse = await cloudinary.uploader.upload(fileStr)
 console.log('we get here but not upload')
  console.log(uploadedResponse)
 
  const response = await request(updateContatImage,{id, image_url:uploadedResponse.url})
  
  return res.json({
    image_url: uploadedResponse.url
  })

}


// const { name, type, base64str, id } = req.body.input;

  // let fileBuffer = Buffer.from(base64str,'base64')



  
  
 
  // let streamUpload = (fileBuffer) => {
  //     return new Promise((resolve, reject) => {
  //         let stream = cloudinary.uploader.upload_stream(
  //           (error, result) => {
  //             if (result) {
  //               resolve(result);
  //             } else {
  //                 console.log(error)
  //               reject(error);
  //             }
  //           }
  //         );
  
  //        streamifier.createReadStream(fileBuffer).pipe(stream);
  //     });
  // };
  
  // async function upload(fileBuffer,id) {
  //     let result = await streamUpload(fileBuffer); 

  //     const response = await request(uploadfileQuery,{id})
       
  //    upload(fileBuffer, id);
  // return res.json({
  //     image_url: result.url
  //   })
  // }