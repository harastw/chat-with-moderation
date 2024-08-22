import { User } from '../user/user.entity';
import { Channel } from '../channel/channel.entity';
export declare class ChatService {
    private users;
    private channels;
    addUser(nickname: string): User;
    findUserById(userId: string): User | undefined;
    createChannel(name: string, creator: User): Channel;
    joinChannel(channelId: string, user: User): Channel;
    searchUsers(nickname: string): User[];
    removeUserFromChannel(channelId: string, userId: string, remover: User): Channel;
    getChannelUsers(channelId: string): User[];
}
