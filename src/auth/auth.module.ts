import { forwardRef, Module  } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from './guards/jwt-guards';
import { JwtStrategy } from './guards/jwt-strategy';
import { RolesGuard } from './guards/roles.guards';
// import { JwtAuthGuard } from './guards/jwt-guards';
// import { JwtStrategy } from './guards/jwt-strategy';
// import { RoleGuard } from './guards/roles.guards';
import { AuthService } from './service/auth.service';

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => UserModule),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) =>({
                secret: configService.get('secret'),
                signOptions: {expiresIn: '10000s'}
            })
        })
    ],
    providers: [AuthService, RolesGuard , JwtAuthGuard,  JwtStrategy ],
    exports: [AuthService]
})
export class AuthModule {}
