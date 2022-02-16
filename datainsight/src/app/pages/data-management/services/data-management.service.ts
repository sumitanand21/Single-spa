import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { DATAMANAGEMENT_URLS } from '../constants/data-management.constants';
import { GlobalService } from 'src/app/services/global.service';
import { assetUrl, hostUrl } from 'src/single-spa/asset-url';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  showDataSource = false;
  showDataPreview = false;
  showUpsertDataSet = false;
  showConfiguration = false;
  showSystemNotification = false;
  showUpsertConfiguration = false;
  selectedConfigurationName: '';
  selectedConfiguration: any = {};
  selectedDataSetName = '';
  selectedDataSourceType = '';

  showNotificationsMgt = false;

  constructor(private http: HttpClient, private global: GlobalService, private configService: ConfigurationService) { }

  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }

  getJobType(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_JOBTYPE_API, data);
    // return this.http.get('./assets/res/getJobType.json');

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_JOBTYPE_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getConfigurationTableData(data) {
    //  return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_TABLEVIEW_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_CONFIGURATION_TABLEVIEW_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getConfigurationViewDetails(data) {
    //  return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_DETAILEDVIEW_API, data);
    // return this.http.get('./assets/res/getConfigDetails.json');
    const httpParams = new HttpParams().set('configurationName', data.dataSetName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_CONFIGURATION_DETAILEDVIEW_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  createConfigurationData(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.CREATE_CONFIGURATION_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.CREATE_CONFIGURATION_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  createNewDataType(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.CREATE_NEWDBYTYPE_API, data);
    // return this.http.get('./assets/res/getConfiguration.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.CREATE_NEWDBYTYPE_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  deleteConfiguration(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.DELETE_CONFIGURATION, data);
    // return this.http.get('./assets/res/deleteConfiguration.json');
    const httpParams = new HttpParams().set('configurationName', data.configName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.delete(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.DELETE_CONFIGURATION,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getDBList(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_CONFIGURATION_DBTYPE_API, data);
    // return this.http.get('./assets/res/getConfigDBtype.json');

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_CONFIGURATION_DBTYPE_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getDatasourceList() {
    // return this.http.get('./assets/res/getdatasourceList.json');
    // return this.http.get(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATA_SOURCE_LIST_API);

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATA_SOURCE_LIST_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getDatasourceDeatils(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');

    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATA_SOURCE_DETAILS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  deleteDatasource(data) {
    // return this.http.get('./assets/res/getDataSetDetails1.json');
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.DELETE_DATA_SOURCE_API, data);

    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.delete(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.DELETE_DATA_SOURCE_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getConfigurationList(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGURATION_API, data);
    // return this.http.get('./assets/res/getConfigurationList.json');

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGURATION_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getConfigurationNamesList(dataSourceType) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGURATION_API, data);
    // if (dataSourceType === 'stored_data') {
    //   // return this.http.get('./assets/res/getConfigurationList.json');
    // } else {
    //   // return this.http.get('./assets/res/getConfigurationListStream.json');
    // }
    const httpParams = new HttpParams().set('dataSourceType', dataSourceType);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGURATION_NAMES_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getConfigurationDet(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGDET_API, data);
    // return this.http.get('./assets/res/getConfigurationDet.json');

    const httpParams = new HttpParams().set('configurationName', data.configurationName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_CONFIGDET_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }



  getPropertyType(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_PROPERTYTYPE_API, data);
    // return this.http.get('./assets/res/getPropertyType.json');

    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_PROPERTYTYPE_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getDataPreview(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_DATAPREVIEW_API, data);
    // return this.http.get('./assets/res/getDataPreview.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_DATAPREVIEW_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getStepsDetails(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STEPS_API, data);
    // return this.http.get('./assets/res/getStepDetails2.json');
    // return this.http.get('./assets/res/getStepDetails.json');

    const httpParams = new HttpParams().set('configurationName', data.configurationName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STEPS_API, null,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeatureDet(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FETCH_FEATURES_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FETCH_FEATURES_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  createDataSet(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_CREATE_DATA_SET_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_CREATE_DATA_SET_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  updateDataSet(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.PUT_DATAINSIGHT_UPDATE_DATA_SET_API, data);
    // return this.http.get('./assets/res/FetchFeature.json');

    return this.http.put(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.PUT_DATAINSIGHT_UPDATE_DATA_SET_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  fileUpload(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FILE_UPLOAD_API, data);
    // return this.http.get('./assets/res/FileUpload.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_FILE_UPLOAD_API,
      data, this.configService.setfileUploadHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  updateConfiguration(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.UPDATE_CONFIGURATION, data);
    // return this.http.get('./assets/res/getConfiguration.json');

    return this.http.put(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.UPDATE_CONFIGURATION,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  streamDataSchedule(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STREAM_SCHEDULE_API, data);
    // return this.http.get('./assets/res/FileUpload.json');

    return this.http.post(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.POST_DATAINSIGHT_STREAM_SCHEDULE_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getstreamDataSchedule(data) {
    // return this.http.post(APP.BASE_URL + DATAMANAGEMENT_URLS.GET_DATAINSIGHT_STREAM_SCHEDULE_API, data);
    // return this.http.get('./assets/res/getStreamSchedule.json');
    // return this.http.get('./assets/res/getNoStreamSchedule.json');

    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      DATAMANAGEMENT_URLS.GET_DATAINSIGHT_STREAM_SCHEDULE_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getNotificationsGroupData(data) {
    // return this.http.get(assetUrl('/res/notificationsgroup.json'));
    return this.http.get(this.configService.notifcationsBaseUrl +
      DATAMANAGEMENT_URLS.GET_EMAIL_RULES_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  postNotificationsGroupData(data) {
    // return this.http.get(assetUrl('/res/notificationsgroup.json'));
    return this.http.post(this.configService.notifcationsBaseUrl +
      DATAMANAGEMENT_URLS.CREATE_EMAIL_RULES_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  editNotificationsGroupData(data) {
    // return this.http.get(assetUrl('/res/notificationsgroup.json'));
    return this.http.put(this.configService.notifcationsBaseUrl +
      DATAMANAGEMENT_URLS.UPDATE_EMAIL_RULES_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  deleteNotificationsGroupData(groupId) {
    const httpParams = new HttpParams().set('id', groupId);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.delete(this.configService.notifcationsBaseUrl +
      DATAMANAGEMENT_URLS.DELETE_EMAIL_RULES_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  //For Server Configurations for Notifications
  getServerConfiguration() {
    //return this.http.get(assetUrl('/res/serverconfiguration.json'));
    return this.http.get(this.configService.serverConfigurationUrl +
      DATAMANAGEMENT_URLS.GET_SERVERCONFIGURATION_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  updateServerConfiguration(data) {
    //return this.http.get(assetUrl('/res/notificationsgroup.json'));
    return this.http.put(this.configService.serverConfigurationUrl +
      DATAMANAGEMENT_URLS.PUT_SERVERCONFIGURATION_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
}
