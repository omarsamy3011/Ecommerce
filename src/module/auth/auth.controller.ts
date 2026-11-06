import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomValidationPipe } from '../../common/pipe/validation.pipe';
import { registerSchema } from './auth.validation';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(
    FileInterceptor('image', {
      dest: './uploads',
      //storage:5*1024*1024,
      //   fileFilter:(req:any , file:any,call)=>{
      //     if(file.mimetype ==)
      // }
    }),
  )
  create(
    @Body(new CustomValidationPipe(registerSchema))
    createAuthDto: CreateAuthDto,
    @UploadedFile() file: any,
  ) {
    return this.authService.create(createAuthDto, file);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
