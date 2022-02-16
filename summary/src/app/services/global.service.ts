import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { DisplaypopupComponent } from '../dialogs/displaypopup/displaypopup.component';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  globalEventDistributor: any;
  apiEndPoint;
  prefixUrl = 'vax-summary';
  correlationDetails;
  removeForecastAPI: any;
  deleteForecastAPI: any;
  editforecastAPI: any;
  addtoforecastAPI: any;
  baseURL: any;
  clusterURL: any;
  createSchedule: any;
  scheduleTableData: any;
  forecastiframe: any;
  correlationIframeurl: any;
  deleteScheduleAPI: any;
  onloadcompletedTrainig: any;
  updateStatusScheduleAPI: any;
  editScheduleAPI: any;
  getAnomalyAPI: any;
  kibanaDashboardURLDate: any;
  kibanaURLtailingStartDate: any;
  websocketdummyurl: any;
  kibanaURLTailingEndDate: any;
  grafanaDashboardURLTime: any;
  kibanaDashboardURLTime: any;
  kibanaURLtailingStartTime: any;
  kibanaURLTailingEndTime: any;
  schedularApiStatus: boolean;
  anomalyApiStatus: boolean;
  badCallsApi: any = '';
  urlTimezoneEnding: any = '';
  urlMid: any = '';
  refreshInterval: any;
  statusDataCall: any = '';
  showhideResults: any = '';
  deleteSelecteddata: any = '';
  executeSelecteddata: any = '';
  kibanaStatusURLTime: any = '';
  websocketUrl: any = '';
  tsModelConfig: any = '';
  forecastModelConfig: any = '';
  tsModelConfigModelI: any = '';
  tsModelConfigModel2: any = '';
  currentRunningModel: any = '';
  webSocketConnStatus = false;
  activeTrainingData: any = [];
  completedTrainingArr: any = [];
  activeTrainingNamesArr: any = [];
  stopRunningModel: any = '';
  corrAllDbApi: any = '';
  corrAllFeaturesApi: any = '';
  processMatrixApi: any = '';
  grafanaUrl: any = '';
  getAllUrlsApi: any = '';
  correlationMatrix: any;

  constructor(private http: HttpClient, public dialog: MatDialog ) {
  }
  getAllUrls() {
        return this.http.get(this.baseURL + this.getAllUrlsApi).map((res: Response) => res.json());
    }
    getUrls() {
          this.getAllUrls().subscribe((data: any) => {
              if (data.status === 'true') {
                this.websocketdummyurl = data.socket + '/info?t=' + (new Date()).getTime();
                this.websocketUrl = data.socket;
                this.grafanaUrl = data.grafana;
                this.correlationIframeurl = data.correlationiframeurl;
                this.grafanaDashboardURLTime = this.grafanaUrl;
                this.forecastiframe = data.forecasturl;
                this.getDumywebsocketurl();
              }
          }
      ); }
      getDummysocketurl() {
        return this.http.get(this.websocketdummyurl).map((res: Response) => res.json());
      }

      getDumywebsocketurl() {
        this.getDummysocketurl().subscribe(data => {
        });
      }


     // open display dialog popup for Validation and other user permissions
      opendisplayModal(msg, buttonText, headerText, showCancel?) {

        const dialogRef = this.dialog.open(DisplaypopupComponent, {
          width: '600px',
          disableClose : true,
          data: { message: msg, buttonText, header: headerText , dispCancel: showCancel}
        });


        return dialogRef.afterClosed().pipe(map(result => {
          return result;
        }));
      }



}
