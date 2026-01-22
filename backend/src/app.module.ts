import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ItemsModule } from './items/items.module';
import { Item } from './items/entities/item.entity';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    // 1. Метрики (создаст /metrics)
    PrometheusModule.register(),

    // 2. База Данных
    TypeOrmModule.forRoot({
      type: 'postgres',
      // В докере хост 'postgres', локально 'localhost'. Переменная решает.
      url: process.env.DATABASE_URL || 'postgres://user:pass@postgres:5432/idp_db', 
      entities: [Item],
      synchronize: true, // Dev only!
    }),

    // 3. Наш модуль айтемов
    ItemsModule,
  ],
  controllers: [
    HealthController // <--- Регистрируем HealthController
    // AppController можно удалить, если он пустой и не нужен
  ],
  providers: [],
})
export class AppModule {}
