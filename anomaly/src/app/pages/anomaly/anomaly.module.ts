import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnomalyRoutingModule } from './anomaly-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AnomalyViewComponent } from './components/anomaly-view/anomaly-view.component';
import { AnomalyComponent } from './anomaly.component';

import { ModelConfigViewComponent } from './dialogs/model-config-view/model-config-view.component';


@NgModule({
  declarations: [
    AnomalyComponent,
    AnomalyViewComponent,
    ModelConfigViewComponent
  ],
  imports: [
    CommonModule,
    AnomalyRoutingModule,
    SharedModule,
  ],
  providers: [],
  entryComponents: [
    ModelConfigViewComponent]
})
export class AnomalyModule { }
