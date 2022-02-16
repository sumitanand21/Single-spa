import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  defaultHomePath  = false;
  apiEndPoint = environment.apiEndPoint;
  showDataSource = false;
  showDataPreview = false;
  showUpsertDataSet = false;
  showConfiguration = false;
  showUpsertConfiguration = false;
  selectedConfigurationName: any = '';
  selectedConfiguration: any = {};
  selectedDataSetName = '';
  selectedProject: any = null;

  constructor(private http: HttpClient) { }
  createConfigurationData(data: any) {
    return this.http.post(this.apiEndPoint + '/con/add-app', data);
  }
  updateConfigurationData(data: any) {
    return this.http.post(this.apiEndPoint + '/con/update-app', data);
  }
  getMicroappList(){
    return this.http.get('./assets/mfe-config/container.json');
    // return this.http.get(this.apiEndPoint + '/con/apps');
  }

  getKeyCloakAuthConfiguration(){
    return this.http.get('./assets/mfe-config/keycloakconf.json');
  }

  getEditMicroApp(id: any){
    return this.http.get(this.apiEndPoint + '/con/app-details/' + id);
  }
  removeApp(id) {
    return  this.http.delete(this.apiEndPoint + '/con/' + id);

  }
  restoreApp(id) {
    return  this.http.get(this.apiEndPoint + '/con/restore/' + id);
  }
  getInActiveMicroappList(){
    return this.http.get(this.apiEndPoint + '/con/inactive');
  }
}
