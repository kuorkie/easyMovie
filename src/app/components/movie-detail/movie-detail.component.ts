import { Component } from '@angular/core';
import {MovieInterface} from '../../interfaces/movie.interface';
import {DynamicDialogConfig} from 'primeng/dynamicdialog';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule,FormsModule],
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
      {label:'Описание',value:this.config.data.description},
        {label:'Продюсер',value:this.config.data.producer},
        {label:'Директор',value:this.config.data.director},
        {label:'Дата выхода',value:this.config.data.release_date},
        {label:'Рейтинг',value:this.config.data.rt_score},
      ]
  }
}
