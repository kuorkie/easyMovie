import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MovieInterface} from '../../interfaces/movie.interface';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ImgNotFoundDirective} from '../../directives/img-not-found.directive';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule,FormsModule,ImgNotFoundDirective],
  changeDetection:ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.css'
})
export class MovieDetailComponent {
  constructor(private config:DynamicDialogConfig) {
  }
  item!:MovieInterface
  column:any[] = []

  ngOnInit(){
    this.item = {
      ...this.config.data
    }
     this.column =  [
      {label:'Описание',value:this.config.data.Description},
        {label:'Продюсер',value:this.config.data.Producer},
        {label:'Директор',value:this.config.data.Director},

      ]
  }
}
