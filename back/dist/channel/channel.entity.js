"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
class Channel {
    constructor(name, creator) {
        this.users = [];
        this.id = Math.random().toString(36).substring(2, 15);
        this.name = name;
        this.creatorId = creator.id;
        this.users.push(creator);
    }
}
exports.Channel = Channel;
//# sourceMappingURL=channel.entity.js.map