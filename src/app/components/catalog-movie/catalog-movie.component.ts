import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {CardModule} from 'primeng/card';
import {MovieService} from '../../services/movie.service';
import {MovieInterface} from '../../interfaces/movie.interface';
import {ButtonModule} from 'primeng/button';
import {GalleriaModule} from 'primeng/galleria';
import {MenubarModule} from 'primeng/menubar';
import {MenuItem, MessageService} from 'primeng/api';
import {BadgeModule} from 'primeng/badge';
import {AvatarModule} from 'primeng/avatar';
import {InputTextModule} from 'primeng/inputtext';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MovieFilterComponent} from '../movie-filter/movie-filter.component';
import {FilterInterface} from '../../interfaces/filter.interface';
import {DialogModule} from 'primeng/dialog';
import {MovieDetailComponent} from '../movie-detail/movie-detail.component';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {BehaviorSubject, catchError, EMPTY, finalize, Observable, switchMap, tap} from 'rxjs';
import {PaginationResponse} from '../../interfaces/pagination-response';
import {ImgNotFoundDirective} from '../../directives/img-not-found.directive';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {PaginationRequest} from '../../interfaces/pagination-request';
import {CutTextPipe} from '../../pipes/cut-text.pipe';

@Component({
  selector: 'app-catalog-movie',
  standalone: true,
  imports: [CommonModule, CardModule, FormsModule, ButtonModule,
    GalleriaModule, PaginatorModule, NgxSpinnerModule, ProgressSpinnerModule,
    MenubarModule, BadgeModule, AvatarModule,CutTextPipe,
    InputTextModule, DialogModule, ImgNotFoundDirective],
  providers: [NgxSpinnerService,MessageService],
  templateUrl: './catalog-movie.component.html',
  styleUrl: './catalog-movie.component.css'
})
export class CatalogMovieComponent {
  movieList: MovieInterface[] = []
  movies$!: Observable<PaginationResponse>
  items: MenuItem[] = []
  searchText: string = 'Sad'
  filter: FilterInterface = {
    date: '',
    score: ''
  }
  public page$ = new BehaviorSubject<PaginationRequest>({
    page: 1,
    totalRecord: 0,
    first: 0
  } as PaginationRequest);

  constructor(protected movieService: MovieService, private router: Router,private messageService:MessageService,
              private dialog: DialogService, private spinner: NgxSpinnerService) {
  }

  ngOnInit() {
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
        icon: 'pi pi-filter',
        command: () => {
          this.openFilter()
        }
      }]
  }

  openFilter() {
    const modal = this.dialog.open(MovieFilterComponent, {
      closable: true,
      header: 'Фильтр',
      data: {
        ...this.filter
      }
    })
    modal?.onClose.subscribe(value => {
      if (value) {
        this.filter = value
        this.items[1].icon = this.movieService.filterOn(this.filter) ? 'pi pi-filter-fill' : 'pi pi-filter'
        this.getMovieList()
      }
    })
  }

  getPage(event: PaginatorState) {
    console.log(event)
    this.page$.next(<PaginationRequest>{
      ...event
    })
    this.getMovieList()
  }

  getMovieList() {
    this.spinner.show();
    this.movies$ = this.movieService.getMovie(this.page$.value.page, this.searchText).pipe(
      tap((value) => {
        this.page$.next({
          ...this.page$.value,
          totalRecord: value.totalResults
        })
      }),
      catchError((error)=>{
        this.messageService.add({severity:'error',summary:'Ошибка',detail:error})
        return EMPTY
      }),
      finalize(() => this.spinner.hide())
    );
  }



  onSearch() {
    this.getMovieList()
  }

  detail(item: MovieInterface) {
    this.spinner.show()
    this.movieService.getDetail(item.imdbID).subscribe({
      next: (value) => {
        this.spinner.hide()
        const modal = this.dialog.open(MovieDetailComponent, {
          closable: true,
          header: item.Title,
          modal: true,
          data: {
            ...value
          }
        })
      }
    })
  }
}
