import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CHAT_SERVICE_NAME, CreateConversationRequest, GetConversationRequest, GetListConversationRequest, SendMessageRequest } from '../generated/chat';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @GrpcMethod(CHAT_SERVICE_NAME,'CreateConversation')
  createConversation(data: CreateConversationRequest) {
    return this.chatService.createConversation(data);
  }

  @GrpcMethod(CHAT_SERVICE_NAME,'GetListConversation')
  findAllConversation(data: GetListConversationRequest) {
    return this.chatService.findAllConversation(data);
  }

  @GrpcMethod(CHAT_SERVICE_NAME,'GetConversation')
  findOneConversation(data: GetConversationRequest) {
    return this.chatService.findOneConversation(data);
  }

  // @GrpcMethod(CHAT_SERVICE_NAME,'updateChat')
  // update(updateChatDto: UpdateChatDto) {
  //   return this.chatService.update(updateChatDto.id, updateChatDto);
  // }

  // @GrpcMethod(CHAT_SERVICE_NAME,'removeChat')
  // remove(id: number) {
  //   return this.chatService.remove(id);
  // }

  @GrpcMethod(CHAT_SERVICE_NAME, 'SendMessage')
  sendMessage(data: SendMessageRequest) {
    return this.chatService.sendMessage(data);
  }
}
