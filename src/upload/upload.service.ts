import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { unlink } from 'fs/promises';

@Injectable()
export class UploadService {
  constructor(private userService: UserService) {}

  async updateAvatar(id: number, avatar: string, oldAvatar: string) {
    //删除旧头像
    if (oldAvatar && oldAvatar !== 'default.jpg') {
      await unlink('public/images/' + oldAvatar);
    }
    return this.userService.updateAvatar(id, avatar);
  }

  async updateBackground(
    id: number,
    backgroundImg: string,
    oldBackgroundImg: string,
  ) {
    //删除旧背景
    if (oldBackgroundImg && oldBackgroundImg !== 'default.jpg') {
      await unlink('public/images/' + oldBackgroundImg);
    }
    return this.userService.updateBackground(id, backgroundImg);
  }

  async deletePoster(poster: string) {
    if (poster) {
      await unlink('public/images/' + poster);
    }
  }
}
