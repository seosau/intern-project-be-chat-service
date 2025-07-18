import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: process.env.CHAT_GRPC_URL || '0.0.0.0:50054',
      package: process.env.CHAT_GRPC_PACKAGE_NAME || 'chat',
      protoPath: join(__dirname, '../proto/chat.proto')
    }
  });
  await app.listen(); 
}
bootstrap();
