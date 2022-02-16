import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class RouteConfigService {
  constructor(
    private http: HttpClient) {

    }
    routeSubject = new BehaviorSubject<any>(undefined);
    setInitialRoutes() {
    }

  getImportMaps(): Observable<any> {
    return this.http.get('https://container-config.herokuapp.com/api/settings/configDetails');
  }
}
