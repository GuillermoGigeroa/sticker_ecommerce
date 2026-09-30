import { FilterType } from '../enums/filter-type.enum';

export interface FilterConfig {
  type: FilterType;
  name: string;
  cssFilter: string;
  canvasFilter: string;
}
