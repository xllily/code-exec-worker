import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: 3003,  // 确保这个端口和 command 服务中的配置一致
    },
  });

  await app.startAllMicroservices();
  await app.listen(3001);  // 确保这个端口和 command 服务不同
}
bootstrap();
