import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import { APP } from 'src/app/constants/app.constants';
import { ANOMALY_URLS } from '../constants/anomaly.constants';
import { switchMap } from 'rxjs/operators';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { hostUrl } from 'src/single-spa/asset-url';
import { CLASSIFICATION_URLS } from '../constants/classification.constants';
import { NWSNAPSHOT_URLS } from '../constants/nwsnapshot.constants';

@Injectable({
  providedIn: 'root'
})
export class NwSnapshotService {

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

  dataSetName(data) {
    // return this.http.post(APP.BASE_URL + SUMMARY_URLS.GET_DATASET_LIST, data);
    // return this.http.get('./assets/res/getCorrelatonFeatureDataSetList.json');
    const httpParams = new HttpParams().set('jobType', data.jobType);
    const httpOpt = { ...this.configService.setDefaultHeaders(), params: httpParams };
    return this.http.get(this.configService.dataInsightsBaseUrl +
      CLASSIFICATION_URLS.GET_DATASET_LIST,
      httpOpt).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  getModelConfigs() {
    return this.http.get(this.configService.anomalyBaseUrl +
      ANOMALY_URLS.GET_MODEL_CONFIG_LISTS,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }

  postCompareData(data) {
    // return this.http.get('./assets/res/alarmcompare.json');
    return this.http.post(this.configService.nwSnapshotBaseUrl +
      NWSNAPSHOT_URLS.POST_COMPARE_DATA, data,
      this.configService.setDefaultHeaders()).pipe(switchMap((res: any) => {
        return of({ status: 'success', data: res });
      }));
  }
}

