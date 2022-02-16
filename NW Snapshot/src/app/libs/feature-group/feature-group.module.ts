import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpsertGroupNameComponent } from './dialogs/upsert-group-name/upsert-group-name.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    UpsertGroupNameComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    UpsertGroupNameComponent,
  ],
  entryComponents: [UpsertGroupNameComponent]
})
export class FeatureGroupModule { }
