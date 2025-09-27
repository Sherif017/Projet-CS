import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsString() id!: string;
  @IsString() name!: string;
  @IsNumber() latitude!: number;
  @IsNumber() longitude!: number;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() type?: string;
}
