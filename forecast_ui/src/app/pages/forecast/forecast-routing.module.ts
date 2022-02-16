import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForecastSelectionComponent } from './components/forecast-selection/forecast-selection.component';
import { ForecastProcessingComponent } from './components/forecast-processing/forecast-processing.component';
import { ForecastCompareComponent } from './components/forecast-compare/forecast-compare.component';
import { ModelconfComponent } from './components/modelconf/modelconf.component';
import { UpdateModelconfigComponent } from './components/update-modelconfig/update-modelconfig.component';
import { ForecastComponent } from './forecast.component';
const routes: Routes = [
  {
    path: 'forecastselect', component: ForecastComponent,
    children: [
      { path: '', component: ForecastSelectionComponent },
      {
        path: 'modelconfig',
        children: [
          { path: '', component: ModelconfComponent },
          { path: 'updateconfig', component: UpdateModelconfigComponent },
        ]
      }
    ]
  },
  {
    path: 'forecastprocess', component: ForecastComponent,
    children: [
      { path: '', component: ForecastProcessingComponent },
      { path: 'forecastcompare', component: ForecastCompareComponent },
      {
        path: 'modelconfig',
        children: [
          { path: '', component: ModelconfComponent },
          { path: 'updateconfig', component: UpdateModelconfigComponent },
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'forecastselect', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForecastRoutingModule { }
