import {FilterInterface} from './filter.interface';
import {PaginationRequest} from './pagination-request';

export interface FilterTriggerEvent {
  kind: 'filter';
  filter: FilterInterface;
}

export interface PageTriggerEvent {
  kind: 'page';
  page: PaginationRequest;
}

export type TriggerEvent = FilterTriggerEvent | PageTriggerEvent;

export interface QueryState {
  filter: FilterInterface;
  page: PaginationRequest;
}
