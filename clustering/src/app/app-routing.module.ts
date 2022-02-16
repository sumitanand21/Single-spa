import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'vax-clustering', children: [
      { path: '', redirectTo: 'clustering', pathMatch: 'full' },
      {
        path: 'clustering',
        loadChildren: () => import('./pages/clustering/clustering.module').then(m => m.ClusteringModule),
        canLoad: [FeatureGuard],
        data: {
          feature: FEATURES.CLUSTERING,
          socket: SOCKET_FEATURE.ANOMALY
        },
      }]
  },
  { path: '', redirectTo: 'vax-clustering', pathMatch: 'full' },
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
