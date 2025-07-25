import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Conversation, CreateConversationRequest, CreateConversationResponse, GetConversationRequest, GetConversationResponse, GetListConversationRequest, GetListConversationResponse, Message, SendMessageRequest, SendMessageResponse } from '../generated/chat';
import { reflectConversation, reflectMessage } from './chat.function';
import { RpcException } from '@nestjs/microservices';
import { error } from 'console';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_CHAT_NAME, SEND_MESSAGE_CHAT_JOB_NAME } from './bullmq/chat.bull.constants';
import { Queue } from 'bullmq';
import { APP_CONFIG } from '../configs/app.config';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaClient: PrismaClient,
    @InjectQueue(QUEUE_CHAT_NAME)
    private readonly chatQueue: Queue,
  ){}
  async createConversation(data: CreateConversationRequest): Promise<CreateConversationResponse> {
    const existed = await this.prismaClient.conversation.findFirst({
      where: {
        memberIds: {
          hasEvery: data.memberIds
        },
        type: data.type,
        deletedAt: null,
      }
    })
    if(existed && existed.memberIds.length === data.memberIds.length) {
      throw new RpcException('This conversation is already exist')
    }
    const created = await this.prismaClient.conversation.create({
      data: data
    })

    const resq: Conversation = reflectConversation(created);
    return resq;
  }

  async findAllConversation(data: GetListConversationRequest): Promise<GetListConversationResponse> {
    const resq = await this.prismaClient.conversation.findMany({
      where: {
        memberIds: {
          has: data.userId,
        },
        deletedAt: null
      },
      include:{
        messages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1,
        }
      }
    })

    const conversations: GetConversationResponse[] = resq.map((conver) =>  ({
      conversation: reflectConversation(conver),
      messageList: conver.messages.map((messa) => reflectMessage(messa))
    }))

    return {
      conversations
    };
  }

  async findOneConversation (data: GetConversationRequest): Promise<GetConversationResponse> {
    const resq = await this.prismaClient.conversation.findFirst({
      where: {
        id: data.conversationId,
        deletedAt: null,
      },
      include: {
        messages: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            createdAt: 'desc',
          }
        }
      }
    })

    const toResq: GetConversationResponse = {
      conversation: reflectConversation(resq),
      messageList: resq ? resq.messages.map((message) => reflectMessage(message)) : [],
    }
    return toResq;
  }

  // update(id: number, updateChatDto: UpdateChatDto) {
  //   return `This action updates a #${id} chat`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} chat`;
  // }

  async sendMessage (data: SendMessageRequest): Promise<SendMessageResponse> {
    const saved = await this.prismaClient.message.create({
      data
    })
    const toResq: Message = reflectMessage(saved)

    this.chatQueue.add(APP_CONFIG.QUEUE_CHAT_NAME_SEND_MESSAGE, {message: toResq}) 
    return {
      message: toResq
    };
  }
}
