import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';
export declare class ChatGateway {
    private readonly chatService;
    server: Server;
    constructor(chatService: ChatService);
    handleAddUser(nickname: string): User;
    handleCreateChannel(data: {
        name: string;
        creatorId: string;
    }): Channel;
    handleJoinChannel(data: {
        channelId: string;
        userId: string;
    }): Channel;
    handleMessage(data: {
        channelId: string;
        userId: string;
        message: string;
    }): void;
    handleRemoveUser(data: {
        channelId: string;
        userId: string;
        removerId: string;
    }): Channel;
}
