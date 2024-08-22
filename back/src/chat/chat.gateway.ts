import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ChatService } from './chat.service';
import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('addUser')
  handleAddUser(@MessageBody() nickname: string): User {
    console.log('addUser', nickname);
    const user = this.chatService.addUser(nickname);
    return user;
  }

  @SubscribeMessage('createChannel')
  handleCreateChannel(
    @MessageBody() data: { name: string; creatorId: string },
  ): Channel {
    const creator = this.chatService.findUserById(data.creatorId);
    if (!creator) {
      throw new Error(`User with id ${data.creatorId} not found`);
    }
    const channel = this.chatService.createChannel(data.name, creator);
    this.server.emit('channelCreated', channel);
    return channel;
  }

  @SubscribeMessage('joinChannel')
  handleJoinChannel(
    @MessageBody() data: { channelId: string; userId: string },
  ): Channel {
    const user = this.chatService.findUserById(data.userId);
    if (!user) {
      throw new Error(`User with id ${data.userId} not found`);
    }
    const channel = this.chatService.joinChannel(data.channelId, user);
    this.server
      .to(channel.id)
      .emit('userJoined', { channelId: channel.id, user });
    return channel;
  }

  @SubscribeMessage('sendMessage')
  handleMessage(
    @MessageBody() data: { channelId: string; userId: string; message: string },
  ): void {
    const user = this.chatService.findUserById(data.userId);
    if (!user) {
      throw new Error(`User with id ${data.userId} not found`);
    }
    this.server
      .to(data.channelId)
      .emit('message', { user, message: data.message });
  }

  @SubscribeMessage('removeUser')
  handleRemoveUser(
    @MessageBody()
    data: {
      channelId: string;
      userId: string;
      removerId: string;
    },
  ): Channel {
    const remover = this.chatService.findUserById(data.removerId);
    if (!remover) {
      throw new Error(`Remover with id ${data.removerId} not found`);
    }
    const channel = this.chatService.removeUserFromChannel(
      data.channelId,
      data.userId,
      remover,
    );
    this.server
      .to(channel.id)
      .emit('userRemoved', { channelId: channel.id, userId: data.userId });
    return channel;
  }
}
