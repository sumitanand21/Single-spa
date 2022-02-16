import { APP_INITIALIZER, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteConfigService } from './services/route-config.service';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { HomeComponent } from './components/home/home.component';
// import { UpsertAppComponent } from './components/upsert-app/upsert-app.component';
import { RestoreAppComponent } from './components/restore-app/restore-app.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'container' },
  { path: 'home', component: EmptyRouteComponent },
  { path: 'container', component: HomeComponent },
  // { path: 'upsertapp/:id', loadChildren: () => import('./components/upsert-app/upsert-app.module').then(m => m.UpsertAppModule)},
  // { path: 'upsertapp', loadChildren: () => import('./components/upsert-app/upsert-app.module').then(m => m.UpsertAppModule)},
  // { path: 'restoreapp', component: RestoreAppComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
