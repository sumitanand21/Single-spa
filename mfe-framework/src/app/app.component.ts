import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';
import { RouteConfigService } from './services/route-config.service';
import { SingleSpaService } from './services/single-spa.service';
import { ContainerToasterService } from './services/container-toaster.service';
import { PreloadApiService } from './services/preload-api.service';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { AfterContentChecked, AfterViewChecked } from '@angular/core';
import { CrudService } from './services/crud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterContentChecked, AfterViewChecked {
  @ViewChild('sidenav') public sideNav;
  opened = false;
  isLoading = false;
  navbar;
  navStatus = false;
  configErr = false;
  landingPage;
  currntPage;
  mainApp;
  navBarApps = [];
  sideBarApps = [];
  sideBarAppsBinder = [];
  navBarAppsBinder = [];
  navbarBinder;
  navStatusBinder = false;
  defNavar = false;
  defaultSideNavbar = false;
  defaultSideNavbarBinder = false;
  defNavbarBinder = false;
  id;
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    public cdref: ChangeDetectorRef,
    private titleService: Title,
    private routeConService: RouteConfigService,
    public singleSpaService: SingleSpaService,
    public crudServices: CrudService,
    private containerToaster: ContainerToasterService,
    private preloadApiService: PreloadApiService) {

    const subRouter = router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!router.navigated && !this.landingPage && !this.mainApp) {
          this.currntPage = event.url;
          this.anyAppLoaded();
        }
        // console.log("naviagted", router.navigated);
      }
    });
    const subRoute = this.routeConService.routeSubject.subscribe((res) => {
      if (res) {
        this.loadApp(res);
      } else {
        this.sideBarApps = [];
        this.navBarApps = [];
        this.navStatus = false;
        this.navbar = undefined;
        this.defNavar = false;
        this.defaultSideNavbar = false;
        this.defaultSideNavbarBinder = false;
        this.singleSpaService.appName = undefined;
        this.singleSpaService.projectName = undefined;
      }
    });
    this.subscriptions.push(subRouter);
    this.subscriptions.push(subRoute);
  }
  ngOnInit() {
  }

  loadApp(mainApp): void {
    this.isLoading = true;
    const subMicroApps = this.singleSpaService.getMicroAppsByNamespace(mainApp.namespace).subscribe((res) => {
      this.setContainerApp(res);
      this.isLoading = false;
      // if (!this.currntPage || this.currntPage === '/' || this.currntPage === '/container') {
      if (this.landingPage) {
        this.router.navigateByUrl(this.landingPage);
        this.titleService.setTitle(mainApp.label);
        this.preloadApiService.loadApi(mainApp.preloadURLS);
      } else {
        this.containerToaster.showError('Error: Homepage/Landing page not available !');
        this.navbar = undefined;
        this.navStatus = false;
        this.sideBarApps = [];
        this.navBarApps = [];
        this.router.navigateByUrl('/container');
      }
      // } else {
      //   this.router.navigateByUrl(this.currntPage);
      // }
    }, err => {
      this.containerToaster.showError(err.message);
      this.isLoading = false;
    });
    this.subscriptions.push(subMicroApps);
  }
  setContainerApp(res) {
    if (res && res) {
      this.router.config = this.router.config.slice(-3);
      let groupName;
      this.mainApp = res;
      const appList = [];
      const innerApps = [];
      const innerNavs = [];
      this.defNavar = this.mainApp.navbar || false;
      this.defaultSideNavbar = this.mainApp.sidenav || false;
      this.defaultSideNavbarBinder = false;
      res.microApps.forEach((app) => {
        if (app.isActive) {
          if (app.group) {
            if (app.group.isNavbar) {
              innerNavs[app.group.name] = app;
            } else {
              if (innerApps[app.group.name]) {
                innerApps[app.group.name].push(app);
              } else {
                innerApps[app.group.name] = [app];
              }
            }
          } else {
            if (app.isLandingPage) {
              this.landingPage = app.routePath;
            }
            if (app.isNavbar) {
              this.navbar = { app: app.routePath, mainApp: this.mainApp, apiEndPoint: app.apiUrl, microApp: app };
              this.navStatus = true;
            } else {
              appList.push({
                img: 'assets/icons/dashboard_black_24dp.svg',
                label: app.label,
                name: app.name,
                routerLink: app.routePath
              });
              this.router.config.unshift({
                path: app.routePath,
                children: [
                  {
                    path: '**',
                    loadChildren: () => import('./components/spa-verticle-host/spa-verticle-host.module')
                      .then(m => m[this.mainApp.template]),
                    data: { app: app.routePath, mainApp: this.mainApp, apiEndPoint: app.apiUrl, microApp: app }
                  }]
              });
            }
          }
        }
      });
      if (Object.keys(innerApps).length > 1 || true) {
        const appListFromInnerApps = [];
        Object.keys(innerApps).forEach((inrApps) => {
          const menuItems = [];
          let groupItem;
          innerApps[inrApps].forEach(element => {
            if (element.isLandingPage) {
              this.landingPage = element.routePath;
              groupName = element.group.name;
            }
            const routeFirst = element.routePath ? element.routePath.split('/')[0] : '';
            if (this.currntPage && (this.currntPage.includes(element.routePath) || this.currntPage.includes(routeFirst))) {
              groupName = element.group.name;
            }
            if (element.group.isLandingPage) {
              groupItem = {
                img: 'assets/icons/dashboard_black_24dp.svg',
                label: element.group.label,
                name: element.group.name,
                routerLink: this.mainApp.namespace + '-' + element.group.name,
              };
              this.router.config.unshift({
                path: this.mainApp.namespace + '-' + element.group.name,
                redirectTo: element.routePath,
                pathMatch: 'full'
              });
            }
            if (innerNavs[inrApps]) {
              this.router.config.unshift({
                path: element.routePath,
                children: [
                  {
                    path: '**',
                    loadChildren: () => import('./components/spa-verticle-host/spa-verticle-host.module')
                      .then(m => m[this.mainApp.template]),
                    data: {
                      app: element.routePath, mainApp: this.mainApp, apiEndPoint: element.apiUrl, microApp: element, innerNav: {
                        app: innerNavs[inrApps].routePath, mainApp: this.mainApp,
                        apiEndPoint: innerNavs[inrApps].apiUrl, microApp: innerNavs[inrApps], innerApps: innerApps[inrApps]
                      }
                    }
                  }]
              });
            } else {
              this.router.config.unshift({
                path: element.routePath,
                children: [
                  {
                    path: '**',
                    loadChildren: () => import('./components/spa-verticle-host/spa-verticle-host.module')
                      .then(m => m[this.mainApp.template]),
                    data: { app: element.routePath, mainApp: this.mainApp, apiEndPoint: element.apiUrl, microApp: element }
                  }]
              });
            }

            menuItems.push({
              img: 'assets/icons/dashboard_black_24dp.svg',
              label: element.label,
              name: element.name,
              routerLink: element.routePath,
            });

          });
          if (groupItem && menuItems.length > 0) {
            appList.push({ ...groupItem, menuItems });
          }
        });
      }

      this.navBarApps = [...appList];
      if (this.defaultSideNavbar && !this.navStatus && !this.defNavar) {
        this.defaultSideNavbarBinder = true;
        this.sideBarApps = [...appList];
      } else if (groupName) {
        const microAppList: any = appList.filter(it => it.name === groupName)[0];
        if (microAppList && microAppList.menuItems && microAppList.menuItems.length > 0) {
          this.defaultSideNavbarBinder = true;
          this.sideBarApps = [...microAppList.menuItems];
        }

      }

    } else {
      this.containerToaster.showWarning('Warning: Micro apps are not available');
    }
  }
  anyAppLoaded(): void {
    if (this.currntPage && this.currntPage !== '/' && this.currntPage !== '/container'
      && this.currntPage !== '' && this.currntPage.includes('-')) {
      const app = this.currntPage.split('-')[0];
      if (app && app.length > 1) {
        this.isLoading = true;
        const subMicroAppsByNamespace = this.singleSpaService.getMicroAppsByNamespace(app).subscribe((res) => {
          this.setContainerApp(res);
          this.isLoading = false;
          this.preloadApiService.loadApi(this.mainApp.preloadURLS);
          this.titleService.setTitle(this.mainApp.label);
          this.router.navigateByUrl(this.currntPage);
          this.currntPage = undefined;
        }, err => {
          this.containerToaster.showError(err.message);
          this.isLoading = false;
        });
        this.subscriptions.push(subMicroAppsByNamespace);
      }
    } else {
      this.currntPage = undefined;
    }
  }


  toggleSideNav(evt) {
    if (evt) {
      this.sideNav.toggle();
    }
  }

  sideBarClose() {
    if (this.sideNav) {
      this.sideNav.close();
    }

  }

  sidebarOut(evt) {
    if (evt) {
      this.sideNav.toggle();
    }
  }

  navbarOut(evt) {
    if (this.sideNav) {
      this.sideNav.close();
    }
    if ((this.defNavbarBinder || this.navStatusBinder) && evt) {
      const microAppList: any = this.navBarApps.filter(it => it.name === evt.name)[0];
      if (microAppList && microAppList.menuItems && microAppList.menuItems.length > 0) {
        this.defaultSideNavbarBinder = true;
        this.sideBarApps = [...microAppList.menuItems];
      } else {
        this.defaultSideNavbarBinder = false;
        this.sideBarApps = [];
      }
    }
  }

  ngAfterContentChecked() {
    this.sideBarAppsBinder = this.sideBarApps;
    this.navBarAppsBinder = this.navBarApps;
    this.navStatusBinder = this.defNavar ? false : this.navStatus;
    this.navbarBinder = this.navbar;
    this.defNavbarBinder = this.defNavar;
  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}

