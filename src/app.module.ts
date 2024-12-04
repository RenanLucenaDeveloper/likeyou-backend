import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/user.entity';

const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'Churugu12',
  database: 'likeyou',
  entities: [User],
  synchronize: true,
}

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig),
    UserModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
