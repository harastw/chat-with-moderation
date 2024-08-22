export class User {
  id: string;
  nickname: string;

  constructor(nickname: string) {
    this.id = Math.random().toString(36).substring(2, 15);
    this.nickname = nickname;
  }
}
