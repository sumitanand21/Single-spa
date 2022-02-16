import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { SingleSpaService } from '../../services/single-spa.service';
import { SpaHostV1Component } from './spa-host-v1.component';

@Injectable({ providedIn: 'root' })
export class SpaHostV1UnmountGuard implements CanDeactivate<SpaHostV1Component> {
  constructor(private singleSpaService: SingleSpaService, private router: Router) { }
  canDeactivate(
    component: SpaHostV1Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
    ): boolean | Observable<boolean> {
      const currentApp = component.contentApp.app;
      const navApp = component.navApp ? component.navApp.app : undefined;
      const nextApp = this.extractAppDataFromRouteTree(nextState.root);
      if (!nextApp) {
        return true;
      }
      if (currentApp === nextApp || navApp === nextApp) {
        return true;
      }
      if (this.singleSpaService.loadedParcels[currentApp]) {
        this.singleSpaService.unmount(currentApp).subscribe();
      }
      if (this.singleSpaService.loadedParcels[navApp]) {
         this.singleSpaService.unmount(navApp).subscribe();
      }
      return true;
    }
    private extractAppDataFromRouteTree(routeFragment: ActivatedRouteSnapshot): string {
      if (routeFragment.data && routeFragment.data.app) {
        return routeFragment.data.app;
      }
      if (!routeFragment.children.length) {
        return null;
      }
      return routeFragment.children.map(r => this.extractAppDataFromRouteTree(r)).find(r => r !== null);
    }
  }
