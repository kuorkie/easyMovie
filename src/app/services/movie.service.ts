import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MovieInterface} from '../interfaces/movie.interface';
import {FilterInterface} from '../interfaces/filter.interface';
import {PaginationResponse} from '../interfaces/pagination-response';
import {MovieDetail} from '../interfaces/movie-detail';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }

  getMovie(page:number,searchText:string):Observable<PaginationResponse>{
    return this.http.get<PaginationResponse>('https://www.omdbapi.com/',{
      params:{
        apikey:"f390154",
        page:page,
        s:searchText
      }
    })
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
