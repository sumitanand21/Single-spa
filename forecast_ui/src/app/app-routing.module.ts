import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'vax-forecast', children: [
      { path: '', redirectTo: 'forecast', pathMatch: 'full' },
  {
    path: 'forecast',
    loadChildren: () => import('./pages/forecast/forecast.module').then(m => m.ForecastModule),
    canLoad: [FeatureGuard],
    data: {
      feature: FEATURES.FORECAST,
      socket: SOCKET_FEATURE.FORECAST
    },
  }]
},
  { path: '', redirectTo: 'vax-forecast', pathMatch: 'full' },
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
