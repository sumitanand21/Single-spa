import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UpsertAppRoutingModule } from './upsert-app-routing.module';
import { MaterialModule } from './../../libs/material/material.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UpsertAppComponent } from './upsert-app.component';


@NgModule({
  declarations: [UpsertAppComponent],
  imports: [
    CommonModule,
    UpsertAppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UpsertAppModule { }
