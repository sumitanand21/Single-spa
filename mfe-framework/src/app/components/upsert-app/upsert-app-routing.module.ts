import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpsertAppComponent } from './upsert-app.component';


const routes: Routes = [
    {path: '', component: UpsertAppComponent},
    {path: '/:id', component: UpsertAppComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpsertAppRoutingModule { }
