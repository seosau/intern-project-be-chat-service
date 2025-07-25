import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';
import { BullModule } from '@nestjs/bullmq';
import { queueConfig } from '../configs/bullMQ.config';
import { ConfigModule } from '@nestjs/config';
// import { ChatBullProcessor } from './bullmq/chat.bull.processor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.registerQueue(queueConfig)
  ],
  controllers: [ChatController],
  providers: [
    ChatService, 
    PrismaClient, 
    // ChatBullProcessor
  ],
})
export class ChatModule {}
