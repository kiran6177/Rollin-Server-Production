import { connection } from "./adapters/database/connection.js";
import createServer from './frameworks/express.js'
import { KafkaService } from './events/kafkaclient.js'
import { TOPICS } from "./events/config.js";
const app = createServer();
connection()
const kafkaClient = new KafkaService()
kafkaClient.consumeMessage(TOPICS)

export default app