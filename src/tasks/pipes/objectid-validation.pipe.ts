import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ObjectId } from "mongodb";

export class ObjectidValidationPipe implements PipeTransform {
  transform(value: any) {
    if (!this.isObjectId(value)) {
      throw new BadRequestException(`${value} is an invalid TaskID`)
    }
    return value
  }

  private isObjectId(value: any) {
    return ObjectId.isValid(value)
  }
}