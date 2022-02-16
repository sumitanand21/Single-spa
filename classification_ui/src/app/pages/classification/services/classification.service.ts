import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { APP } from 'src/app/constants/app.constants';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { hostUrl } from 'src/single-spa/asset-url';
import { CLASSIFICATION_URLS } from '../constants/classification.constants';

@Injectable({
  providedIn: 'root'
})
export class ClassificationService {
  classificationDetails: any = {};
  scheduleRes: any = {};
  constructor(private http: HttpClient, private configService: ConfigurationService) { }

  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }

  getProfilerTableData(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_PROFILER_RESULT, data);

    return this.http.post(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.GET_PROFILER_RESULT +
      `/${this.configService.classificationProfiler}/${data.dataSetName}/${data.fromTime}/${data.toTime}/${data.labelName}`,
      {}, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeatureDataSetProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');

    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CLASSIFICATION_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeatureGroupProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_GROUPS_API, data);
    // return this.http.get('./assets/res/getClassificationFeatureGroupList.json');

    return this.http.get(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_GROUPS_API +
      `/${data.jobType}/${data.modelType}/${data.dataSetName}`,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeaturesTimeColumnProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_TIME_COLUMNS_API, data);
    // return this.http.get('./assets/res/getTimeColumns.json');

    const httpParams = new HttpParams().set('db_name', data.dataSetName);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_TIME_COLUMNS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getALLFeaturesListProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_MAPPINGS_API, data);
    // return this.http.get('./assets/res/getAllFeatureForDataSet.json');

    const httpParams = new HttpParams().set('db_name', data.dataSetName);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CLASSIFICATION_URLS.GET_CLASSIFICATION_DATASET_FEATURE_MAPPINGS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getALLFeaturesListByGroupProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.POST_CLASSIFICATION_DATASET_GROUP_DETAILS_API, data);
    // return this.http.get('./assets/res/getClassificationFeatureByGroup.json');

    return this.http.get(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.POST_CLASSIFICATION_DATASET_GROUP_DETAILS_API +
      `/${data.jobType}/${data.modelType}/${data.groupName}`,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  updateFeatureGroupProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.PUT_CLASSIFICATION_UPDATE_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');

    return this.http.put(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.PUT_CLASSIFICATION_UPDATE_FEATURE_GROUP_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  createFeatureGroupProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.POST_CLASSIFICATION_CREATE_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');

    return this.http.post(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.POST_CLASSIFICATION_CREATE_FEATURE_GROUP_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  scheduleProfiler(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.PUT_SCHEDULE_PROFILER_API, data);
    // return this.http.get('./assets/res/getAllTask.json');

    return this.http.post(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.PUT_SCHEDULE_PROFILER_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getProfDatasourceDeatils(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');

    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CLASSIFICATION_URLS.GET_DATA_SOURCE_DETAILS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  deleteFeatureGroupProf(data) {
    // return this.http.post(APP.BASE_URL + CLASSIFICATION_URLS.DELETE_CLASSIFICATION_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/UpsertClassification.json');

    return this.http.delete(this.configService.profilerBaseUrl +
      CLASSIFICATION_URLS.DELETE_CLASSIFICATION_FEATURE_GROUP_API +
      `/${data.jobType}/${data.modelType}/${data.groupName}`,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
}
