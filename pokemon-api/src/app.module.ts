import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PokemonsModule } from './pokemons/pokemons.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Verifica se existe uma string de conexão fornecida (como a da Neon no Render)
        const databaseUrl = configService.get<string>('DATABASE_URL');

        // Se existir DATABASE_URL, usa ela e ativa o SSL (Necessário para a nuvem)
        if (databaseUrl) {
          return {
            type: 'postgres',
            url: databaseUrl,
            autoLoadEntities: true,
            synchronize: true, // Mantém true para facilitar o deploy do desafio
            ssl: true,
            extra: {
              ssl: {
                rejectUnauthorized: false,
              },
            },
          };
        }

        // Se não existir, volta para a configuração local que você já tinha
        return {
          type: 'postgres',
          host: configService.get<string>('DATABASE_HOST'),
          port: Number(configService.get<string>('DATABASE_PORT')),
          username: configService.get<string>('DATABASE_USER'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          database: configService.get<string>('DATABASE_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    AuthModule,
    UsersModule,
    PokemonsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}