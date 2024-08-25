import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';

@Injectable()
export class ChatService {
  private users: User[] = [];
  private channels: Channel[] = [];

  addUser(nickname: string): User {
    const user = new User(nickname);
    this.users.push(user);
    return user;
  }

  findUserById(userId: string): User | undefined {
    return this.users.find((user) => user.id === userId);
  }

  createChannel(name: string, creator: User): Channel {
    const channel = new Channel(name, creator);
    this.channels.push(channel);

    return channel;
  }

  joinChannel(channelId: string, user: User): Channel {
    const channel = this.channels.find((c) => c.id === channelId);
    if (channel && !channel.users.some((u) => u.id === user.id)) {
      channel.users.push(user);
    }
    return channel;
  }

  searchUsers(nickname: string): User[] {
    return this.users.filter((user) => user.nickname.includes(nickname));
  }

  removeUserFromChannel(
    channelId: string,
    userId: string,
    remover: User,
  ): Channel {
    const channel = this.channels.find((c) => c.id === channelId);
    if (channel && channel.creatorId === remover.id) {
      channel.users = channel.users.filter((user) => user.id !== userId);
    }
    return channel;
  }

  getChannelUsers(channelId: string): User[] {
    const channel = this.channels.find((c) => c.id === channelId);
    return channel ? channel.users : [];
  }

  getAllChannels(): Channel[] {
    return this.channels;
  }
}
