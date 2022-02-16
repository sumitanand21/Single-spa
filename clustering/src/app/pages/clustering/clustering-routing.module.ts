import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RCAComponent } from './components/rca/rca.component';
import { ClusteringComponent } from './clustering.component';
const routes: Routes = [
  {
    path: 'rca', component: ClusteringComponent,
    children: [
      { path: '', component: RCAComponent }
    ]
  },
  { path: '**', redirectTo: 'rca', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClusteringRoutingModule { }
