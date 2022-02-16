
import { enableProdMode, NgZone } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import singleSpaAngular, { getSingleSpaExtraProviders } from 'single-spa-angular';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import { setWebpackPath } from './single-spa/asset-url';

if (environment.production) {
  enableProdMode();
}

const lifecycles = singleSpaAngular({
  bootstrapFunction: singleSpaProps => {
    const weburl: any = {...singleSpaProps };
    if (environment.production) {
      setWebpackPath(weburl.microApp.url);
      // setPublicPath(weburl.microApp.url);
    }
    singleSpaPropsSubject.next(singleSpaProps);
    const globalEventDistributor = 'globalEventDistributor';
    return platformBrowserDynamic([getSingleSpaExtraProviders(),
      {provide: 'globalEventDispatcherRef', useValue: singleSpaProps[globalEventDistributor]}]).bootstrapModule(AppModule);
  },
  template: '<classification-root />',
  Router,
  NgZone,
  AnimationEngine,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
