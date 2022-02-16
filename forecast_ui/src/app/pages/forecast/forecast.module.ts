import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastRoutingModule } from './forecast-routing.module';
import { SharedModule } from '../../shared/shared.module';

import {
  ForecastSelectionComponent
} from './components/forecast-selection/forecast-selection.component';
import {
  ForecastProcessingComponent,
} from './components/forecast-processing/forecast-processing.component';
import { ForecastCompareComponent } from './components/forecast-compare/forecast-compare.component';
import { ModelconfComponent } from './components/modelconf/modelconf.component';
import { UpdateModelconfigComponent } from './components/update-modelconfig/update-modelconfig.component';
import { ForecastComponent } from './forecast.component';
import { StopForecastProcessComponent } from './dialogs/stop-forecast-process/stop-forecast-process.component';
import { EditForecastSelectionComponent } from './dialogs/edit-forecast-selection/edit-forecast-selection.component';
import { ModelConfigDialogComponent } from './dialogs/model-config-dialog/model-config-dialog.component';

@NgModule({
  declarations: [
    ForecastComponent,
    ForecastSelectionComponent,
    ForecastProcessingComponent,
    ForecastCompareComponent,
    ModelconfComponent,
    StopForecastProcessComponent,
    UpdateModelconfigComponent,
    EditForecastSelectionComponent,
    ModelConfigDialogComponent,
  ],
  imports: [
    CommonModule,
    ForecastRoutingModule,
    SharedModule,
  ],
  entryComponents: [EditForecastSelectionComponent,
    ModelConfigDialogComponent,
    StopForecastProcessComponent],

})
export class ForecastModule { }
