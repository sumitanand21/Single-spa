import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'vax-correlation', children: [
      { path: '', redirectTo: 'correlation', pathMatch: 'full' },
  {
    path: 'correlation',
    loadChildren: () => import('./pages/correlation/correlation.module').then(m => m.CorrelationModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.CORRELATION,
      socket: SOCKET_FEATURE.CORRELATION
    },
  }]
},
  { path: '', redirectTo: 'vax-correlation', pathMatch: 'full' },
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
