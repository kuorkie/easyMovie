import {Component} from '@angular/core';
import {AsyncPipe, CommonModule, NgForOf, NgIf} from '@angular/common';
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

  distinctUntilChanged, merge, scan
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
import {QueryState, TriggerEvent} from '../../interfaces/type-of-trigger';

@Component({
  selector: 'app-catalog-movie',
  standalone: true,
  imports: [ CardModule, ButtonModule, SelectModule, PanelModule,
    NgIf,NgForOf,AsyncPipe, PaginatorModule, NgxSpinnerModule, ToastModule,
    MenubarModule, AvatarModule, CutTextPipe, DatePickerModule, ReactiveFormsModule,
    InputTextModule, DialogModule, ImgNotFoundDirective],
  providers: [NgxSpinnerService, MessageService],
  templateUrl: './catalog-movie.component.html',
  styleUrl: './catalog-movie.component.css'
})
export class CatalogMovieComponent {
  movieList: MovieInterface[] = []
  currentYear: Date = new Date()
  movies$!: Observable<PaginationResponse>
  items: MenuItem[] = []
  searchText: string = 'Sad'
  types: ListInterface[] = [{
    label: 'Фильмы',
    value: Type.Movie
  }, {
    label: "Сериал",
    value: Type.Serial
  }]


  filter!: FormGroup<FilterForm>

  public page$ = new BehaviorSubject<PaginationRequest>({
    page: 1,
    first: 0
  } as PaginationRequest);

  constructor(protected movieService: MovieService, private router: Router, private messageService: MessageService,
              private dialog: DialogService, private spinner: NgxSpinnerService, private fb: NonNullableFormBuilder) {

  }

  ngOnInit() {
    this.initializeForm()
    this.getMovieList()
  }


  initializeForm() {
    this.filter = this.fb.group<FilterForm>({
      searchText: new FormControl('New Year', [Validators.min(3), Validators.max(30)]),
      type: new FormControl(null),
      date: new FormControl(null)
    })
  }


  getPage(event: PaginatorState) {
    this.page$.next(<PaginationRequest>{
      ...event,
      page: (event.page ?? 0) + 1 //так как метод с 1 работает, а инструмент с 0 page
    })
  }


  clearPage() {
    return {
      filter: this.filter.getRawValue() as FilterInterface,
      page: {page: 1, first: 0}
    };

  }

  getMovieList() {

    const filter$ = this.filter.valueChanges.pipe(
      map(value => ({
        type: value.type ?? null,
        searchText: (value.searchText ?? '').trim(),
        date: value.date ? (value.date as Date).getFullYear().toString() : null
      })),
      filter(value => value.searchText.length >= 3),
      distinctUntilChanged((a, b) =>
        a.searchText === b.searchText &&
        a.type === b.type &&
        a.date === b.date
      )
    );

    const pageQuery$ = this.page$.pipe(
      map(p => ({page: p.page, first: p.first})),
      distinctUntilChanged((a, b) =>
        a.page === b.page && a.first === b.first
      )
    );

    const trigger$ = merge(
      filter$.pipe(map(filter => ({kind: 'filter' as const, filter}))),
      pageQuery$.pipe(map(page => ({kind: 'page' as const, page})))
    ).pipe(
      scan<TriggerEvent, QueryState>((state, event) => {
        if (event.kind === 'filter') {
          return {
            filter: event.filter,
            page: {page: 1, first: 0}
          };
        }

        return {
          ...state,
          page: event.page
        };
      }, this.clearPage())
    );

    this.movies$ = trigger$.pipe(
      switchMap(({filter, page}) => {
        this.spinner.show()
        return this.movieService.getMovie(page.page, filter).pipe(
          tap({
            next: resp => {
              if (resp.Response === 'False') {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Ошибка',
                  detail: resp.Error ?? 'Неизвестная ошибка'
                });
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


  detail(item: MovieInterface) {
    this.spinner.show()
    this.movieService.getDetail(item.imdbID).subscribe({
      next: (value) => {
        this.spinner.hide()
        this.dialog.open(MovieDetailComponent, {
          closable: true,
          header: item.Title,
          modal: true,
          data: {
            ...value
          }
        })
      },
      error:(error)=>{
        this.spinner.hide()
        this.messageService.add({severity: 'error', summary: 'Ошибка', detail: error})
      }
    })
  }

}
