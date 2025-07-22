import { Message, Conversation } from "@prisma/client"
import { Message as MessageProto, Conversation as ConversationProto } from "src/generated/chat"

export const reflectMessage = (data: any) => {
    const result: MessageProto ={
        id: data.id ?? '',
        senderId: data.senderId ?? '',
        conversationId: data.conversationId ?? '',
        content: data.content ?? '',
        updatedAt: !!data.updatedAt ? data.updatedAt.toISOString() : '',
        createdAt: !!data.createdAt ? data.createdAt.toISOString() : '',
        deletedAt: !!data.deletedAt ? data.deletedAt.toISOString() : '',
    }

    return result;
}

export const reflectConversation = (data: any) => {
    const result: ConversationProto = {
        id: data.id,
        memberIds: data.memberIds,
        type: data.type,
        updatedAt: !!data.updatedAt ? data.updatedAt.toISOString() : '',
        createdAt: !!data.createdAt ? data.createdAt.toISOString() : '',
        deletedAt: !!data.deletedAt ? data.deletedAt.toISOString() : '',
    }

    return result
}