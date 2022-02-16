import { APP_BASE_HREF } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FEATURES, SOCKET_FEATURE } from 'src/config/app.cofig';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { FeatureGuard } from './guards/feature-guard.service';

const routes: Routes = [
  {
    path: 'vax-classification', children: [
      { path: '', redirectTo: 'classification', pathMatch: 'full' },
      {
        path: 'classification',
        loadChildren: () => import('./pages/classification/classification.module').then(m => m.ClassificationModule),
        canLoad: [FeatureGuard],
        data: {
          feature: FEATURES.CLASSIFICATION,
          socket: SOCKET_FEATURE.CLASSIFICATION
        },
      }]
  },
  { path: '', redirectTo: 'vax-classification', pathMatch: 'full' },
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
