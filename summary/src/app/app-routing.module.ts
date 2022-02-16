import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';
import { DASHBOARD_VALUES, SOCKET_DASHBOARD } from 'src/config/dashboard.config';

const routes: Routes = [
  {
    path: 'vax-summary', children: [
      { path: '', redirectTo: 'summary', pathMatch: 'full' },
      {
        path: 'summary',
        loadChildren: () => import('./pages/summary/summary.module').then(m => m.SummaryModule),
        canLoad: [FeatureGuard],
        data: {
          feature: FEATURES.SUMMARY,
          socket: SOCKET_FEATURE.SUMMARY
        },
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
      }
    ]
  },
  { path: '', redirectTo: 'vax-summary', pathMatch: 'full' },
  { path: '**', component: EmptyRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
  ]
})
export class AppRoutingModule {
}
