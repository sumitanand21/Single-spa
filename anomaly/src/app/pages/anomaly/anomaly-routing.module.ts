import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AnomalyViewComponent } from './components/anomaly-view/anomaly-view.component';
import { AnomalyComponent } from './anomaly.component';

const routes: Routes = [
 {
    path: 'anomalyview', component: AnomalyComponent,
    children: [
      { path: '', component: AnomalyViewComponent },
    ]
  },
  { path: '**', redirectTo: 'anomalyview', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnomalyRoutingModule { }
