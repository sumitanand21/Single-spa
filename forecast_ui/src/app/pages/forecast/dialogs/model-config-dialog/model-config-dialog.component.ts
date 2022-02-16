import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ForecastService } from '../../services/forecast.service';

@Component({
  selector: 'app-model-config-dialog',
  templateUrl: './model-config-dialog.component.html',
  styleUrls: ['./model-config-dialog.component.scss']
})
export class ModelConfigDialogComponent implements OnInit {

  edictRadio: any;
  saveforecastAPI: any;
  closeforecastEdit: any;
  getCallData: any;
  sample: any;
  input: any;
  Loader = true;
  headers: any;
  forecastData: any[];
  tempforecast: any[];
  tableData: any = [];
  ModelConfigArr: any = [];
  modalEditRef: BsModalRef;
  foretableLength: any = 0;
  forecastDisabled = true;
  editforecastObject: any;
  editforecastName: any;
  threadId: any;
  editSampletime: any;
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
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isLoading = true;

  defaultCurrentPage = 1;
  defauultItempg = 10;
  defaultJobType = 'FORECASTEXECUTION';
  selectedModelObject: any = {};
  tableDetailsErrorMsg = '';
  constructor(
    public dialog: MatDialog,
    public global: GlobalService,
    public forecastService: ForecastService,
    private notify: NotificationService,
    public dialogRef: MatDialogRef<ModelConfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }


  ngOnInit() {
    // this.editforecastObject = this.data.forecastEdit;
    // this.editforecastName = this.editforecastObject.pmId;
    // this.threadId = this.editforecastObject.threadId;
    // this.editSampletime = this.editforecastObject.sampleTime;
    // let datarangesplit = this.editforecastObject.defaultDataRange;
    // if (datarangesplit == null || datarangesplit === undefined) {
    //   datarangesplit = '';
    // }
    // const convertdatarange = datarangesplit.split(',');
    // this.mintime = convertdatarange[0];
    // this.maxtime = convertdatarange[1];
    // this.editid = this.editforecastObject.id;
    // this.editne = this.editforecastObject.ne;
    // this.pmType = this.editforecastObject.pmType;
    // this.podNumber = this.editforecastObject.podNumber;
    // this.jobStatus = this.editforecastObject.jobStatus;
    // const frwdprdata = this.editforecastObject.timeForForwardPrediction;
    // this.editForecastparam = this.editforecastObject.modelParameter;
    // this.frwrdPredict = frwdprdata.toString().replace(/\D/g, '');
    // const replaceString = frwdprdata.toString().replace(/[^a-z]/gi, '');
    // this.editSeconds = true;
    // if (replaceString === 'h') {
    //   this.editHours = true;
    //   this.editDays = false;
    //   this.editSeconds = false;
    //   this.editMinutes = false;
    // } else if (replaceString === 'm') {
    //   this.editMinutes = true;
    //   this.editHours = false;
    //   this.editDays = false;
    //   this.editSeconds = false;
    // } else if (replaceString === 's') {
    //   this.editSeconds = true;
    //   this.editMinutes = false;
    //   this.editHours = false;
    //   this.editDays = false;
    // } else if (replaceString === 'D') {
    //   this.editDays = true;
    //   this.editSeconds = false;
    //   this.editMinutes = false;
    //   this.editHours = false;
    // }

    // this.checkmodelparam();
    this.getModelConfigData(this.data.modelConfigName);
  }
  checkmodelparam() {
    this.editForecastparam = ['Modelparam', 'Param2'];
    // this.getModelConfig().subscribe(data => {
    //   if(data.status != "fail"){
    // this.ModelConfigArr = [];
    // this.ModelConfigArr.push(...data.data);
    this.ModelConfigArr.push(this.editForecastparam);
  }
  //   });
  // }
  returnvalue() {
    this.dialogRef.close({});
  }
  getModelConfigData(modelConfigName) {
    this.isLoading = true;
    if (modelConfigName) {
      this.isLoading = true;
      const data = { jobType: this.defaultJobType, modelConfig: modelConfigName };
      this.forecastService.getModelConfigDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          // res.data.L1 = res.data.l1L2 ? res.data.l1L2.split(',')[0] : '';
          // res.data.L2 = res.data.l1L2 ? res.data.l1L2.split(',')[1] : '';
          this.selectedModelObject = res.data;
          this.tableDetailsErrorMsg = '';
          this.isLoading = false;
        }
      }, err => {
        this.isLoading = false;
        this.tableDetailsErrorMsg = 'Failed in reaching to server';
        this.notify.showToastrError('Alert', 'Server error occured');
        this.returnvalue();
      });
    } else {
      this.notify.showToastrWarning('Warning', 'Invalid model');
      this.returnvalue();
    }
  }

}
