import {ChangeDetectionStrategy, Component} from '@angular/core';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {BadgeModule} from 'primeng/badge';
import {RatingModule} from 'primeng/rating';
import {ImgNotFoundDirective} from '../../directives/img-not-found.directive';
import {DetailUi, MovieDetail} from '../../interfaces/movie-detail';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, FormsModule, BadgeModule, RatingModule, ImgNotFoundDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {
  constructor(private config: DynamicDialogConfig) {
  }

  item!: MovieDetail
  column: DetailUi[] = []

  ngOnInit() {
    this.item = {
      ...this.config.data
    }
    this.column = [
      {label: 'Genre', value: this.config.data.Genre, type: 'button'},
      {label: 'Рейтинг', value: this.config.data.Ratings, type: 'rating'},
      {label: 'Описание', value: this.config.data.Plot, type: 'text'},
      {label: 'Дата выхода', value: this.config.data.Year, type: 'text'},
      {label: 'Страна', value: this.config.data.Country, type: 'text'},
      {label: 'Время', value: this.config.data.Runtime, type: 'text'},
      {label: 'Актеры', value: this.config.data.Actors, type: 'text'},

    ]
  }
}
