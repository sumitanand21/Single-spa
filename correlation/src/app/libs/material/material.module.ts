import { NgModule } from '@angular/core';
import {
  MatTabsModule,
  MatProgressBarModule,
  MatSelectModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatInputModule,
  MatFormFieldModule,
  MatCardModule,
  MatRadioModule,
  MatButtonModule,
  MatDividerModule,
  MatIconModule,
  MatDialogModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatMenuModule,
  DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE
} from '@angular/material';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule } from '@angular/material-moment-adapter';
import { MY_FORMATS } from './../../constants/mat-date-formate/mts-date-formate';
import { MomentUtcDateAdapter } from '../mat-utc-date-adapter';


@NgModule({
  exports: [
    MatNativeDateModule,
    MatTabsModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MomentDateModule,
    MatMomentDateModule,
    MatMenuModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS }
  ],
})
export class MaterialModule { }
