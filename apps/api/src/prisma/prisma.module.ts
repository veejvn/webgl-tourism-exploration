import 'dotenv/config';
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { SqlitePrismaService } from './sqlite-prisma.service';

const USE_SQLITE = process.env.USE_SQLITE === 'true';

const prismaProvider = {
  provide: 'PRISMA_SERVICE',
  useClass: USE_SQLITE ? SqlitePrismaService : PrismaService,
};

@Global()
@Module({
  providers: [prismaProvider],
  exports: [prismaProvider],
})
export class PrismaModule {}
