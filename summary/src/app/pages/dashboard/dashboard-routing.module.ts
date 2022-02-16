import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardListComponent } from './components/dashboard-list/dashboard-list.component';
const routes: Routes = [
  { path: '', component: DashboardComponent ,
  children: [
    { path: '', redirectTo: 'dashboardmgmt', pathMatch: 'full'},
    { path: 'dashboardmgmt', component: DashboardListComponent},
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
