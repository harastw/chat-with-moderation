import { User } from '../user/user.entity';
export declare class Channel {
    id: string;
    name: string;
    users: User[];
    creatorId: string;
    constructor(name: string, creator: User);
}
