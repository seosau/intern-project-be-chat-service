import { ConfigModule, ConfigService } from '@nestjs/config';
import { RegisterQueueOptions, SharedBullAsyncConfiguration } from '@nestjs/bullmq';
import { QUEUE_CHAT_NAME } from '../chat/bullmq/chat.bull.constants';

export const bullMQConfig: SharedBullAsyncConfiguration = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
        const connectData = {
            host: config.get<string>('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
            password: config.get<string>('REDIS_PASSWORD'),
            username: config.get<string>('REDIS_USERNAME'),
            //Bat tls khi chay redis host 
            // tls: {},
            maxRetriesPerRequest: null,
        }
        console.log(connectData)
        return {
            connection: connectData
        }
    }
}

export const queueConfig: RegisterQueueOptions = {
  name: QUEUE_CHAT_NAME,
}