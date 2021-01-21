import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: 'mongodb://mojkuran:mojkuran@cluster0-shard-00-00.3djpe.mongodb.net:27017,cluster0-shard-00-01.3djpe.mongodb.net:27017,cluster0-shard-00-02.3djpe.mongodb.net:27017/taskmanagement?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"',
      database: 'taskmanagement',
      authSource: 'admin',
      ssl: true,
      // url: 'mongodb://localhost:27017/nest-write?readPreference=primary',
      // ssl: false,
      // database: 'nest-write',
      useNewUrlParser: true,
      synchronize: true,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      useUnifiedTopology: true,
    }),
    TasksModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
