import {Component, model} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {MovieService} from '../../services/movie.service';
import {MovieInterface} from '../../interfaces/movie.interface';
import {ButtonModule} from 'primeng/button';
import {GalleriaModule} from 'primeng/galleria';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem} from 'primeng/api';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {Ripple} from 'primeng/ripple';
import { Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MovieFilterComponent} from '../movie-filter/movie-filter.component';
import {FilterInterface} from '../../interfaces/filter.interface';
import {DialogModule} from 'primeng/dialog';
import {MovieDetailComponent} from '../movie-detail/movie-detail.component';

@Component({
  selector: 'app-catalog-movie',
  standalone:true,
  imports: [CommonModule,CardModule,FormsModule,ButtonModule,GalleriaModule,
    MenubarModule,BadgeModule,AvatarModule, InputTextModule,DialogModule],
  templateUrl: './catalog-movie.component.html',
  styleUrl: './catalog-movie.component.css'
})
export class CatalogMovieComponent {
  movieList:MovieInterface[] = []
  items:MenuItem[] = []
  images = model<MovieInterface[]>([]);
  _activeIndex: number = 2;
  searchText:string = ''
  filteredMovie:MovieInterface[] = []
  filter:FilterInterface = {
    date:'',
    score:''
  }
  constructor(protected movieService:MovieService,private router:Router,private dialog:DialogService) {
  }

  ngOnInit(){
  this.getMovieList()
    this.items = [{
      label: 'Главная',
      icon: 'pi pi-home',
      command: () => {
        this.router.navigate(['/'])
      }
    }
      ,
      {
        label: 'Фильтр',
        icon:'pi pi-filter',
        command: () => {
          this.openFilter()
        }
      }]
  }

  openFilter(){
    const modal = this.dialog.open(MovieFilterComponent,{
      closable:true,
      header:'Фильтр',
      data:{
        ...this.filter
      }
    })
      modal?.onClose.subscribe(value => {
        if(value){
          this.filter = value
          this.items[1].icon =  this.movieService.filterOn(this.filter) ? 'pi pi-filter-fill':'pi pi-filter'
          this.onFilter(value)
        }
    })
  }

  getMovieList(){
    this.movieService.getMovie().subscribe(value => {
      this.movieList = [...value];
      this.filteredMovie = this.movieList
      this.images.set( value.splice(0,10))
      console.log(this.images)
    })
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(newValue) {
    if (this.images() && 0 <= newValue && newValue <= this.images().length - 1) {
      this._activeIndex = newValue;
    }
  }


  onFilter(value:FilterInterface){
    if(this.movieService.filterOn(value)){
      const { date, score } = value;
      this.filteredMovie =
        this.movieList.filter(item=>{
          const byDate =
            !date ||
            String(item.release_date) === String(new Date(date).getFullYear());

          const byScore =
            score == null || Number(item.rt_score) >= Number(score);

          return byDate&&byScore
        })
    }else{
      this.filteredMovie = this.movieList
    }
  }

  onSearch(){
    if(this.searchText){
    this.filteredMovie =  this.movieList.filter(item=>item.title.toLowerCase().includes(this.searchText.toLowerCase()))
    }else{
      this.filteredMovie = this.movieList
    }
  }

  detail(item:MovieInterface){
    const modal = this.dialog.open(MovieDetailComponent,{
      closable:true,
      header:item.title,
      data:{
        ...item
      }
    })

  }
}
