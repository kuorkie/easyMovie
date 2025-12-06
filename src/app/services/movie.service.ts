import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MovieInterface} from '../interfaces/movie.interface';
import {FilterForm, FilterInterface} from '../interfaces/filter.interface';
import {PaginationResponse} from '../interfaces/pagination-response';
import {MovieDetail} from '../interfaces/movie-detail';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }

  getMovie(page:number,filter:FilterInterface):Observable<PaginationResponse>{
    const { searchText, date, type } = filter;
    const key = "f390154"
    let params = new HttpParams().set('page', page.toString());
    params = params.set('apiKey',key)
    params = this.setIfDefined(params, 's', searchText);
    params = this.setIfDefined(params, 'y', date);
    params = this.setIfDefined(params, 'type', type);

    return this.http.get<PaginationResponse>('https://www.omdbapi.com/',{params})
  }

  private setIfDefined(params: HttpParams, key: string, value: unknown): HttpParams {
    if (value === null || value === undefined || value === '') {
      return params;
    }
    return params.set(key, String(value));
  }

  getDetail(code:string):Observable<MovieDetail>{
    return this.http.get<MovieDetail>('https://www.omdbapi.com/',{
      params:{
        apikey:"f390154",
        i:code
      }
    })
  }


  filterOn(value:FilterInterface):boolean{
    return Object.values(value).filter(item=> item ).length > 0
  }

}
