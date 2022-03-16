import {
	IsBoolean,
	IsEnum,
	IsNumber,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'
import { SortEnum } from '../enums/sort-enum'

export class FilterProductDto {
	@IsOptional()
	@IsString()
	keyword: string

	@IsOptional()
	@IsBoolean()
	available: boolean

	@IsOptional()
	@IsBoolean()
	gender: boolean

	@IsOptional()
	@IsNumber()
	@Min(0)
	amount: number

	@IsOptional()
	@IsEnum(SortEnum)
	sort: SortEnum
}
