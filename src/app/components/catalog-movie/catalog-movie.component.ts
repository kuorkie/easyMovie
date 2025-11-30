import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
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
import {ChangeDetection} from '@angular/cli/lib/config/workspace-schema';
import {PaginatorModule} from 'primeng/paginator';
import {PaginationRequest} from '../../interfaces/pagination-request';
import {BehaviorSubject, finalize, Observable, switchMap} from 'rxjs';
import {PaginationResponse} from '../../interfaces/pagination-response';
import {ImgNotFoundDirective} from '../../directives/img-not-found.directive';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-catalog-movie',
  standalone:true,
  imports: [CommonModule,CardModule,FormsModule,ButtonModule,
    GalleriaModule,PaginatorModule,NgxSpinnerModule,ProgressSpinnerModule,
    MenubarModule,BadgeModule,AvatarModule,
    InputTextModule,DialogModule,ImgNotFoundDirective],
  providers:[NgxSpinnerModule],
  templateUrl: './catalog-movie.component.html',
  styleUrl: './catalog-movie.component.css'
})
export class CatalogMovieComponent {
  movieList:MovieInterface[] = []
  movies$!:Observable<PaginationResponse>
  items:MenuItem[] = []
  images = model<MovieInterface[]>([]);
  _activeIndex: number = 2;
  searchText:string = 'Sad'
  filteredMovie:MovieInterface[] = []
  filter:FilterInterface = {
    date:'',
    score:''
  }
  private page$ = new BehaviorSubject<number>(1);

  first:number = 0
  constructor(protected movieService:MovieService,private router:Router,
              private dialog:DialogService,private spinner:NgxSpinnerService) {
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
          this.getMovieList()
        }
    })
  }

  getPage(event:any){
    this.first = event.first
    this.page$.next(event.page+1)
    this.getMovieList()
  }

  getMovieList(){
   this.movies$ =  this.page$.pipe(
     switchMap(page => {
       this.spinner.show();
       return this.movieService.getMovie(page,this.searchText).pipe(
         finalize(() => this.spinner.hide())
       );
     })
   )
  }

  get activeIndex(): number {
    return this._activeIndex;
  }

  onImgError(event:ErrorEvent){
    console.log(event)
  }

  set activeIndex(newValue) {
    if (this.images() && 0 <= newValue && newValue <= this.images().length - 1) {
      this._activeIndex = newValue;
    }
  }


  onFilter(value:FilterInterface){

  }

  onSearch(){

   this.getMovieList()
  }

  detail(item:MovieInterface) {
    this.spinner.show()
    this.movieService.getDetail(item.imdbID).subscribe({
      next: (value) => {
        this.spinner.hide()
        const modal = this.dialog.open(MovieDetailComponent, {
          closable: true,
          header: item.Title,
          data: {
            ...value
          }

        })

      }

    })
  }
}
