import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SpaHostComponent } from './spa-host.component';
import { SingleSpaService } from '../../services/single-spa.service';

@Injectable({ providedIn: 'root' })
export class SpaUnmountGuard implements CanDeactivate<SpaHostComponent> {
  constructor(private singleSpaService: SingleSpaService, private router: Router) { }
  canDeactivate(
    component: SpaHostComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const currentApp = component.appName;
    const nextApp = this.extractAppDataFromRouteTree(nextState.root);
    if (!nextApp) {
      return true;
    }
    if (currentApp === nextApp) {
      return true;
    }
    if (this.singleSpaService.loadedParcels[currentApp]) {
      this.singleSpaService.unmount(currentApp).subscribe();
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
