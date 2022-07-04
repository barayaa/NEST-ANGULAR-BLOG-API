import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserModule } from './user/user.module';



@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATA_BASE,
      autoLoadEntities: true,
      synchronize: true
    }),
    UserModule,
  
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
