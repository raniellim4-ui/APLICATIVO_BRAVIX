import {
  IsString,
  IsNumber,
  IsDate,
  IsUUID,
  MinLength,
  MaxLength,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVehicleDto {
  @IsUUID('4', { message: 'Company ID deve ser um UUID válido' })
  companyId: string;

  @IsString({ message: 'Placa deve ser uma string' })
  @MinLength(6, { message: 'Placa deve ter no mínimo 6 caracteres' })
  @MaxLength(10, { message: 'Placa deve ter no máximo 10 caracteres' })
  plate: string;

  @IsString()
  @MaxLength(255)
  model: string;

  @IsString()
  @MaxLength(255)
  make: string;

  @IsNumber()
  @Min(1990)
  @Max(2100)
  year: number;

  @IsString()
  @MinLength(17)
  @MaxLength(17)
  vin: string;

  @Type(() => Date)
  @IsDate({ message: 'Data de registro deve ser uma data válida' })
  registrationDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  crlvNumber?: string;

  @IsOptional()
  @IsString()
  @MaxLength(11)
  renavam?: string;
}
