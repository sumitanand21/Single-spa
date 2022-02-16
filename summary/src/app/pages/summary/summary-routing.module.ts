import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IframeDashboardComponent } from './components/iframe-dashboard/iframe-dashboard.component';
import { StaticDashboardComponent } from './components/static-dashboard/static-dashboard.component';
import { SummaryViewComponent } from './components/summary-view/summary-view.component';
import { SummaryComponent } from './summary.component';

const routes: Routes = [
  {
    path: '', component: SummaryComponent,
    children: [
      { path: '', redirectTo: 'summaryview', pathMatch: 'full' },
      {
        path: 'summaryview',
        component: SummaryViewComponent,
        children: [
          // { path: '', redirectTo: 'iframe', pathMatch: 'full' },
          { path: 'iframe', component: IframeDashboardComponent },
          { path: 'sdashboard', component: StaticDashboardComponent }
        ],
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SummaryRoutingModule { }
