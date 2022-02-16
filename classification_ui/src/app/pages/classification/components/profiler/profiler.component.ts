import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ClassificationService } from '../../services/classification.service';
import * as moment from 'moment';
import { SUBSCRIPTIONS } from 'src/app/constants/app.constants';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-profiler',
  templateUrl: './profiler.component.html',
  styleUrls: ['./profiler.component.scss']
})
export class ProfilerComponent implements OnInit, OnDestroy {
  allClassificationDetails;
  isLoading = false;
  setDisable = false;
  headerData: any = {};
  profilerResult = '';
  profilerStatus = '';
  socket;
  disableSelectButton = false;
  constructor(
    public global: GlobalService,
    private classificationService: ClassificationService,
    private appScheduler: AppSchedulerService,
    private notify: NotificationService,
    private router: Router) { }

  ngOnInit() {
    if (this.classificationService.classificationDetails && this.classificationService.classificationDetails.hasOwnProperty('details')) {
      this.allClassificationDetails = this.classificationService.classificationDetails.details;
    } else {
      this.router.navigate(['/' + this.global.prefixUrl + '/classification/profilerupsertfeature']);
    }
  }
  getProfilerTableData() {
    this.appScheduler.disconnectSocket();
    this.isLoading = true;
    this.profilerResult = '';
    this.setDisable = true;
    const userData = {
      dataSetName: this.headerData.selectedDataSet,
      labelName: this.handleEmptyVal(this.headerData.selectedLabel),
      fromTime: this.headerData.timeFilterFrom && this.headerData.timeFilterFrom !== 'None' ?
        this.toISO(this.headerData.timeFilterFrom) : '',
      toTime: this.headerData.timeFilterTo && this.headerData.timeFilterTo !== 'None' ? this.toISO(this.headerData.timeFilterTo) : ''
    };
    this.classificationService.getProfilerTableData(userData).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success') {
        this.profilerResult = '';
        if (res.data && res.data.length && res.data.length > 0
          && res.data[0].targetResponse && res.data[0].targetResponse !== 'No data available' &&
          res.data[0].targetResponse !== 'no data available for selected dataSetName and time range') {
          this.profilerResult = res.data[0].targetResponse;
        } else if (res.data && res.data.length && res.data.length > 0
          && res.data[0].targetResponse && res.data[0].targetResponse === 'No data available' &&
          res.data[0].targetResponse === 'no data available for selected dataSetName and time range') {
          this.notify.showToastrWarning('Warning', res.data[0].targetResponse);
        }
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.isLoading = false;
      }
      this.setDisable = false;
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
      this.isLoading = false;
      this.setDisable = false;

    });
  }
  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  handleEmptyVal(val) {
    return val ? val : 'None';
  }
  provideInputsToMap(evt: any) {
    this.profilerStatus = '';
    this.headerData = evt;
    this.profilerResult = '';
    if (evt.action === 'runcorr') {
      // this.classificationService.classificationDetails = evt;
      if (evt.timeFilterFrom) {
        evt.timeFilterFrom = evt.timeFilterFrom + ':01';
      }
      if (evt.timeFilterTo) {
        evt.timeFilterTo = evt.timeFilterTo + ':01';
      }
      const data = {
        dataSetName: evt.selectedDataSet ? evt.selectedDataSet : '',
        fromTime: evt.timeFilterFrom ? this.toISO(evt.timeFilterFrom) : '',
        groupName: evt.selectedFeaturegroup ? evt.selectedFeaturegroup : '',
        hyperparameterConfig: null,
        hyperparameterFlag: true,
        jobStatus: 'ACTIVE',
        jobType: 'CLASSIFICATION',
        modelType: 'PROFILER',
        indexName: 'basic_profiler*',
        label: evt.selectedLabel ? evt.selectedLabel : '',
        timeFilterFeature: evt.timeFilterValue ? evt.timeFilterValue : '',
        toTime: evt.timeFilterTo ? this.toISO(evt.timeFilterTo) : '',
        modelConfigName: '',
        modelFromTime: '',
        modelName: '',
        modelToTime: '',
      };
      this.isLoading = true;
      this.classificationService.scheduleProfiler(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.isLoading = false;
          if (res.data) {
            this.classificationService.scheduleRes = res.data;
            if (res.data.response) {
              if (res.data.targetResponse) {
                res.data.targetResponse = JSON.parse(res.data.targetResponse);
                if (res.data && res.data.targetResponse && res.data.targetResponse.length && res.data.targetResponse.length > 0 &&
                  res.data.targetResponse[0].targetResponse !== 'no data available for selected dataSetName and time range' &&
                  res.data.targetResponse[0].targetResponse !== 'no data available') {
                  this.profilerResult = res.data.targetResponse[0].targetResponse;
                } else if (res.data && res.data.targetResponse && res.data.targetResponse.length && res.data.targetResponse.length > 0 &&
                  res.data.targetResponse[0].targetResponse === 'no data available for selected dataSetName and time range' &&
                  res.data.targetResponse[0].targetResponse === 'no data available') {
                  this.notify.showToastrWarning('Warning', res.data.targetResponse[0].targetResponse);
                }
              }
            } else {
              this.profilerStatus = res.data.targetResponse;
              this.scheduleSoc('5s');
            }
          }
          this.notify.showToastrSuccess('Success', 'Classification scheduled');
          this.router.navigate(['/' + this.global.prefixUrl + '/classification/profiler']);
        } else {
          this.notify.showToastrWarning('Failed', 'Classification schedule');
          this.isLoading = false;
        }
      }, (error) => {
        this.isLoading = false;
        this.notify.showToastrError('Error', 'Classification schedule');
      });
    } else if (evt.action === 'oninput') {
      if (this.classificationService.scheduleRes && this.classificationService.scheduleRes.response) {
        this.classificationService.scheduleRes.targetResponse = JSON.parse(this.classificationService.scheduleRes.targetResponse);
        if (this.classificationService.scheduleRes
          && this.classificationService.scheduleRes.targetResponse &&
          this.classificationService.scheduleRes.targetResponse.length &&
          this.classificationService.scheduleRes.targetResponse.length > 0 &&
          this.classificationService.scheduleRes.targetResponse[0].targetResponse !==
          'no data available for selected dataSetName and time range'
          &&
          this.classificationService.scheduleRes.targetResponse[0].targetResponse !== 'no data available') {
          this.profilerResult = this.classificationService.scheduleRes.targetResponse[0].targetResponse;
        } else if (this.classificationService.scheduleRes
          && this.classificationService.scheduleRes.targetResponse &&
          this.classificationService.scheduleRes.targetResponse.length &&
          this.classificationService.scheduleRes.targetResponse.length > 0 &&
          this.classificationService.scheduleRes.targetResponse[0].targetResponse ===
          'no data available for selected dataSetName and time range' &&
          this.classificationService.scheduleRes.targetResponse[0].targetResponse === 'no data available') {
            this.notify.showToastrWarning('Warning', this.classificationService.scheduleRes.targetResponse[0].targetResponse);
          }
        } else {
        this.scheduleSoc('5s');
      }
    }
  }
  scheduleSoc(value) {
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.profilerStatus = 'Scheduled';
      this.socket.connect({}, () => {
        if (this.classificationService.scheduleRes && this.classificationService.scheduleRes.uid) {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.PROFILER_RESULT_UID, this.classificationService.scheduleRes.uid),
            message => {
              const payload = JSON.parse(message.body);
              if (payload && payload.length && payload.length > 0) {
                if (payload[0].hasOwnProperty('status')) {
                  this.profilerStatus = payload[0].status;
                  if (payload[0].status.toLowerCase() === 'completed') {
                    that.getProfilerTableData();
                  }
                } else if (payload[0].hasOwnProperty('message')) {
                  // this.profilerResult = payload;
                  // this.notify.showToastrSuccess('Profiler', payload[0].message);
                }
              }
            });
        }
        // this.socket.onConnect(x => {
        //   that.disableSelectButton = true;
        // });
        // this.socket.onDisconnect(x => {
        //   that.disableSelectButton = false;
        // });
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  ngOnDestroy() {
    this.appScheduler.disconnectSocket();
  }
}
