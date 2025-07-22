import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Conversation, CreateConversationRequest, CreateConversationResponse, GetConversationRequest, GetConversationResponse, GetListConversationRequest, GetListConversationResponse, SendMessageRequest, SendMessageResponse } from '../generated/chat';
import { reflectConversation, reflectMessage } from './chat.function';
import { RpcException } from '@nestjs/microservices';
import { error } from 'console';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaClient: PrismaClient,
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
      console.log('This conversation is already exist')
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

    return {
      message: reflectMessage(saved)
    };
  }
}
