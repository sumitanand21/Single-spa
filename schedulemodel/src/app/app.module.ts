import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, Inject, NgModule, Optional } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';

import { FeatureToggleModule } from 'ngx-feature-toggle';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material';
import { DisplaypopupComponent } from './dialogs/displaypopup/displaypopup.component';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { AppSchedulerService } from './services/app-scheduler.service';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { GlobalService } from './services/global.service';
import { Router } from '@angular/router';
import { singleSpaPropsSubject } from 'src/single-spa/single-spa-props';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { RouteReuseStrategy } from '@angular/router';
import { ConfigurationService } from './services/configuration.service';

export const loadConfigs = (confS: ConfigurationService, gs: AppSchedulerService) => {
  return () => confS.getConfigurationDetails().then((res) => {
    gs.getUrls();
    gs.clearSocketSessions();
  });
};
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DisplaypopupComponent,
    EmptyRouteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FeatureToggleModule,
    HttpClientModule,
    MatDialogModule,
    ToastrModule.forRoot({
      maxOpened: 3,
    }),
    IonicModule.forRoot()
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: GestureConfig },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfigs,
      deps: [ConfigurationService, AppSchedulerService],
      multi: true
    }
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    DisplaypopupComponent
  ]
})
export class AppModule {
  constructor(
    private globals: GlobalService,
    @Optional() @Inject('globalEventDispatcherRef') private globalEventDispatcherRef: any, private router: Router) {
    singleSpaPropsSubject.subscribe((app: any) => {
      if (app && app.microApp && app.microApp.routePath) {
        this.globals.prefixUrl = app.microApp.routePath;
        this.router.config[0].path = this.globals.prefixUrl;
        this.router.config[1].redirectTo = this.globals.prefixUrl;
      }
    });
    this.globals.globalEventDistributor = globalEventDispatcherRef;
  }
}
