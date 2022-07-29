import { Global, Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [
    {
      inject: [ConfigService],
      provide: PrismaClient,
      useFactory: (config: ConfigService) => {
        return new PrismaClient({
          datasources: {
            db: {
              url: config.get('DATABASE_URL'),
            },
          },
        });
      },
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
