import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';
import { assetUrl, hostUrl } from '../../single-spa/asset-url';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  forecastBaseUrl = '';
  clusteringBaseUrl = '';
  summaryBaseUrl = '';
  schedulerBaseUrl = '';
  dataInsightsBaseUrl = '';
  correlationBaseUrl = '';
  profilerBaseUrl = '';
  elBaseUrl = '';

  webSocket = 'ws://';
  requestType = 'http://';
  secureRequestType = 'https://';
  ipHost = '';
  appHost = '';
  forecastPod;
  forecastGrafanaUrl = '';
  clusteringPod;
  anomalyProfiler = 'anomaly_profiler*';
  schedulerPod;
  correlationPod;
  classificationPod;
  dataInsightsPod;
  anomalyPod;
  forecastSocket = '';
  clusteringSocket = '';
  profilerSocket = '';
  dataInsightsSocket = '';
  classificationProfiler = 'basic_profiler*';
  socketScheduleExpTime = 360;
  elPod;
  // tslint:disable-next-line:max-line-length
  elUrl;
  userName = '';
  password = '';
  anomalyBaseUrl = '';
  constructor(private http: HttpClient) {
  }

  getConfigurationDetails(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const createUrl = assetUrl('configs/angular_conf.json');
      this.http.get(createUrl).subscribe(response => {
        this.setConfigObject(response);
        resolve(true);
      }, err => {
        this.setConfigObject(null);
        resolve(true);
      });

    });
  }

  CorsAPI() {
    // const url1 = ''; // 'https://www.myntra.com';
    // const url2 = '/gateway/v1/cart/default/summary';
    const url3 = ''; // 'http://192.168.0.104:8080/';
    const url4 = '/result/8080/backend/vax.json';
    const url = url3 + url4;
    this.http.get(url).subscribe(res => {
      console.log('cors res', res);
    }, err => {
      console.log('cors err', err);
    });
  }

  setConfigObject(res?) {
    this.ipHost = location.hostname;
    this.appHost = hostUrl();
    this.forecastPod = res && res.FORECAST_POD ? res.FORECAST_POD : '';
    this.forecastGrafanaUrl = res && res.FORECAST_GRAFANA_URL ? res.FORECAST_GRAFANA_URL : '';
    this.clusteringPod = res && res.CLUSTER_POD ? res.CLUSTER_POD : '';
    this.schedulerPod = res && res.SCHEDULER_POD ? res.SCHEDULER_POD : '';
    this.correlationPod = res && res.CORRELATION_POD ? res.CORRELATION_POD : '';
    this.classificationPod = res && res.CLASSIFICATION_POD ? res.CLASSIFICATION_POD : '';
    this.dataInsightsPod = res && res.DATAINSIGHT_POD ? res.DATAINSIGHT_POD : '';
    this.anomalyPod = res && res.ANOMALY_POD ? res.ANOMALY_POD : '';
    this.forecastSocket = res && res.FORECAST_SOCKET ? res.FORECAST_SOCKET : '';
    this.clusteringSocket = res && res.CLUSTER_SOCKET ? res.CLUSTER_SOCKET : '';
    this.profilerSocket = res && res.PROFILER_SOCKET ? res.PROFILER_SOCKET : '';
    this.dataInsightsSocket = res && res.DATAINSIGHT_SOCKET ? res.DATAINSIGHT_SOCKET : '';
    this.classificationProfiler = res && res.CLASSIFICATION_PROFILER ? res.CLASSIFICATION_PROFILER : '';
    this.socketScheduleExpTime = res && res.SOCKET_SCHEDULER_EXP_TIME ? res.SOCKET_SCHEDULER_EXP_TIME : '';
    this.elPod = res && res.EL_POD ? res.EL_POD : '';
    this.elUrl = res && res.EL_URL ? res.EL_URL : '';
    this.userName = res && res.DEFAULT_NAME ? res.DEFAULT_NAME : '';
    this.password = res && res.DEFAULT_PASSWORD ? res.DEFAULT_PASSWORD : '';
    this.anomalyProfiler = res && res.ANOMALY_PROFILER ? res.ANOMALY_PROFILER : '';

    this.forecastBaseUrl = this.appHost + 'backend/' + this.forecastPod;
    this.clusteringBaseUrl = this.appHost + 'backend/' + this.clusteringPod;
    this.schedulerBaseUrl = this.appHost + 'backend/' + this.schedulerPod;
    this.dataInsightsBaseUrl = this.appHost + 'backend/' + this.dataInsightsPod;
    this.anomalyBaseUrl = this.appHost + 'backend/' + this.anomalyPod;
    this.correlationBaseUrl = this.appHost + 'backend/' + this.correlationPod;
    this.profilerBaseUrl = this.appHost + 'backend/' + this.classificationPod;
    this.elBaseUrl = this.elPod;
  }

  getUrlDetails() {
    return {
      status: 'success',
      forecast: this.forecastSocket,
      clustering: this.clusteringSocket,
      profiler: this.profilerSocket,
      dataMng: this.dataInsightsSocket,
      socketExpTime: this.socketScheduleExpTime
    };
  }


  setDefaultHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json').
      set('Authorization', 'Basic ' + btoa(`${this.userName}:${this.password}`));
    return { headers };
  }


  setNoAuthDefultHeaders() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return { headers };
  }

  setWebSocketUrl() {
    const anomalyWebSocketUrl = this.clusteringSocket;
    return anomalyWebSocketUrl;
 }

}