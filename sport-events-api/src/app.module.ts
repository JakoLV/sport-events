import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      "type": "sqlite",
      "database": "db.sqlite",
      "synchronize": true,
      "logging": false,
      "entities": ["src/**/*.entity.ts"],
      "migrations": ["src/migration/**/*.ts"],
      "subscribers": ["src/subscriber/**/*.ts"]
    }),
    EventsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
