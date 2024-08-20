import { Kafka } from 'kafkajs';
import { ConsumeManager } from './consumeManager.js';

export class KafkaService{
    constructor(){
        this.kafka = new Kafka({
            clientId:'rollin-kafka',
            brokers : ['127.0.0.1:9092']
        })
        this.producer = this.kafka.producer()
        this.consumer = this.kafka.consumer({groupId:'movie-svc'})
        this.manager = new ConsumeManager()

    }

    async produceMessage(topic,message){
        try {
            await this.producer.connect()
            await this.producer.send({
                topic:topic,
                messages:[{
                    value: JSON.stringify(message)
                }]
            })
            console.log("Message Send!!");
        } catch (error) {
            console.log(error);
        }finally{
            await this.producer.disconnect()
        }
    }

    async consumeMessage(topics){
        try {
            if(!topics || topics?.length === 0){
                throw new Error('Unable to connect to Invalid Topic.')
            }
            await this.consumer.subscribe({topics:topics,fromBeginning:true});//topics should be an array
            await this.consumer.run({
                eachMessage:async ({topic,partition,message})=>{
                    console.log("TOPIC : ",topic);
                    // console.log("PARTITION : ",partition);
                    // console.log("MESSAGE : ",message?.value?.toString());
                    const messageObj = JSON.parse(message?.value?.toString())
                    console.log("CONSUMER",messageObj);
                    const { type , value } = messageObj;
                    await this.manager.manageConsumer(type,value)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }
}