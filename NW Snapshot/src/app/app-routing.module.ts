import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';
import { NwSnapshotModule } from './pages/nwsnapshot/nwsnapshot.module';

const routes: Routes = [
  {
    path: 'vax-nwsnapshot', children: [
      { path: '', redirectTo: 'nwsnapshot', pathMatch: 'full' },
      {
        path: 'nwsnapshot',
        loadChildren: () => import('./pages/nwsnapshot/nwsnapshot.module').then(m => m.NwSnapshotModule),
        canLoad: [FeatureGuard],
        data: {
          feature: FEATURES.CLUSTERING,
          socket: SOCKET_FEATURE.ANOMALY
        },
      }]
  },
  { path: '', redirectTo: 'vax-nwsnapshot', pathMatch: 'full' },
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
