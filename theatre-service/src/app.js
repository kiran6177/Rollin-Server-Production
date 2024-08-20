import { connection } from "./adapters/database/connection.js";
import { TOPICS } from "./events/config.js";
import { KafkaService } from "./events/kafkaclient.js";
import createServer from './frameworks/express.js'

const app = createServer();
connection()
const kafkaClient = new KafkaService()
kafkaClient.consumeMessage(TOPICS)

export default app