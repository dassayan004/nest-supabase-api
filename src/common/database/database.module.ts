// import { Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import {
//   PrismaModule,
//   providePrismaClientExceptionFilter,
// } from 'nestjs-prisma';
// import { ConfigSchema } from '../config/schema';
// import { PrismaPg } from '@prisma/adapter-pg';

// @Module({
//   imports: [
//     PrismaModule.forRootAsync({
//       isGlobal: true,
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService<ConfigSchema>) => {
//         const isDev = configService.get('NODE_ENV') !== 'production';
//         return {
//           prismaOptions: {
//             adapter: new PrismaPg({
//               connectionString: configService.getOrThrow('DATABASE_URL'),
//             }),
//             log: isDev ? ['query', 'info', 'warn', 'error'] : ['error', 'warn'],
//             errorFormat: 'pretty',
//           },
//         };
//       },
//     }),
//   ],
//   providers: [providePrismaClientExceptionFilter()],
// })
// export class DatabaseModule {}
