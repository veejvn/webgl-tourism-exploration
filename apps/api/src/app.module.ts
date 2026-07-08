import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { DestinationsModule } from './modules/destinations/destinations.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, DestinationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
