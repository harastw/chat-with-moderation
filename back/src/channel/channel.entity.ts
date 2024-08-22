import { User } from '../user/user.entity';

export class Channel {
  id: string;
  name: string;
  users: User[] = [];
  creatorId: string;

  constructor(name: string, creator: User) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.name = name;
    this.creatorId = creator.id;
    this.users.push(creator);
  }
}
