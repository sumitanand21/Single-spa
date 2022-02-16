import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NwSnapshotComponent } from './nwsnapshot.component';
import { ProfilerUpsertFeatureGroupComponent } from './components/profiler-upsert-feature-group/profiler-upsert-feature-group.component';

const routes: Routes = [
  // {
  //   path: '', component: ProfilerUpsertFeatureGroupComponent,
  // },
  // { path: '**', redirectTo: 'nwsnapshot', pathMatch: 'full' }
  
  {
    path: 'classification', component: NwSnapshotComponent,
    children: [
      { path: '', component: ProfilerUpsertFeatureGroupComponent }
    ]
  },
  { path: '**', redirectTo: 'classification', pathMatch: 'full' }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NwSnapshotRoutingModule { }
