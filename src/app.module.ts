import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: [".local.env"]}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: "postgres",
        host: ConfigService.get("DATABASE_HOST"),
        port: ConfigService.get<number>("DATABASE_PORT"),
        username: ConfigService.get("DATABASE_USERNAME"),
        password: ConfigService.get("DATABASE_PASSWORD"),
        synchronize: ConfigService.get<boolean>("DATABASE_SYNC"),
        logging: ConfigService.get<boolean>("DATABASE_LOGGING"),
        database: ConfigService.get("DATABASE_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
      })
    }),
    AuthModule,
    UserModule,
    FeedbackModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
