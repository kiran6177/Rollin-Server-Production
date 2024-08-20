import { S3Client, PutObjectCommand , GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export class AwsConfig{
    constructor(){
        this.bucketName = process.env.S3_BUCKET_NAME
        this.bucketRegion = process.env.S3_BUCKET_REGION
        this.bucketAccessKey = process.env.S3_ACCESS_KEY
        this.bucketSecretKey = process.env.S3_SECRET_ACCESS_KEY
        this.s3client = new S3Client({
            credentials:{
                accessKeyId:this.bucketAccessKey,
                secretAccessKey:this.bucketSecretKey
            },
            region:this.bucketRegion
        })
    }

    async uploadImage(filename,buffer,filetype,owner){
        try {
            const options = {
                Bucket: this.bucketName,
                Key: `${owner}/${filename}`,
                Body:buffer,
                ContentType:filetype
            }
            const putCommand = new PutObjectCommand(options)
            await this.s3client.send(putCommand);
            return true
        } catch (err) {
            console.log(err);
            return false
        }
    }   

    async getImage(filename,owner){
        try {
            const options = {
                Bucket:this.bucketName,
                Key:`${owner}/${filename}`
            }
            const getCommand = new GetObjectCommand(options);
            const url = await getSignedUrl(this.s3client,getCommand,{expiresIn: 60 * 15})
            return url
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async deleteImage(filename,owner){
        try {
            const options = {
                Bucket:this.bucketName,
                Key:`${owner}/${filename}`
            }
            const deleteCommand = new DeleteObjectCommand(options);
            await this.s3client.send(deleteCommand);
            return true
        } catch (error) {
            console.log(error);
            return false
        }
    }
}