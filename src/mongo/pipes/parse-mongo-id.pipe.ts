import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform<string, string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    // validate that the value is valid mongo id
    // (replace this with your own validation logic)
    if (!/^([0-9a-fA-F]{24})$/.test(value)) {
      throw new BadRequestException(`Invalid mongo id "${value}"`);
    }
    return value;
  }
}
