"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
const user_entity_1 = require("../user/user.entity");
const channel_entity_1 = require("../channel/channel.entity");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleAddUser(nickname) {
        console.log('addUser', nickname);
        const user = this.chatService.addUser(nickname);
        return user;
    }
    handleCreateChannel(data) {
        const creator = this.chatService.findUserById(data.creatorId);
        if (!creator) {
            throw new Error(`User with id ${data.creatorId} not found`);
        }
        const channel = this.chatService.createChannel(data.name, creator);
        this.server.emit('channelCreated', channel);
        return channel;
    }
    handleJoinChannel(data) {
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
    handleMessage(data) {
        const user = this.chatService.findUserById(data.userId);
        if (!user) {
            throw new Error(`User with id ${data.userId} not found`);
        }
        this.server
            .to(data.channelId)
            .emit('message', { user, message: data.message });
    }
    handleRemoveUser(data) {
        const remover = this.chatService.findUserById(data.removerId);
        if (!remover) {
            throw new Error(`Remover with id ${data.removerId} not found`);
        }
        const channel = this.chatService.removeUserFromChannel(data.channelId, data.userId, remover);
        this.server
            .to(channel.id)
            .emit('userRemoved', { channelId: channel.id, userId: data.userId });
        return channel;
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('addUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", user_entity_1.User)
], ChatGateway.prototype, "handleAddUser", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('createChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", channel_entity_1.Channel)
], ChatGateway.prototype, "handleCreateChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinChannel'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", channel_entity_1.Channel)
], ChatGateway.prototype, "handleJoinChannel", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('removeUser'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", channel_entity_1.Channel)
], ChatGateway.prototype, "handleRemoveUser", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        },
    }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map