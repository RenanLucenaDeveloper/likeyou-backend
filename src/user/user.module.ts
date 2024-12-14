import { Module, OnModuleInit } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { FeedbackModule } from 'src/feedback/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    FeedbackModule
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository]
})
export class UserModule {}
