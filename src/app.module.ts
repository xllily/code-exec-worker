import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerModule } from './worker/worker.module';
import { typeOrmConfig } from './worker/typeorm.config'; // 导入 TypeORM 配置
import { mongooseConfig } from './worker/mongoose.config'; // 导入 Mongoose 配置

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig), // 使用 TypeORM 配置
    MongooseModule.forRoot(mongooseConfig.uri), // 使用 Mongoose 配置
    WorkerModule,
  ],
})
export class AppModule { }
