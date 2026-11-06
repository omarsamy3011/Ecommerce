import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, NotFoundException } from '@nestjs/common';
import { error } from 'console';
import { object, ZodType } from 'zod';
import { isObject } from 'zod/v4/core/util.cjs';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    constructor(private Schema : ZodType){}
  transform(value: any, metadata: ArgumentMetadata) {
    const result = this.Schema.safeParse(value)
    if(!result.success){
        throw new BadRequestException({
            message:'validation Error',
            cause:{
                error : result.error.issues
            }
        })
    }
    return value;
  }
}