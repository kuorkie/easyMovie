import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MovieInterface} from '../interfaces/movie.interface';
import {FilterInterface} from '../interfaces/filter.interface';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http:HttpClient) { }

  getMovie():Observable<MovieInterface[]>{
    return this.http.get<MovieInterface[]>('https://ghibliapi.vercel.app/films',{
    })
  }

  filterOn(value:FilterInterface):boolean{
    return Object.values(value).filter(item=> item ).length > 0
  }

}
