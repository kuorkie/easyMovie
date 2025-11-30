import {MovieInterface} from './movie.interface';

export interface PaginationResponse {
  Search: MovieInterface[]
  totalResults: number
  Response: string
}
