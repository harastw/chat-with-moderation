"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(nickname) {
        this.id = Math.random().toString(36).substring(2, 15);
        this.nickname = nickname;
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map