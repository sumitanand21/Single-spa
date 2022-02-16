import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericTableComponent } from './components/generic-table/generic-table.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [GenericTableComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    GenericTableComponent,
  ],
})
export class GenericTableModule { }
