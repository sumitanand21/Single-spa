import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { APP } from 'src/app/constants/app.constants';
import { FORECAST_URLS } from '../constants/forecast.constants';
import { GlobalService } from 'src/app/services/global.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { hostUrl } from 'src/single-spa/asset-url';

@Injectable({
  providedIn: 'root'
})
export class ForecastService {
  /*************variable declaration Forecast***********/
  ForeCastSelection = false;
  ForeCastProcessing = false;
  ForecastModel = false;
  ForeCastUpdateModel = false;
  ForecastCompare = false;
  ForecastmodelName = '';
  selectedModelConfig;
  CompareProcess: any = [];
  dataSetId = '';
  headers;
  activatedPath = '';
  /*************variable declaration Forecast Ends***********/
  constructor(private http: HttpClient, private global: GlobalService, private configService: ConfigurationService) { }
  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }
  getAllModelConfigs(jobType) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_ALL_MODELCONFIGS_API, jobType);
    // return this.http.get('./assets/res/getallconfigforecast.json');
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_ALL_MODELCONFIGS_API,
    this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  forecastProcessingModelDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECASTPROCESSING_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastprocessingdetails.json');
    const forecastGrfUrl = this.configService.forecastGrafanaUrl;
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_FORECASTPROCESSING_MODELCONFIG_DETAILS_API +
    data.dataSetName + '/' + data.dataId,
    this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res, grfnUrl: forecastGrfUrl });
    }));
  }

  forecastProcessingtable(data) {
  // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECAST_PROCESSING_API, data);
   // return this.http.get('./assets/res/forecastproctabledata.json');
   return this.http.get(this.configService.forecastBaseUrl +
   FORECAST_URLS.GET_FORECAST_PROCESSING_API +
   data.dataSetName,
   this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
     return of({ status: 'success', data: res });
   }));
  }

  datasetname(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/dataset.json');
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
    FORECAST_URLS.GET_DATASET_LIST,
    httpOpt).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  ForecastSelectiontable(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_FORECAST_SELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_FORECAST_SELECTION_API +
    data.dataSetName,
    this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  ForecastSelectionUpdatetable(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.UPDATE_FORECAST_SELECTION_TABLE_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
    return this.http.put(this.configService.forecastBaseUrl +
    FORECAST_URLS.UPDATE_FORECAST_SELECTION_TABLE_API,
    data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  getModelConfigDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastmodelconfigdetails.json');
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_MODELCONFIG_DETAILS_API +
    data.jobType + '/' + data.modelConfig,
    this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  updateForecastSelection(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_UPDATE_FORECASTSELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
    return this.http.put(this.configService.forecastBaseUrl +
    FORECAST_URLS.PUT_UPDATE_FORECASTSELECTION_API,
    data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  saveForecastSelection(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_SAVE_FORECASTSELECTION_API, data);
    // return this.http.get('./assets/res/forecastselectiontable.json');
    return this.http.post(this.configService.forecastBaseUrl +
    FORECAST_URLS.POST_SAVE_FORECASTSELECTION_API,
    data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  handleForecastProcessing(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_HANDLE_FORECASTPROCESSING_API, data);
    return this.http.put(this.configService.forecastBaseUrl +
    FORECAST_URLS.PUT_HANDLE_FORECASTPROCESSING_API,
    data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  getModelConfigUpdateDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_MODELCONFIG_DETAILS_API, data);
    // return this.http.get('./assets/res/forecastmodelconfigdetails.json');
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_MODELCONFIG_DETAILS_API +
    data.jobType + '/' + data.modelConfig,
    this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  createModelConfigDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_CREATE_FORECASTMODELCONFIG_API, data);
    return this.http.post(this.configService.forecastBaseUrl +
    FORECAST_URLS.POST_CREATE_FORECASTMODELCONFIG_API +
    data.jobType,
    data.modelConfig, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }
  UpdateModelConfigDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_UPDATE_FORECASTMODELCONFIG_API, data);
    return this.http.put(this.configService.forecastBaseUrl +
    FORECAST_URLS.PUT_UPDATE_FORECASTMODELCONFIG_API +
    data.jobType,
    data.modelConfig, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  deleteModelConfigDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.DELETE_REMOVE_FORECASTMODELCONFIG_API, data);
    const httpOpt = {...this.configService.setDefaultHeaders(),
      body : data.modelConfig
    };
    return this.http.delete(this.configService.forecastBaseUrl +
    FORECAST_URLS.DELETE_REMOVE_FORECASTMODELCONFIG_API +
    data.jobType,
    httpOpt).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  getConfigurationModelConfig(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.GET_DROPDOWN_FORECASTMODELCONFIG_API, {});
    // return this.http.get('./assets/res/modelconfigdropdown.json');
    // return this.http.get('./assets/res/getmodelconfigdetails.json');
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = {...this.configService.setDefaultHeaders(), params : httpParams };
    return this.http.get(this.configService.forecastBaseUrl +
    FORECAST_URLS.GET_DROPDOWN_FORECASTMODELCONFIG_API,
    httpOpt).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  scheduleSelectionDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.PUT_SCHEDULE_FORECASTSELECTION_API, data);
    return this.http.put(this.configService.forecastBaseUrl +
    FORECAST_URLS.PUT_SCHEDULE_FORECASTSELECTION_API,
    data.scheduleForecast, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res });
    }));
  }

  getForecastCompareDetails(data) {
    // return this.http.post(APP.BASE_URL + FORECAST_URLS.POST_FETCH_FORECASTCOMPARE_API, data);
    // return this.http.get('./assets/res/forecastcomparedata.json');
    const forecastGrfUrl = this.configService.forecastGrafanaUrl;
    return this.http.post(this.configService.forecastBaseUrl +
    FORECAST_URLS.POST_FETCH_FORECASTCOMPARE_API,
    data.dataIds, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
      return of({ status: 'success', data: res, grfnUrl: forecastGrfUrl });
    }));
  }
  getModelConfig() {
    return this.http.get(this.global.baseURL + this.global.forecastModelConfig).map((res: Response) => res.json());
  }
}
