import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { queueAsyncConfig } from "../bullMQ.config";
import { BullModule } from "@nestjs/bullmq";

@Module({
    imports: [
        BullModule.registerQueueAsync(queueAsyncConfig)
    ],
    providers: [PrismaService],
    exports: [PrismaService],
})

export class PrismaModule {}