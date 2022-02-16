import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnomalyRoutingModule } from './anomaly-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { AnomalymodalconfigComponent } from './components/anomalymodalconfig/anomalymodalconfig.component';
import { UpsertAnomalyModelConfigComponent } from './components/upsert-anomaly-model-config/upsert-anomaly-model-config.component';
import { AllTasksComponent } from './components/all-tasks/all-tasks.component';
import { AnomalyDetectionComponent } from './components/anomaly-detection/anomaly-detection.component';
import { ModelTrainingViewComponent } from './components/model-training-view/model-training-view.component';
import { AnomalyComponent } from './anomaly.component';


import { ModelConfigViewComponent } from './dialogs/model-config-view/model-config-view.component';
import { DataPreviewComponent } from './dialogs/data-preview/data-preview.component';
import { DonutChartComponent } from './components/donut-chart/donut-chart.component';

import { AmchartComponent } from './components/amchart/amchart.component';
import { UpsertTasksComponent } from './dialogs/upsert-tasks/upsert-tasks.component';
import { ChartsModule, ThemeService } from 'ng2-charts';

@NgModule({
  declarations: [
    AnomalyComponent,
    AnomalymodalconfigComponent,
    UpsertAnomalyModelConfigComponent,
    AllTasksComponent,
    AnomalyDetectionComponent,
    ModelTrainingViewComponent,
    ModelConfigViewComponent,
    DataPreviewComponent,
    DonutChartComponent,
    AmchartComponent,
    UpsertTasksComponent,
  ],
  imports: [
    CommonModule,
    AnomalyRoutingModule,
    SharedModule,
    ChartsModule,
  ],
  providers: [ThemeService],
  entryComponents: [
    ModelConfigViewComponent,
    DataPreviewComponent,
    UpsertTasksComponent]
})
export class AnomalyModule { }
