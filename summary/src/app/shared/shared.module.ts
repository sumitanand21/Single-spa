import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import 'rxjs/add/operator/map';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NumbersOnlyDirective } from '../directives/numbers-only.directive';
import { AlphaNumericDirective } from '../directives/alpha-numeric.directive';
import { MaterialModule } from '../libs/material/material.module';
import { EmptyValueCheck, ModelNamePipe } from './../pipes/modelName.pipe';
import { DatePipe } from '@angular/common';
import { ExactFilterPipe } from '../libs/exact-filter.pipe';
import { SearchFilterPipe } from '../libs/search-filter.pipe';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    NumbersOnlyDirective,
    AlphaNumericDirective,
    ModelNamePipe,
    EmptyValueCheck,
    ExactFilterPipe,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // BsDatepickerModule.forRoot(),
    // ModalModule.forRoot(),
    // PopoverModule.forRoot(),
    Ng2SearchPipeModule,
    FilterPipeModule,
    OrderModule,
    NgxPaginationModule,
    ProgressbarModule.forRoot(),
    MaterialModule,
    IonicModule
  ],
  exports: [
    ExactFilterPipe,
    SearchFilterPipe,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // BsDatepickerModule,
    // ModalModule,
    // PopoverModule,
    Ng2SearchPipeModule,
    FilterPipeModule,
    OrderModule,
    NgxPaginationModule,
    ProgressbarModule,
    MaterialModule,
    NumbersOnlyDirective,
    AlphaNumericDirective,
    ModelNamePipe,
    EmptyValueCheck,
    IonicModule],
  entryComponents: [],
  providers: [DatePipe],

})
export class SharedModule { }
