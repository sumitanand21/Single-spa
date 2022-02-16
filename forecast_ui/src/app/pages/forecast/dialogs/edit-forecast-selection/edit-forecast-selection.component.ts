import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ForecastService } from '../../services/forecast.service';

@Component({
  selector: 'app-edit-forecast-selection',
  templateUrl: './edit-forecast-selection.component.html',
  styleUrls: ['./edit-forecast-selection.component.scss']
})
export class EditForecastSelectionComponent implements OnInit {
  edictRadio = 'SECONDS';
  // saveforecastAPI:any;
  closeforecastEdit: any;
  sample: any;
  input: any;
  headers: any;
  forecastData: any[];
  tempforecast: any[];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  editforecastObject: any;
  editforecastName: any;
  threadId: any;
  editDataFrequency: any;
  mintime: any;
  maxtime: any;
  editid: any;
  editne: any;
  pmType: any;
  podNumber: any;
  jobStatus: any;
  editForecastparam: any;
  frwrdPredict: any;
  editSeconds: any;
  editMinutes: any;
  editHours: any;
  editDays: any;
  all: any;
  key = 'name';
  selectedDataId = '';
  reverse = false;
  p = 1;
  private pageSize = 10;
  constructor(
    public global: GlobalService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditForecastSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notify: NotificationService,
    public forecastService: ForecastService) { }

  ngOnInit() {
    this.editforecastObject = this.data.forecastEdit;
    this.editforecastName = this.editforecastObject.dataId;
    this.threadId = this.editforecastObject.threadId;
    this.editDataFrequency = this.editforecastObject.dataFrequency;
    let datarangesplit = this.editforecastObject.defaultDataRange;
    if (datarangesplit == null || datarangesplit === undefined) {
      datarangesplit = '';
    }
    const convertdatarange = datarangesplit.split(',');
    this.mintime = convertdatarange[0];
    this.maxtime = convertdatarange[1];
    this.editid = this.editforecastObject.id;
    this.editne = this.editforecastObject.ne;
    this.pmType = this.editforecastObject.pmType;
    this.podNumber = this.editforecastObject.podNumber;
    this.jobStatus = this.editforecastObject.jobStatus;
    const frwdprdata = this.editforecastObject.timeForForwardPrediction;
    this.editForecastparam = this.editforecastObject.modelConfigName;
    this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
    const replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
    this.editSeconds = true;
    this.checkmodelparam();

  }

  saveforecastAPI() {
    const Mintimeval = Number(this.mintime);
    const Maxtimeval = Number(this.maxtime);
    if (!this.editDataFrequency || this.mintime === null || this.mintime === undefined || this.mintime === '' ||
      this.maxtime === null || this.maxtime === undefined || this.maxtime === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.editDataFrequency < 1) {
      this.global.opendisplayModal('Data Frequency should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.maxtime > 4294967295) {
      this.global.opendisplayModal('Max Time cant be greater than 4294967295', 'OK', 'Alert');
    } else if (Maxtimeval < Mintimeval) {
      this.global.opendisplayModal('Min Time cant be greater than Max Time', 'OK', 'Alert');
    } else {
      const minTimeedit = this.mintime + ',' + this.maxtime;
      const data = {
        dataId: this.editforecastName,
        dataFrequency: +this.editDataFrequency,
        ne: this.editne,
        pmType: this.editforecastObject.pmType,
        defaultDataRange: minTimeedit,
        timeForForwardPrediction: this.frwrdPredict,
        modelConfigName: this.editForecastparam,
        jobStatus: this.editforecastObject.jobStatus,
        dataSetName: this.editforecastObject.dataSetName,
        uid : this.editforecastObject.uid
      };
      this.forecastService.ForecastSelectionUpdatetable(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.notify.showToastrSuccess('Success', 'ForecastData Updated successfully.');
          this.returnvalue(data);
        } else {
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.dialogRef.close();
        }
      }, err => {
        this.notify.showToastrError('Alert', 'Server error occured');
        this.dialogRef.close();
      });
    }
  }
  returnvalue(updatedData?) {
    this.dialogRef.close(updatedData);
  }
  checkmodelparam() {
    const data = { jobType: 'FORECAST' };
    this.forecastService.getAllModelConfigs(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.ModelConfigArr = res.data && res.data.length > 0 ? res.data.map(it => it.modelConfigName) : [];
      } else {
        this.ModelConfigArr = [];
      }
    }, (error) => {
      this.ModelConfigArr = [];
    });
  }
}
