import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { ANOMALY_URLS } from '../constants/anomaly.constants';
import { switchMap } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { hostUrl } from 'src/single-spa/asset-url';

@Injectable({
  providedIn: 'root'
})
export class AnomalyService {

  /*************variable declaration Anomaly***********/
  AnomalyModel = false;
  AnomalyUpdateModel = false;
  AnomalyAllTask = false;
  AnomalySchedule = false;
  AnomalyDetection = false;
  AnomalyView = false;
  AnomalyModelTraining = false;
  AnomalymodelName = '';
  AnomalymodelType = '';
  AnomalyTaskName = '';
  AnomalyModelTrainingName = '';
  AnomalyModelTrainingNameDisp = '';
  AnomalySelectedTrainingModel;
  selectedAnmModel;
  activatedPath = '';
  disableheader = false;
  /*************variable declaration Anomaly Ends***********/

  constructor(private http: HttpClient, private configService: ConfigurationService) {
  }
  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }
  createTask(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_CREATE_TASK_API, data);
    return this.http.post(this.configService.schedulerBaseUrl +
      ANOMALY_URLS.POST_CREATE_TASK_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  updateTask(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.PUT_UPDATE_TASK_API, data);
    return this.http.put(this.configService.schedulerBaseUrl +
      ANOMALY_URLS.PUT_UPDATE_TASK_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnmMdConfigurations(data) {
    // return this.http.get('./assets/res/configurationformodelconfig.json');
    // // return this.http.get('./assets/res/newcondata.json');
    // return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIGURATIONS_API, data);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIGURATIONS_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  loadAnmMdConfigMasterData(data) {
    return forkJoin([this.getAnmMdConfigurations(data), this.getAnomalyDataSets(data)]);
  }
  createAnmModel(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_SAVE_ANOMALYMODEL_CONFIG_API, data);
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.POST_SAVE_ANOMALYMODEL_CONFIG_API +
      data.jobType,
      data.modelConfig, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  updateAnmModel(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.PUT_UPDATE_ANOMALYMODEL_CONFIG_API, data);
    return this.http.put(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.PUT_UPDATE_ANOMALYMODEL_CONFIG_API +
      data.jobType,
      data.modelConfig, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyDetectionTableData() {
    // return this.http.get('./assets/res/anomalydettable.json');
    // return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_TABLE_DATA_API);
    const elkUrl = this.configService.elBaseUrl + this.configService.elUrl;
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANMDETECTION_TABLE_DATA_API,
      {}, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res, elUrl: elkUrl });
      }));
  }
  getAnomalyDetTrainingResultDetails(data) {
    // return this.http.get('./assets/res/amnd1.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_MODEL_TR_DETAILS_API, data);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANMDETECTION_MODEL_TR_DETAILS_API +
      data.modelId,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyDetDetails(data) {
    // return this.http.get('./assets/res/amnd2.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANMDETECTION_MODEL_ANMD_DETAILS_API, data);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANMDETECTION_MODEL_ANMD_DETAILS_API +
      data.modelId,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyModelsTableData(data) {
    // return this.http.get('./assets/res/anomalies.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANM_TABLE_DATA_API, data);
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANM_TABLE_DATA_API +
      data.dataSetName + '/' + data.fromTime + '/' + data.toTime,
      {}, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyModelsDetails(data) {
    // return this.http.get(APP.BASE_URL + ANOMALY_URLS.GET_ANM_MODEL_DETAILS_API);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANM_MODEL_DETAILS_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getalltasksData() {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ALLTASK_DATA_API, {});
    // return this.http.get('./assets/res/getAllTask.json');
    return this.http.get(this.configService.schedulerBaseUrl +
      ANOMALY_URLS.GET_ALLTASK_DATA_API,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  loadMasterDataForTask(jobType) {
    return forkJoin([this.getAllAnomalyModelConfig(), this.getAnomalyDataSets(jobType)]);
  }
  getAllAnomalyModelConfig() {
    // return this.http.get('./assets/res/1.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG, {});
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyDataSets(data) {
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
    // return this.http.get('./assets/res/2.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_DATASET_LIST, data);
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      ANOMALY_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyDataSetFeatures(data) {
    // return this.http.get('./assets/res/getFaturesForModelConfig.json');
    // return this.http.get('./assets/res/getDataSetDetails1.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_DATA_SOURCE_FEATURES_API, data);
    const httpParams = new HttpParams().set('dataSetName', data.dataSetName);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      ANOMALY_URLS.GET_DATA_SOURCE_FEATURES_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getAnmolayModelConfigByName(data) {
    // return this.http.get('./assets/res/anomalymodelconfigdetails.json');
    // return this.http.get('./assets/res/anomalymodelconfigdetails.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG_USING_NAME, data);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANOMALY_MODEL_CONFIG_USING_NAME +
      data.jobType + '/' + data.modelConfigName,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
    // if(data.jobType == 'MODELI'){
    // return this.http.get('http://localhost:4200/assets/testData/getModelBYNameMODELI.json');
    // }else{
    // return this.http.get('http://localhost:4200/assets/testData/getModelBYNameMODELII.json');
    // }

  }

  deleteAnomalyModelConfig(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_ANOMALY_MODEL_CONFIG, data);
    const httpOpt = {
      ...this.configService.setDefaultHeaders(),
      body: data.modelConfig
    };
    return this.http.delete(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.DELETE_ANOMALY_MODEL_CONFIG +
      data.jobType,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
    // return this.http.get('http://localhost:4200/assets/testData/deleteModel.json');
  }
  getScheduleDetails(scheduleId) {
    // return this.http.get('./assets/res/task.json');
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_SCHEDULE_DETAILS, scheduleId);
    return this.http.get(this.configService.schedulerBaseUrl +
      ANOMALY_URLS.GET_SCHEDULE_DETAILS +
      scheduleId,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getTrainedModelDetails(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_TRAINED_MODELS, data);
    // return this.http.get('./assets/res/getTrainingModel.json');
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_TRAINED_MODELS +
      data.schedule_name,
      {}, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getTrainingStatusDetails(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_TRAINING_STATUS, data);
    // return this.http.get('./assets/res/getTrainingDtatsList.json');
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_TRAINING_STATUS + data.schedule_name + '/' + data.jobType,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  deleteTrainedModels(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_TRAINED_MODELS, data);
    const httpOpt = {
      ...this.configService.setDefaultHeaders(),
      body: data.trainedModels
    };
    return this.http.delete(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.DELETE_TRAINED_MODELS,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  actionOnTask(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.ACTION_ON_TASK, data);
    return this.http.post(this.configService.schedulerBaseUrl +
      ANOMALY_URLS.ACTION_ON_TASK +
      data.actionType,
      data.id, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  scheduleDetectAnomaly(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_SCHEDULE_DETECT_ANOMALY_API, data);
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.POST_SCHEDULE_DETECT_ANOMALY_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  scheduleAnomalyProfiler(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_ANOMALY_SCHEDULE_PROFILING_API, data);
    return this.http.post(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.POST_ANOMALY_SCHEDULE_PROFILING_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
  getAnomalyProfiler(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.GET_ANOMALY_PROFILING_RESULT_API, data);
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_ANOMALY_PROFILING_RESULT_API +
      this.configService.anomalyProfiler + '/' + data.anomalyId + '/' + data.jobType,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getDataPreview(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.POST_DATAINSIGHT_DATAPREVIEW_API, data);
    // return this.http.get('./assets/res/getDataPreview.json');
    return this.http.post(this.configService.dataInsightsBaseUrl +
      ANOMALY_URLS.POST_DATAINSIGHT_DATAPREVIEW_API,
      data, this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  stopTrainedModels(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_STOP_TRAINEDMODEL_API, data);
    // return this.http.get('./assets/res/stopTrainedModels.json');
    const httpOpt = {
      ...this.configService.setDefaultHeaders(),
      body: data.trainedModels
    };
    return this.http.delete(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.DELETE_STOP_TRAINEDMODEL_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  stopAnomalyDetection(data) {
    // return this.http.post(APP.BASE_URL + ANOMALY_URLS.DELETE_STOP_ANOMALYDETECTION_API, data);
    // return this.http.get('./assets/res/stopTrainedModels.json');
    const httpOpt = {
      ...this.configService.setDefaultHeaders(),
      body: data.trainedModels
    };
    return this.http.delete(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.DELETE_STOP_ANOMALYDETECTION_API,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
}
