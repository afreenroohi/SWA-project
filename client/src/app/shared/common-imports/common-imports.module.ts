import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { antModule } from '../ant.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    antModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    antModule
  ]
})
export class CommonImportsModule { }
