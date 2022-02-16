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
import { MatStepperModule, MatAutocompleteModule } from '@angular/material';
// import {MatStepperModule} from '@angular/material/stepper';
import { MomentDateModule, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateModule } from '@angular/material-moment-adapter';
import { MY_FORMATS } from './../../constants/mat-date-formate/mts-date-formate';
import { MomentUtcDateAdapter } from '../mat-utc-date-adapter';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {DragDropModule} from '@angular/cdk/drag-drop';

@NgModule({
  exports: [
    MatNativeDateModule,
    DragDropModule,
    MatStepperModule,
    MatAutocompleteModule,
    // MatStepperModule,
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
