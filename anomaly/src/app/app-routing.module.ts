import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'vax-anomaly', children: [
      { path: '', redirectTo: 'anomaly', pathMatch: 'full' },
      {
        path: 'anomaly',
        loadChildren: () => import('./pages/anomaly/anomaly.module').then(m => m.AnomalyModule),
        canLoad: [FeatureGuard],
        data: {
          feature: FEATURES.ANOMALY,
          socket: SOCKET_FEATURE.ANOMALY
        },
      }]
  },
  { path: '', redirectTo: 'vax-anomaly', pathMatch: 'full' },
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
