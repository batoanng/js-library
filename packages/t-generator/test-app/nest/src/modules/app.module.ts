import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common';

@Module({
  imports: [
    CommonModule,
    AuthModule,
  ],
})
export class ApplicationModule {}
