import S3 from 'react-aws-s3';
import Resizer from 'react-image-file-resizer';
import Amplify, { Auth, Hub, API, graphqlOperation, Storage } from 'aws-amplify';
import { v4 as uuidv4 } from 'uuid';

export  async function UploadToS3(data, callback)
{
    // const config = {
    //     bucketName: 'doodlelatestbuckte102925-prod',
    //     // dirName: '/', /* optional */
    //     region: 'ap-southeast-1',
    //     accessKeyId:'AKIAY23MY4J6JGDTUBMF',
    //     secretAccessKey: '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',
    //   }

      let name = uuidv4() + "_"+ data.name;
      Resizer.imageFileResizer(data,
        575,
        600,
        'WEBP',
        100,
        0,
        async uri => {
          try {
            var storage = await Storage.put( name,
              uri,
              {
                contentType: 'image/*'
              }
            );

            

            if(storage.key){
              console.log("storage" , storage)
              if(callback){
                callback(storage)
              }
              return storage
            }

           

          } catch (err) {

            console.log('Error uploading file: ', err);
          }

        },
        'file'
      )
}
