import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {DatePickerModule} from 'primeng/datepicker';
import {ButtonModule} from 'primeng/button';
import {Form, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FilterInterface} from '../../interfaces/filter.interface';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {MessageService} from 'primeng/api';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import {MovieService} from '../../services/movie.service';

@Component({
  selector: 'app-movie-filter',
  imports: [CommonModule,DatePickerModule,ButtonModule,ReactiveFormsModule,
    SliderModule,InputTextModule,FormsModule],
  templateUrl: './movie-filter.component.html',
  styleUrl: './movie-filter.component.css'
})
export class MovieFilterComponent {
  constructor(private fb:FormBuilder,private ref:DynamicDialogRef,protected movieService:MovieService,private config:DynamicDialogConfig,private messageService:MessageService) {
  }
  filter!:FormGroup
  hover = false;

  ngOnInit(){
    this.initializeForm()
    this.filter.patchValue({
      ...this.config.data
    })

  }

  initializeForm(){
    this.filter = this.fb.group<FilterInterface>({
      date: '',
      score:''
    });
  }

  get score(): number {
    return Number(this.filter.get('score')?.value ?? 0);
  }



  save(){
    // if(this.filter.dirty){
      this.ref.close(this.filter.value)
    // }else{
    //   this.messageService.add({severity:'warn',detail:'Примените один из фильтров'})
    // }
  }
}

