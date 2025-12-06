import {Type} from '../enum/type';
import {FormControl} from '@angular/forms';

export interface FilterInterface{
  date: Date| string | null
  searchText:string | null
  type:Type | null
}

export interface FilterForm {
  date:FormControl<Date | string | null>
  searchText:FormControl<string |null>
  type:FormControl<Type | null>
}

export interface ListInterface {
  label:string
  value:Type
}
