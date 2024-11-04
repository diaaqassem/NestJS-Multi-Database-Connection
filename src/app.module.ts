import { Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IPVersion } from 'net';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number()
          .required()
          .integer()
          .message('Port must be a number or an integer number ( e.g. 3000)'),
      }),
      expandVariables: true,
    }),
    UsersModule,
    DatabaseModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: configService.get<string>('PG_HOST'),
        port: configService.get<number>('PG_PORT'),
        username: configService.get<string>('PG_USERNAME'),
        password: configService.get<string>('PG_PASSWORD'),
        database: configService.get<string>('PG_DB'),
        entities: [__dirname + '/**/*.entity.js'],
        // synchronize: true, // WARNING: do not use in production

        logging: true, // set to false if you don't want to see the SQL queries

        autoLoadEntities: true, // automatically load entities from the entities directory

        // ssl: {
        //   rejectUnauthorized: false,   // WARNING: do not use in production

        // },
        // dropSchema: true, // WARNING: do not use in production
      }),
    }),
  ],
  providers: [{ provide: APP_PIPE, useClass: ValidationPipe }],
})
export class AppModule {}
