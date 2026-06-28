import { Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

@Global()
@Module({
  providers: [
    {
      provide: 'DATA_SOURCE',
      useFactory: (dataSource: DataSource) => dataSource,
      inject: [getDataSourceToken()],
    },
  ],
  exports: ['DATA_SOURCE'],
})
export class DatabaseModule {}
