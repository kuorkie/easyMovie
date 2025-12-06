import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import {DialogService} from 'primeng/dynamicdialog';
import {FilterForm, FilterInterface, ListInterface} from '../../interfaces/filter.interface';
import {DialogModule} from 'primeng/dialog';
import {MovieDetailComponent} from '../movie-detail/movie-detail.component';
import {PaginatorModule, PaginatorState} from 'primeng/paginator';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  finalize,
  filter,
  Observable,
  switchMap,
  tap,
  map,
  startWith,
  distinctUntilChanged
} from 'rxjs';
import {PaginationResponse} from '../../interfaces/pagination-response';
import {ImgNotFoundDirective} from '../../directives/img-not-found.directive';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {NgxSpinnerModule, NgxSpinnerService} from 'ngx-spinner';
import {PaginationRequest} from '../../interfaces/pagination-request';
import {CutTextPipe} from '../../pipes/cut-text.pipe';
import {SelectModule} from 'primeng/select';
import {PanelModule} from 'primeng/panel';
import {DatePickerModule} from 'primeng/datepicker';
import {Type} from '../../enum/type';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-catalog-movie',
  standalone: true,
  imports: [CommonModule, CardModule, FormsModule, ButtonModule,SelectModule,PanelModule,
    GalleriaModule, PaginatorModule, NgxSpinnerModule, ProgressSpinnerModule,ToastModule,
    MenubarModule, BadgeModule, AvatarModule,CutTextPipe,DatePickerModule,ReactiveFormsModule,
    InputTextModule, DialogModule, ImgNotFoundDirective],
  providers: [NgxSpinnerService,MessageService],
  templateUrl: './catalog-movie.component.html',
  styleUrl: './catalog-movie.component.css'
})
export class CatalogMovieComponent {
  movieList: MovieInterface[] = []
  currentYear:Date = new Date()
  movies$!: Observable<PaginationResponse>
  items: MenuItem[] = []
  searchText: string = 'Sad'
  types:ListInterface[] = [{
    label:'Фильмы',
    value:Type.Movie
  },{
    label: "Сериал",
    value:Type.Serial
  }]

  filter!:FormGroup<FilterForm>

  public page$ = new BehaviorSubject<PaginationRequest>({
    page: 1,
    totalRecord: 0,
    first: 0
  } as PaginationRequest);

  constructor(protected movieService: MovieService, private router: Router,private messageService:MessageService,
              private dialog: DialogService, private spinner: NgxSpinnerService,private fb:NonNullableFormBuilder) {
    this.initializeForm()

  }

  ngOnInit() {
    this.getMovieList()
  }

  ngAfterViewInit(){
    this.filter.get('searchText')?.setValue('New year'); // 2025-01-01

  }

  dateToYear($event:Date){
    this.filter.patchValue({
        date: $event.getFullYear().toString()
      })
  }

  initializeForm(){
    this.filter = this.fb.group<FilterForm>({
      searchText:  new FormControl<string>('',[Validators.min(3),Validators.max(30)]),
      type: new FormControl<Type | null>(null),
      date: new FormControl<Date | string| null>(null)
    })
  }



  getPage(event: PaginatorState) {
    this.page$.next(<PaginationRequest>{
      ...event,
      page:(event.page ?? 0) + 1 //так как метод с 1 работает, а инструмент с 0 page
    })
    this.getMovieList()
  }

  searchChanged(event:Event){
    console.log(event)
    const input = event.target as HTMLInputElement;
    const text = input.value.trim()
    const defaultSearch = 'new year'
    console.log(text)
    if(text.length >= 3){
      this.filter.get('searchText')?.setValue(text)
    }else{
      console.log(this.filter)
      if(this.filter.get('date')?.value || this.filter.get('type')?.value ){
        this.messageService.add({severity:'warn',summary:'Предупреждение',detail:'Пожалуйста, заполните поле поиска - данных слишком много.'})
      }else{
        this.filter.get('searchText')?.setValue(defaultSearch)

      }
    }
  }

  getMovieList() {

    this.movies$ = this.filter.valueChanges.pipe(
      map((value)=>{
        return {
          ...value,
        searchText:value.searchText?.trim()
        }
      }),
      filter(value => (value.searchText ?? '').length >= 3),
      distinctUntilChanged((a, b) =>
        a.searchText === b.searchText &&
        a.type === b.type &&
        a.date === b.date
      ),
      switchMap((value) => {
        this.spinner.show()
        return this.movieService.getMovie(this.page$.value.page, value as FilterInterface).pipe(
          tap({
            next: resp => {
              if (resp.Response === 'False') {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ошибка',
                  detail: resp.Error ?? 'Неизвестная ошибка'
                });
              } else {
                this.page$.next({
                  ...this.page$.value,
                  totalRecord: resp.totalResults
                })
              }
            },
            error: err => {
              this.messageService.add({
                severity: 'error',
                summary: 'Ошибка сети',
                detail: err?.message ?? 'Запрос не выполнен'
              });
            }
          }),
          catchError((error) => {
            this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error})
            return EMPTY
          }),
          finalize(() => this.spinner.hide())
        )
        })
    )

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
