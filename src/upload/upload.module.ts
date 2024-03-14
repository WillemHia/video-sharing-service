import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination: (_, file, cb) => {
          let uploadFolder = '';
          if (file.mimetype.startsWith('image/')) {
            uploadFolder = 'images';
          } else if (file.mimetype.startsWith('video/')) {
            uploadFolder = 'videos';
          }
          cb(null, join(__dirname, '..', '..', 'public', uploadFolder));
        },
        filename: (_, file, cb) => {
          const fileName = `${
            new Date().getTime() + extname(file.originalname)
          }`;
          return cb(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
