import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { EmptyRouteComponent } from './empty-route/empty-route.component';
import { SpaHostNavComponent } from './components/spa-host-nav/spa-host-nav.component';
import { MicroFrontendRouteReuseStrategy } from './services/route-reuse-strategy';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './libs/material/material.module';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RestoreAppComponent } from './components/restore-app/restore-app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToasterComponent } from './components/toaster/toaster.component';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializeKeycloak } from './util/app.init';
import { NavbarComponent } from './components/navbar/navbar.component';
import { environment } from 'src/environments/environment';
import { MockedKeycloakService } from 'src/app/services/mocked-keycloak.service';
import { CrudService } from './services/crud.service';
@NgModule({
  declarations: [
    AppComponent,
    EmptyRouteComponent,
    SpaHostNavComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    RestoreAppComponent,
    ToasterComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    KeycloakAngularModule
  ],
  providers: [{
    provide: RouteReuseStrategy,
    useClass: MicroFrontendRouteReuseStrategy
  },
  {
    provide: KeycloakService,
    useClass: environment.production ? KeycloakService : MockedKeycloakService
  },
  {
    provide: APP_INITIALIZER,
    useFactory: initializeKeycloak,
    multi: true,
    deps: [KeycloakService, CrudService],
  }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
