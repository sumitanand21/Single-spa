import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureGroupComponent } from './components/feature-group/feature-group.component';
import { UpsertGroupNameComponent } from './dialogs/upsert-group-name/upsert-group-name.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    FeatureGroupComponent,
    UpsertGroupNameComponent,
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    FeatureGroupComponent,
    UpsertGroupNameComponent,
  ],
  entryComponents: [UpsertGroupNameComponent]
})
export class FeatureGroupModule { }
