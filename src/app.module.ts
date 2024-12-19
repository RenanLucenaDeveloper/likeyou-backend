import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './feedback/feedback.module';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: [".env"]}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (ConfigService: ConfigService) => ({
        type: "postgres",
        host: process.env.DATABASE_HOST || "localhost",
        port: ConfigService.get<number>("DATABASE_PORT"),
        username: ConfigService.get("DATABASE_USERNAME"),
        password: ConfigService.get("DATABASE_PASSWORD") || "",
        synchronize: ConfigService.get<boolean>("DATABASE_SYNC"),
        logging: ConfigService.get<boolean>("DATABASE_LOGGING"),
        database: ConfigService.get("DATABASE_NAME"),
        entities: [__dirname + "/**/*.entity{.ts,.js}"],
        migrations: [__dirname + '/migrations/*.{ts,js}'],
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
