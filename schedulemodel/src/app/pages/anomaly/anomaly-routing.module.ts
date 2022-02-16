import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnomalymodalconfigComponent } from './components/anomalymodalconfig/anomalymodalconfig.component';
import { UpsertAnomalyModelConfigComponent } from './components/upsert-anomaly-model-config/upsert-anomaly-model-config.component';
import { AllTasksComponent } from './components/all-tasks/all-tasks.component';
import { AnomalyDetectionComponent } from './components/anomaly-detection/anomaly-detection.component';
import { ModelTrainingViewComponent } from './components/model-training-view/model-training-view.component';
import { AnomalyComponent } from './anomaly.component';

const routes: Routes = [
  {
    path: 'anomalydetection', component: AnomalyComponent,
    children: [
      { path: '', component: AnomalyDetectionComponent },
      {
        path: 'anomalymodelconfig',
        children: [
          { path: '', component: AnomalymodalconfigComponent },
          { path: 'upsertmodelconfig', component: UpsertAnomalyModelConfigComponent }
        ]
      },
      { path: 'modeltraining', component: ModelTrainingViewComponent },
    ]
  },
  {
    path: 'alltask', component: AnomalyComponent,
    children: [
      { path: '', component: AllTasksComponent },
      {
        path: 'anomalymodelconfig',
        children: [
          { path: '', component: AnomalymodalconfigComponent },
          { path: 'upsertmodelconfig', component: UpsertAnomalyModelConfigComponent }
        ]
      },
      { path: 'modeltraining', component: ModelTrainingViewComponent },
    ]
  },
  { path: '**', redirectTo: 'alltask', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnomalyRoutingModule { }
