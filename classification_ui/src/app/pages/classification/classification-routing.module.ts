import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClassificationComponent } from './classification.component';
import { ProfilerUpsertFeatureGroupComponent } from './components/profiler-upsert-feature-group/profiler-upsert-feature-group.component';
import { ProfilerComponent } from './components/profiler/profiler.component';

const routes: Routes = [
  { path: '', component: ClassificationComponent ,
  children: [
    { path: '', redirectTo: 'profilerupsertfeature', pathMatch: 'full' },
    { path: 'profiler', component: ProfilerComponent },
    { path: 'profilerupsertfeature', component: ProfilerUpsertFeatureGroupComponent }
  ]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassificationRoutingModule { }
