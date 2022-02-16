import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { CORRELATION_URLS } from '../constants/correlation.constants';
import { GlobalService } from 'src/app/services/global.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { switchMap } from 'rxjs/operators';
import { hostUrl } from 'src/single-spa/asset-url';
@Injectable({
  providedIn: 'root'
})
export class CorrelationService {
  correlationDetails: any = {};
  groupDetils: any = {};
  disableSlider = false;
  constructor(private http: HttpClient, private global: GlobalService, private configService: ConfigurationService) { }
  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }
  getCorrelationTableViewData(data: any) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_TABLE_VIEW_DATA, data);
    // return this.http.get('./assets/res/getCorrelationTableViewData.json');
    const httpParams = new HttpParams().set('correlation_type', data.correlationType);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_CORRELATION_TABLE_VIEW_DATA,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res.data });
      }));
  }
  getCorrelationPlotData(data) {
    // return this.http.get('./assets/res/scatterplotter.json');
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__SCATTERPLOTTER_API, data);

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.POST__SCATTERPLOTTER_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getCorrelationHeatMap(data) {
    // return this.http.get('./assets/res/heatmap.json');
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__HEATMAP_API, data);

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.POST__HEATMAP_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res.data });
      }));
  }
  getPartionedChartData(data) {
    // return this.http.get('./assets/res/partionedchart.json');
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST__PARTIONEDCHART_API, data);

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.POST__PARTIONEDCHART_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res.data });
      }));
  }

  getFeatureDataSet(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');

    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CORRELATION_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeatureGroup(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_GROUPS_API, data);
    // return this.http.get('./assets/res/getCorrelationFeatureGroupList.json');

    const httpParams = new HttpParams().set('db_name', data.dataSetName);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_GROUPS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getFeaturesTimeColumn(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_TIME_COLUMNS_API, data);
    // return this.http.get('./assets/res/getTimeColumns.json');

    const httpParams = new HttpParams().set('db_name', data.dataSetName);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_CORRELATION_DATASET_TIME_COLUMNS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getALLFeaturesList(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_MAPPINGS_API, data);
    // return this.http.get('./assets/res/getAllFeatureForDataSet.json');

    const httpParams = new HttpParams().set('db_name', data.dataSetName);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_CORRELATION_DATASET_FEATURE_MAPPINGS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getALLFeaturesListByGroup(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST_CORRELATION_DATASET_GROUP_DETAILS_API, data);
    // return this.http.get('./assets/res/getFeatureByGroup.json');

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.POST_CORRELATION_DATASET_GROUP_DETAILS_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  upsertFeatureGroup(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.PUT_CORRELATION_UPDATE_FEATURE_GROUP_API, data);
    // return this.http.get('./assets/res/getAllTask.json');

    return this.http.put(this.configService.correlationBaseUrl +
      CORRELATION_URLS.PUT_CORRELATION_UPDATE_FEATURE_GROUP_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getCorrelationListData(data: any) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_CORRELATION_LIST_DATA, data);
    // return this.http.get('./assets/res/getCorrelationListData.json');

    const httpParams = new HttpParams().set('correlation_type', data.correlationType);
    const httpOpt = {...this.configService.setNoAuthDefultHeaders(), params : httpParams };
    return this.http.get(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_CORRELATION_LIST_DATA,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res.columns });
      }));
  }

  getPositiveGroupsData(data: any) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_POSITIVE_GROUPS, data);
    // return this.http.get('./assets/res/getPositiveCorrelationGroup.json');

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_POSITIVE_GROUPS,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getNegativeGroupsData(data: any) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_NEGATIVE_GROUPS, data);
    // return this.http.get('./assets/res/getNegativeCorrelationGroup.json');

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_NEGATIVE_GROUPS,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getGroupsDetailsData(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_GROUP_DETAILS, data);
    // return this.http.get('./assets/res/getGroupdetailsData.json');

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.GET_GROUP_DETAILS,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getCorrelatedDatasourceDeatils(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.GET_DATA_SOURCE_DETAILS_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');

    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CORRELATION_URLS.GET_DATA_SOURCE_DETAILS_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  deleteCorrelatedGroup(data) {
    // return this.http.post(APP.BASE_URL + CORRELATION_URLS.POST_CORRELATION_DELETE_GROUP_API, data);
    // return this.http.get('./assets/res/getDataSetDetails1.json');

    return this.http.post(this.configService.correlationBaseUrl +
      CORRELATION_URLS.POST_CORRELATION_DELETE_GROUP_API,
      data, this.configService.setNoAuthDefultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
}
