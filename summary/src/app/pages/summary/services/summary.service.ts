import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP } from 'src/app/constants/app.constants';
import { SUMMARY_URLS, CLUSTER_URLS, DASHBOARDALARM_URLS } from '../constants/summary.constants';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { hostUrl, assetUrl } from 'src/single-spa/asset-url';

@Injectable({
  providedIn: 'root'
})
export class SummaryService {
  dashboardDetails: any;

  constructor(private http: HttpClient, private configService: ConfigurationService) {

  }

  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }
  dataSetName(data) {
    // return this.http.post(APP.BASE_URL + SUMMARY_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getSummaryDetails(data) {
    // return this.http.post(APP.BASE_URL + SUMMARY_URLS.IFRAME_DETAILS, data);
    // return this.http.get('./assets/res/getSummaryDetails.json');
    return this.http.get(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.IFRAME_DETAILS + data.dataSetName,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getDashboardData() {
    return this.http.get(assetUrl('/res/summary.json'));
  }

  getChartData() {
    return this.http.get(assetUrl('/res/scatterplotter.json'));
  }

  getBarChartData() {
    return this.http.get(assetUrl('/res/getPositiveCorrelationGroup.json'));
  }

  getJobTypesList() {
    // return this.http.get(assetUrl('/res/getJobType.json'));
    return this.http.get(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.GET_JOBTYPE_LIST,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getIframeList() {
    // return this.http.get(assetUrl('/res/iframelist.json'));
    return this.http.get(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.GET_IFRAME_LIST,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  postIframeData(data) {
    return this.http.post(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.IFRAME_DETAILS, data,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  updateIframedata(data) {
    return this.http.put(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.IFRAME_DETAILS, data,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  deleteIframedata(dashboardId) {
    const httpParams = new HttpParams().set('id', dashboardId);
    const httpOptions = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.delete(this.configService.dataInsightsBaseUrl +
      SUMMARY_URLS.IFRAME_DETAILS, httpOptions
    ).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }


  /**********************RCA for Clustering Starts*****************************/

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

  /****************************************RCA for Clustering Ends**************************/

  getDashBoardCount(data) {
    // return this.http.get('./assets/res/dashboardCount.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('fromTime', data.fromTime)
      .set('toTime', data.toTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dashboardBaseUrl +
      DASHBOARDALARM_URLS.GET_COUNT_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getLineChartDetails(data) {
    // return this.http.get('./assets/res/dashboardLineChart.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('fromTime', data.fromTime)
      .set('toTime', data.toTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dashboardBaseUrl +
      DASHBOARDALARM_URLS.GET_LINEGRAPH_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getHistogramDetails(data) {
    // return this.http.get('./assets/res/dashboardHistogram.json');
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName)
      .set('fromTime', data.fromTime)
      .set('toTime', data.toTime);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dashboardBaseUrl +
      DASHBOARDALARM_URLS.GET_HISTOGRAM_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }


}
