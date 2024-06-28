import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: path.join(__dirname, '../../../shared', 'jobs.sqlite'), // 使用绝对路径
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
};
