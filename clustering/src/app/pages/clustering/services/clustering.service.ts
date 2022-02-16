import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { CLUSTER_URLS } from '../constants/clustering.constants';
import { switchMap } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { hostUrl } from 'src/single-spa/asset-url';

@Injectable({
  providedIn: 'root'
})
export class ClusteringService {

  /*************variable declaration Clustering***********/
  ClusteringModel = false;
  ClusteringUpdateModel = false;
  Classification = false;
  clustering = false;
  ClusteringSchedule = false;
  ClusteringExecution = false;
  RCA = false;
  ClusteringModelTraining = false;
  ClusteringmodelName = '';
  ClusteringmodelType = '';
  ClusteringTaskName = '';
  ClusteringModelTrainingName = '';
  ClusteringModelTrainingNameDisp = '';
  ClusteringSelectedTrainingModel;
  selectedAnmModel;
  activatedPath = '';
  disableheader = false;
  classificationDetails: any = {};
  scheduleRes: any = {};
  /*************variable declaration Clustering Ends***********/

  constructor(private http: HttpClient, private configService: ConfigurationService) {
  }
  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }


  getClusteringModelsTableData(data) {
    // return this.http.get('./assets/res/anomaliesNew1.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('jobType', data.jobType)
      .set('fromTime', data.fromTime)
      .set('toTime', data.toTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_CLUSTER_TABLE_DATA_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }


  getClusteringDataSets(data) {
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CLUSTER_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }


  getAnmolayModelConfigByName(data) {
    // return this.http.get('./assets/res/anomalymodelconfigdetails.json');
    return this.http.get(this.configService.anomalyBaseUrl +
      CLUSTER_URLS.GET_ANOMALY_MODEL_CONFIG_USING_NAME +
      data.jobType + '/' + data.modelConfigName,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  scheduleClusteringProfiler(data) {
    // return this.http.get('./assets/res/anomaliesNewprofiling.json');
    return this.http.post(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.POST_CLUSTER_SCHEDULE_PROFILING_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  scheduleClusteringSequence(data) {
    // return this.http.get('./assets/res/anomaliesNewprofiling.json');
    return this.http.post(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.POST_CLUSTER_SCHEDULE_SEQUENCE_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getClusteringProfiler(data) {
    // return this.http.get('./assets/res/anomaliesNewRCA.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('clusterId', data.clusterId)
      .set('timestamp', data.timestamp)
      .set('jobType', data.jobType)
      .set('modelName', data.modelName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_CLUSTER_PROFILING_RESULT_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getResourceAutoComplete(data) {
    // return this.http.get('./assets/res/ResourceAutoComplete.json');

    const httpParams = new HttpParams().set('words', data.searchText);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_AUTOCOMPLETE_RESOLUTION_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  getResourceAutoCompleteMaster() {
    // return this.http.get('./assets/res/ResourceAutoCompleteMaster.json');

    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_MASTER_RESOLUTION_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  editResolution(data) {
    // return this.http.get('./assets/res/ResourceAutoComplete.json');
    return this.http.put(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.PUT_RESOLUTION_DETAILS_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  editClusterName(data) {
    // return this.http.get('./assets/res/ResourceAutoComplete.json');

    const httpParams = new HttpParams().set('clusterId', data.clusterId)
      .set('clusterName', data.clusterName)
      .set('modelName', data.modelName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.put(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.PUT_CLUSTER_NAME_API,
      {}, httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  deleteClusterName(data) {
    // return this.http.get('./assets/res/ResourceAutoComplete.json');

    const httpParams = new HttpParams().set('clusterId', data.clusterId)
      .set('modelName', data.modelName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.delete(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.DELETE_CLUSTER_NAME_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));

  }

  getSequenceDataPreview(data) {
    // return this.http.get('./assets/res/getSequenceDataPreview.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('timestamp', data.timestamp)
      .set('startTime', data.startTime)
      .set('endTime', data.endTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_SEQUENCE_DETAILS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getAlarmDataPreview(data) {
    // return this.http.get('./assets/res/getAlarmDataPreview.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('startTime', data.startTime)
      .set('endTime', data.endTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.clusteringBaseUrl +
      CLUSTER_URLS.GET_ALARM_DETAILS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }




}

