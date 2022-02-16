import { Injectable } from '@angular/core';
import { mountRootParcel, Parcel, ParcelConfig } from 'single-spa';
import { Observable, from, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GlobalEventDistributorService } from './global-event-distributor.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SingleSpaService {
  loaderSpaApp = false;
  apiEndPoint = environment.apiEndPoint;
  projectName;
  appName;
  constructor(private http: HttpClient, public globalEventDistributor: GlobalEventDistributorService) {}
  public loadedParcels: {
    [appName: string]: Parcel;
  } = {};

  mount(appName: string, domElement: HTMLElement, mainApp, apiEndPoint, microApp, innerApps?): Observable<unknown> {
    this.projectName = mainApp.label;
    this.appName = microApp.label;
    return from(System.import<ParcelConfig>(microApp.url)).pipe(
        tap((app: ParcelConfig) => {
          this.loadedParcels[appName] = mountRootParcel(app, {
            domElement,
            mainApp,
            apiEndPoint,
            globalEventDistributor : this.globalEventDistributor,
            groupName: microApp.groupName,
            microApp,
            innerApps
          });
        })
      );
  }

  unmount(appName: string): Observable<unknown> {
    // return from(this.loadedParcels[appName].mountPromise.then(parcel => {
    //   // Now it is safe to call unmount
    //   this.loadedParcels[appName].unmount();
    //   delete this.loadedParcels[appName];
    // }));

    if (this.loadedParcels[appName].getStatus() === 'MOUNTED') {
      return from(this.loadedParcels[appName].unmount()).pipe(
        tap(() => delete this.loadedParcels[appName]), catchError(this.errorHandler)
      );
    } else {
      return of(true);
    }
  }

  // getImportMaps(): Observable<any> {
  //   return this.http.get(this.apiEndPoint + '/settings/configDetails');
  // }
  // getMicroApps(id): Observable<any> {
  //   return this.http.get(this.apiEndPoint + '/con/micro-apps/' + id);
  // }
  getMicroAppsByNamespace(namespace): Observable<any> {
    return this.http.get('./assets/mfe-config/projects/' + namespace + '.json');
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(new Error('E'));
}
}
