import { Module } from '@nestjs/common';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './configs/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { bullMQConfig } from './configs/bullMQ.config';

@Module({
  imports: [
    ChatModule, 
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync(bullMQConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
