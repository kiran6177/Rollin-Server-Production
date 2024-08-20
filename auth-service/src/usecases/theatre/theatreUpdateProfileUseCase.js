import { AUTH_TOPIC, TYPE_THEATRE_UPDATED } from "../../events/config.js";
import { KafkaService } from "../../events/kafkaclient.js";
import { AwsConfig } from "../../utils/aws-s3.js";
const THEATRE_OWNER = 'theatre'

export class TheatreProfileUpdate{
    constructor(dependencies){
        this.theatreRepository = new dependencies.Repositories.MongoTheatreRepository()
        this.awsConfig = new AwsConfig()
        this.kafkaClient = new KafkaService()
    }

    async execute(body,files){
        try {
            const {id,name,email,location,street,landmark,city,state,pincode,latlng,deleted} = JSON.parse(body);
            console.log(id,name,email,location,street,landmark,city,state,pincode,latlng,deleted);
            console.log(files);
            const theatreExist = await this.theatreRepository.findTheatreById(id)
            console.log(theatreExist);
            if(theatreExist !== null){
                const dataToUpdate = {
                    name:name ? name : theatreExist.name,
                    location:{
                        coordinates : [ latlng ? latlng.lat : theatreExist.location.coordinates[0] , latlng ? latlng.lng : theatreExist.location.coordinates[1]]
                    },
                    address:{
                        street:street ? street : theatreExist.street,
                        landmark:landmark ? landmark : theatreExist.landmark,
                        city:city ? city : theatreExist.city,
                        state:state ? state : theatreExist.state,
                        pincode:pincode ? pincode : theatreExist.pincode,
                        completeLocation:location ? location : theatreExist.location
                    },
                }

                if(email !== theatreExist.email){
                    dataToUpdate.email = email
                    dataToUpdate.isVerified = false
                }

                let imagesAfterDelete = [];

                    if(deleted.length > 0){
                        for(let image of theatreExist.images){
                            let imageStatus = true;
                            for(let deletedImage of deleted){
                                if(image === deletedImage){
                                    imageStatus = false;
                                    break;
                                }
                            }
                            if(imageStatus){
                                imagesAfterDelete.push(image)
                            }
                        }
                        let deleteLength = deleted.length;
                        let removedLength = 0;
                        for(let deletedImage of deleted){
                            const deleteSuccess = await this.awsConfig.deleteImage(deletedImage,THEATRE_OWNER);
                            if(deleteSuccess){
                                console.log("deleted");
                                removedLength++;
                            }
                        }
                        if(removedLength !== deleteLength){
                            const error = new Error();
                            error.statusCode = 500;
                            error.reasons = ['Unable to delete Image. Please retry.'];
                            throw error;
                        }

                    }

                    let fileNameArray = []

                    if(files.length > 0){
                        let fileLength = files.length;
                        let successLength = 0;
                            for(let file of files){
                                console.log(file);
                                const filename = Date.now()+file.originalname;
                                const trimmed = filename.replace(/\s+/g, "");
                                console.log(trimmed);
                                fileNameArray.push(trimmed);
                            const result = await this.awsConfig.uploadImage(trimmed,file.buffer,file.mimetype,THEATRE_OWNER)
                                if(result){
                                    console.log("uploaded");
                                    successLength++;
                                }
                            }
                        // console.log(fileLength,successLength);
                        if(successLength !== fileLength){
                            const error = new Error();
                            error.statusCode = 500;
                            error.reasons = ['Unable to upload Image. Please retry.'];
                            throw error;
                        }
                    }
                    const addedImages = [...fileNameArray,...imagesAfterDelete]
                    dataToUpdate.images = addedImages.length > 0 ? addedImages : theatreExist.images;
                    console.log("READY",dataToUpdate);
                const updated = await this.theatreRepository.updateTheatreById(id,dataToUpdate);
                    let imagesdata = []
                    if(updated.images && updated.images.length > 0){
                        for(let image of updated.images){
                            const url = await this.awsConfig.getImage(image,THEATRE_OWNER)
                            if(url){
                                imagesdata.push({url,filename:image})
                            }else{
                                // write image fetch error code
                            }
                        }
                    }else{
                        // no image added 
                    }   
                if(updated){
                    const theatreDataWOP = {
                        id:updated._id,
                        name:updated.name,
                        email:updated.email,
                        images:imagesdata,
                        isCompleted:updated.isCompleted,
                        isVerified:updated.isVerified,
                        isBlocked:updated.isBlocked,
                        isAccepted:updated.isAccepted,
                        authType:updated.authType,
                        location:updated.location,
                        address:updated.address,
                    }
                    const {id,...rest} = theatreDataWOP;
                    const dataToPub = {
                        ...rest,
                        _id:id
                    }
                    this.kafkaClient.produceMessage(AUTH_TOPIC,{
                        type:TYPE_THEATRE_UPDATED,
                        value:JSON.stringify(dataToPub)
                    })
                    return theatreDataWOP
                }else{
                    const error = new Error()
                    error.statusCode = 400;
                    error.reasons = ['Updation Error!!'];
                    throw error;
                }
            }else{
                const error = new Error();
                error.statusCode = 500;
                error.reasons = ['Unable to update profile!!'];
                throw error
            }
        } catch (err) {
            const error = new Error(err.message)
            error.statusCode = err.statusCode;
            error.reasons = err.reasons;
            throw error;
        }
    }
}