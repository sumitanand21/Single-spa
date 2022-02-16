import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AnomalyService } from '../../services/anomaly.service';
import { NameValidator } from 'src/app/libs/name.validator';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-upsert-tasks',
  templateUrl: './upsert-tasks.component.html',
  styleUrls: ['./upsert-tasks.component.scss']
})
export class UpsertTasksComponent implements OnInit {
  isDayEnabled = false;
  isEndDateEnabled = false;
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  changeonetime: any;
  startScDate;
  minStartScDate;
  endScDate;
  masterDataLoader = false;
  modelMasterData = [];
  title = 'New Task';
  isActionStarted = false;
  jobTypeArr = ['ANOMALYTRAINING1', 'ANOMALYTRAINING2', 'ASCTRAINING'];
  dataRangeList = [
    'minutes',
    'hours',
    'days',
    'months',
    'years'
  ];
  selectedDataRange = 0;
  modelConfigList = [];
  freqList = ['ONETIME', 'DAILY', 'WEEKLY', 'MONTHLY'];
  dataSetList = [];
  upsertTask = new FormGroup({
    id: new FormControl(),
    schedule_name: new FormControl(),
    jobType: new FormControl(),
    dataSetName: new FormControl(),
    modelConfigName: new FormControl(),
    recur_on: new FormControl(),
    scStart: new FormControl(),
    scStartHours: new FormControl(),
    scStartMinutes: new FormControl(),
    scEnd: new FormControl(),
    afterOcc: new FormControl(),
    dataRange: new FormControl(),
    frequency: new FormControl(),
    daySu: new FormControl(),
    dayMo: new FormControl(),
    dayTu: new FormControl(),
    dayWe: new FormControl(),
    dayTh: new FormControl(),
    dayFr: new FormControl(),
    daySa: new FormControl(),
    anyDaySelected: new FormControl(),
    job_status: new FormControl(),
    // job_type: new FormControl()

  });
  minStartMin = 0;
  minStartHr = 0;
  minScMin = 0;
  minScHr = 0;
  endDateFlag = '1';
  constructor(
    private dialogRef: MatDialogRef<UpsertTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private notify: NotificationService,
    public anomalyService: AnomalyService,
    private global: GlobalService
  ) {

  }


  ngOnInit() {
    if (this.data.action === 'Update') {
      this.title = 'Edit Schedule';
    } else {
      this.title = 'New Task';
    }
    this.loadMaster();
  }
  setPageData() {
    if (this.data.action === 'Update') {
      this.title = 'Edit Schedule';
      this.initializeForm(this.data.task);
    } else {
      this.title = 'New Task';
      this.createForm();
    }
  }

  onJobTypeChange(selectedJobType) {
    this.upsertTask.controls.dataSetName.setValue('');
    this.upsertTask.controls.modelConfigName.setValue('');
    this.dataSetList = [];
    this.modelConfigList = [];
    const JobType = { jobType: selectedJobType };
    this.anomalyService.getAnomalyDataSets(JobType).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.dataSetList = res.data && res.data.data ? res.data.data : [];
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured while fetching dataSetName');
      }
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured while fetching dataSetName');
    });
  }

  onDataSetChange(selectedDataSet) {
    this.upsertTask.controls.modelConfigName.setValue('');
    this.modelConfigList = [];
    this.modelChange('', selectedDataSet);
  }

  modelChange(jobtype, dataset) {
    if (!jobtype) {
      jobtype = this.upsertTask.controls.jobType.value;
    }
    if (!dataset) {
      dataset = this.upsertTask.controls.dataSetName.value;
    }
    this.modelConfigList = [];
    const models = this.modelMasterData.filter((model) => model.jobType === jobtype && model.dataSetName === dataset);
    this.modelConfigList = models && models.length ? models.map(it => it.modelConfigName) : [];
    // if (models && models.length) {
    //   models.forEach(element => {
    //     console.log('data::', element.modelConfigName);
    //     this.modelConfigList.push(element.modelConfigName);
    //   });
    //   this.upsertTask.controls.modelConfigName.setValue(this.modelConfigList[0]);
    // }
  }


  loadMaster() {
    this.modelMasterData = [];
    this.masterDataLoader = true;
    const selectedJobType = this.data.task && this.data.task.job_type ? this.data.task.job_type : this.jobTypeArr[0];
    let selectedDataSet = this.data.task && this.data.task.data &&
      this.data.task.data.dataSetName ? this.data.task.data.dataSetName : '';
    const JobType = { jobType: selectedJobType };
    console.log('JobType::', JobType);
    this.anomalyService.loadMasterDataForTask(JobType).subscribe((res: any) => {
      this.masterDataLoader = false;
      if (res[0] && res[0].status === 'success') {
        this.modelMasterData = res[0].data;
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.masterDataLoader = false;
      }
      if (res[1] && res[1].status === 'success') {
        this.dataSetList = res[1].data && res[1].data.data ? res[1].data.data : [];
        selectedDataSet = selectedDataSet ? selectedDataSet : this.dataSetList[0];
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.masterDataLoader = false;
      }
      this.modelChange(selectedJobType, selectedDataSet);
      this.setPageData();
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
      this.masterDataLoader = false;
    });
  }
  getUtcDateTime(dateObject) {
    const UTCdate = dateObject.getUTCDate();
    const UTCFullYear = dateObject.getUTCFullYear();
    const UTCMonth = dateObject.getUTCMonth() + 1;
    const UTCHours = dateObject.getUTCHours();
    const UTCMinutes = dateObject.getUTCMinutes();
    const UTCSeconds = dateObject.getUTCSeconds();
    let changedMonth;
    let changedDay;
    let changedHours;
    let changedMinutes;
    let changedSeconds;
    if (UTCMinutes < 10) {
      changedMinutes = '0' + UTCMinutes;
    } else {
      changedMinutes = UTCMinutes;
    }
    if (UTCSeconds < 10) {
      changedSeconds = '0' + UTCSeconds;
    } else {
      changedSeconds = UTCSeconds;
    }

    if (UTCMonth < 10) {
      changedMonth = '0' + UTCMonth;
    } else {
      changedMonth = UTCMonth;
    }

    if (UTCdate < 10) {
      changedDay = '0' + UTCdate;
    } else {
      changedDay = UTCdate;
    }

    if (UTCHours < 10) {
      changedHours = '0' + UTCHours;
    } else {
      changedHours = UTCHours;
    }

    const clock = UTCFullYear + '-' + changedMonth +
      '-' + changedDay;

    return clock;
  }
  createForm() {
    // const tempDate = new Date();
    const latestDate = this.getUtcDateTime(new Date());

    const today = new Date();
    const dd = today.getUTCDate();
    const mm = today.getUTCMonth() + 1;
    const yyyy = today.getUTCFullYear();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    const sec = today.getUTCSeconds();
    let hr;
    let mn;
    if (hours < 10 && hours.toString().length < 2) {
      hr = '0' + hours;
    } else {
      hr = hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      mn = '0' + minutes;
    } else {
      mn = minutes;
    }
    this.minStartHr = hr;
    this.minScHr = hours;
    this.minStartMin = mn;
    this.minScMin = minutes;
    // const latestDate = this.datepipe.transform(tempDate, 'yyyy-MM-dd');
    this.upsertTask = this.formBuilder.group({
      id: '',
      schedule_name: ['', [Validators.required, NameValidator.cannotContainSpace]],
      jobType: [this.jobTypeArr[0], Validators.required],
      dataSetName: [this.dataSetList[0], Validators.required],
      modelConfigName: [this.modelConfigList[0], Validators.required],
      recur_on: [this.freqList[0], Validators.required],
      scStart: [false, Validators.required],
      scStartHours: [hr, Validators.required],
      scStartMinutes: [mn, Validators.required],
      scEnd: [''],
      afterOcc: ['1'],
      dataRange: ['01', Validators.required],
      frequency: ['hours', Validators.required],
      daySu: false,
      dayMo: false,
      dayTu: false,
      dayWe: false,
      dayTh: false,
      dayFr: false,
      daySa: false,
      anyDaySelected: [false, Validators.required],
      job_status: 'ACTIVE',
      // job_type: 'TRAINING'
    });
    this.endDateFlag = '2';
    this.startScDate = latestDate;
    this.minStartScDate = latestDate;
    this.endScDate = this.startScDate;
    this.setDayControls();
    this.setFreqData(this.freqList[0]);
  }
  initializeForm(task) {
    const latestDate = this.getUtcDateTime(new Date());

    const today = new Date();
    const dd = today.getUTCDate();
    const mm = today.getUTCMonth() + 1;
    const yyyy = today.getUTCFullYear();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    const sec = today.getUTCSeconds();
    let hr;
    let mn;
    if (hours < 10 && hours.toString().length < 2) {
      hr = '0' + hours;
    } else {
      hr = hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      mn = '0' + minutes;
    } else {
      mn = minutes;
    }
    this.minStartHr = hr;
    this.minScHr = hours;
    this.minStartMin = mn;
    this.minScMin = minutes;
    console.log('task....', task);
    this.upsertTask.controls.id.setValue(task.id);
    this.upsertTask.controls.job_status.setValue(task.job_status);
    // this.upsertTask.controls.job_type.setValue(task.data.job_type);
    this.upsertTask.controls.schedule_name.setValue(task.schedule_name);
    this.upsertTask.controls.jobType.setValue(task.job_type);
    this.upsertTask.controls.dataSetName.setValue(task.data.dataSetName);
    this.upsertTask.controls.modelConfigName.setValue(task.data.modelConfigName);
    this.upsertTask.controls.recur_on.setValue(task.recur_on);
    this.upsertTask.controls.scStart.setValue(true);
    this.startScDate = task.schedule_from.split(' ')[0];
    this.upsertTask.controls.scStartHours.setValue(task.schedule_from.split(' ')[1].split(':')[0]);
    this.upsertTask.controls.scStartMinutes.setValue(task.schedule_from.split(' ')[1].split(':')[1]);

    // this.upsertTask.controls.afterOcc.setValue(task.data.afterOcc);
    this.upsertTask.controls.dataRange.setValue(task.data.dataRange);
    this.upsertTask.controls.frequency.setValue(task.data.frequency);
    this.isDayEnabled = task.recur_on.toLowerCase() === 'weekly';
    if (task.schedule_to !== '' && task.schedule_to !== null) {
      this.endDateFlag = '2';
      this.upsertTask.controls.scEnd.setValue(true);
      this.endScDate = task.schedule_to.split(' ')[0];
    }
    if (task.schedule_day && task.schedule_day !== null) {
      const days = task.schedule_day.split(',');
      this.upsertTask.controls.daySu.setValue(false);
      this.upsertTask.controls.dayMo.setValue(false);
      this.upsertTask.controls.dayTu.setValue(false);
      this.upsertTask.controls.dayWe.setValue(false);
      this.upsertTask.controls.dayTh.setValue(false);
      this.upsertTask.controls.dayFr.setValue(false);
      this.upsertTask.controls.daySa.setValue(false);
      days.forEach(element => {
        if (element === 'SUN') {
          this.upsertTask.controls.daySu.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'MON') {
          this.upsertTask.controls.dayMo.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'TUE') {
          this.upsertTask.controls.dayTu.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'WED') {
          this.upsertTask.controls.dayWe.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'THU') {
          this.upsertTask.controls.dayTh.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'FRI') {
          this.upsertTask.controls.dayFr.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        } else if (element === 'SAT') {
          this.upsertTask.controls.daySa.setValue(true);
          this.upsertTask.controls.anyDaySelected.setValue(true);
        }

      });
    }
    this.minStartScDate = latestDate;
    this.setOccurrence();
    this.setFreqData(task.recur_on, true);
  }
  setFreqData(value, editTask?) {
    const val = value.toLowerCase();
    if (val === 'onetime') {
      this.isDayEnabled = false;
      this.isEndDateEnabled = false;
      this.changeonetime = 'bluronetime';
      if (this.endDateFlag !== '1') {
        this.upsertTask.controls.scEnd.disable();
        this.upsertTask.controls.afterOcc.disable();
      } else {
        if (!editTask) {
          this.endScDate = this.startScDate;
        }
        this.upsertTask.controls.scEnd.enable();
        this.upsertTask.controls.afterOcc.enable();
      }
    } else if (val === 'daily') {
      this.isDayEnabled = false;
      this.isEndDateEnabled = true;
      if (!editTask) {
        this.endScDate = this.startScDate;
      }
      this.upsertTask.controls.scEnd.enable();
      this.upsertTask.controls.afterOcc.enable();
      this.changeonetime = '';
    } else if (val === 'weekly') {
      this.isDayEnabled = true;
      this.isEndDateEnabled = true;
      if (!editTask) {
        this.endScDate = this.startScDate;
      }
      this.upsertTask.controls.scEnd.enable();
      this.upsertTask.controls.afterOcc.enable();
      this.changeonetime = '';
    } else if (val === 'monthly') {
      this.isDayEnabled = false;
      this.isEndDateEnabled = true;
      if (!editTask) {
        this.endScDate = this.startScDate;
      }
      this.upsertTask.controls.scEnd.enable();
      this.upsertTask.controls.afterOcc.enable();
      this.changeonetime = '';
    }
    this.setDayControls();
    if (!editTask) {
      this.upsertTask.controls.afterOcc.setValue(1);
      const rcF: any = this.upsertTask.controls.afterOcc.value;
      this.setEndDateBy(rcF);
    }
  }
  setDayControls() {
    if (this.isDayEnabled) {
      this.upsertTask.controls.daySu.enable();
      this.upsertTask.controls.dayMo.enable();
      this.upsertTask.controls.dayTu.enable();
      this.upsertTask.controls.dayWe.enable();
      this.upsertTask.controls.dayTh.enable();
      this.upsertTask.controls.dayFr.enable();
      this.upsertTask.controls.daySa.enable();
    } else {
      this.upsertTask.controls.daySu.disable();
      this.upsertTask.controls.dayMo.disable();
      this.upsertTask.controls.dayTu.disable();
      this.upsertTask.controls.dayWe.disable();
      this.upsertTask.controls.dayTh.disable();
      this.upsertTask.controls.dayFr.disable();
      this.upsertTask.controls.daySa.disable();
    }
  }
  checkState(event, el) {
    event.preventDefault();
    if (this.isEndDateEnabled) {
      if (this.endDateFlag && this.endDateFlag === el.value) {
        // el.checked = false;
        // this.endDateFlag = null;
      } else {
        this.endDateFlag = el.value;
        el.checked = true;
      }
      if (this.endDateFlag === '1') {
        this.upsertTask.controls.scEnd.disable();
        this.upsertTask.controls.afterOcc.disable();
      } else {
        this.upsertTask.controls.scEnd.enable();
        this.upsertTask.controls.afterOcc.enable();
      }
      const rcF: any = this.upsertTask.controls.afterOcc.value;
      this.setEndDateBy(rcF);
    }
  }
  upsertSc() {
    const currenttdate = new Date();
    const currentminutes = currenttdate.getUTCMinutes();
    const currenthours = currenttdate.getUTCHours();
    let updatedminutes;
    let updatedhours;
    if (currenthours < 10 && currenthours.toString().length < 2) {
      updatedhours = '0' + currenthours;
    } else {
      updatedhours = currenthours;
    }

    if (currentminutes < 10 && currentminutes.toString().length < 2) {
      updatedminutes = '0' + currentminutes;
    } else {
      updatedminutes = currentminutes;
    }
    const latestDate = this.getUtcDateTime(new Date());
    const dateValue = new Date();
    dateValue.setHours(0, 0, 0, 0);
    if (!this.leastOneAlpha.test(this.upsertTask.value.schedule_name)) {
      this.global.opendisplayModal('Task Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (this.upsertTask.value.dataRange > 59) {
      this.global.opendisplayModal('Data Range should be less than 59', 'OK', 'Alert');
    } else if ((+this.upsertTask.controls.scStartMinutes.value) < updatedminutes &&
      moment(this.startScDate).format('YYYY-MM-DD') === latestDate) {
      this.global.opendisplayModal('Schedule Minutes is less than UTC Minutes', 'OK', 'Alert');
    } else if ((+this.upsertTask.controls.scStartHours.value) < updatedhours &&
      moment(this.startScDate).format('YYYY-MM-DD') === latestDate) {
      this.global.opendisplayModal('Schedule Hour is less than UTC Hours', 'OK', 'Alert');
    } else if (new Date(moment(this.startScDate).format('YYYY-MM-DD')).getTime() < new Date(this.minStartScDate).getTime()) {
      this.global.opendisplayModal('Schedule Start Date is less than UTC Date', 'OK', 'Alert');
    } else {
      if (this.upsertTask.invalid) {
        if (this.upsertTask.controls.schedule_name.errors && this.upsertTask.controls.schedule_name.errors.cannotContainSpace) {
          this.global.opendisplayModal('Schedule Name should not contain space', 'OK', 'Alert');
        } else {
          this.global.opendisplayModal('Please fill all required fields', 'OK', 'Alert');
        }
      } else {
        const upsertFormValue = this.upsertTask.value;
        let days: any = [];
        if (upsertFormValue.recur_on.toLowerCase() === 'weekly') {
          if (upsertFormValue.daySu) {
            days.push('SUN');
          }
          if (upsertFormValue.dayMo) {
            days.push('MON');
          }
          if (upsertFormValue.dayTu) {
            days.push('TUE');
          }
          if (upsertFormValue.dayWe) {
            days.push('WED');
          }
          if (upsertFormValue.dayTh) {
            days.push('THU');
          }
          if (upsertFormValue.dayFr) {
            days.push('FRI');
          }
          if (upsertFormValue.daySa) {
            days.push('SAT');
          }
        }
        days = days.toString();
        if ((upsertFormValue.recur_on.toLowerCase() === 'weekly' && days && days.length && days.length > 0)
          || upsertFormValue.recur_on.toLowerCase() !== 'weekly') {
          let scMinutes;
          let scHours;
          if (upsertFormValue.scStartHours < 10 && upsertFormValue.scStartHours.toString().length < 2) {
            scHours = '0' + upsertFormValue.scStartHours;
          } else {
            scHours = upsertFormValue.scStartHours;
          }
          if (upsertFormValue.scStartMinutes < 10 && upsertFormValue.scStartMinutes.toString().length < 2) {
            scMinutes = '0' + upsertFormValue.scStartMinutes;
          } else {
            scMinutes = upsertFormValue.scStartMinutes;
          }

          const scheduleStart = moment(this.startScDate).format('YYYY-MM-DD') + ' '
            + scHours + ':'
            + scMinutes + ':01 UTC';
          const data = {
            // job_type: upsertFormValue.jobType,
            dataSetName: upsertFormValue.dataSetName,
            modelConfigName: upsertFormValue.modelConfigName,
            dataRange: upsertFormValue.dataRange ? upsertFormValue.dataRange : null,
            frequency: upsertFormValue.frequency ? upsertFormValue.frequency.toLowerCase() : null,
            schedule_from: scheduleStart,
            interval_time: ''
          };
          const endDate =
            this.endDateFlag === '2' ?
              moment(this.endScDate).format('YYYY-MM-DD') + ' ' + scHours +
              ':' + scMinutes + ':01 UTC'
              : '';
          if (this.data.action !== 'Update') {
            const schedule = {
              data,
              job_status: upsertFormValue.job_status,
              job_type: upsertFormValue.jobType,
              recur_on: upsertFormValue.recur_on,
              schedule_day: days,
              schedule_from:
                scheduleStart,
              schedule_name: upsertFormValue.schedule_name,
              schedule_to: endDate,
              interval_time: ''
            };
            this.isActionStarted = true;
            this.anomalyService.createTask(schedule).subscribe((res: any) => {
              this.isActionStarted = false;
              if (res.status === 'success' && res.data.responseType !== 'ERR') {
                this.notify.showToastrSuccess('Success', 'New Task Creation');
                this.dialogRef.close(true);
              } else {
                this.notify.showToastrWarning('Warning', res.data.reponseMessage);
                this.isActionStarted = false;
              }
            }, err => {
              this.isActionStarted = false;
              this.notify.showToastrError('Alert', 'Server error occured');
            });
          } else {
            const schedule = {
              id: upsertFormValue.id ? upsertFormValue.id : '',
              data,
              job_status: upsertFormValue.job_status,
              job_type: upsertFormValue.jobType,
              recur_on: upsertFormValue.recur_on,
              schedule_day: days,
              schedule_from:
                scheduleStart,
              schedule_name: upsertFormValue.schedule_name,
              schedule_to: endDate,
              interval_time: 0
            };
            this.isActionStarted = true;
            this.anomalyService.updateTask(schedule).subscribe((res: any) => {
              console.log('update:res..string', JSON.stringify(res));
              this.isActionStarted = false;
              if (res.status === 'success' && res.data.responseType !== 'ERR') {
                this.notify.showToastrSuccess('Success', 'Task Updation');
                this.dialogRef.close(true);
              } else {
                this.notify.showToastrWarning('Warning', res.data.reponseMessage);
                this.isActionStarted = false;
              }
            }, err => {
              this.isActionStarted = false;
              this.notify.showToastrError('Alert', 'Server error occured');
            });
          }
        } else {
          this.global.opendisplayModal('Please select atleast one weekday', 'OK', 'Alert');
        }

      }
    }
  }
  setOccurrence() {
    if (this.endDateFlag === '1') {
      this.endScDate = this.startScDate;
    }
    const rcFOn: any = this.upsertTask.controls.recur_on.value;
    let oc = 0;
    switch (rcFOn.toLowerCase()) {
      case 'onetime':
        if (this.endDateFlag === '2' && rcFOn.toLowerCase() === 'onetime') {
          this.endScDate = this.startScDate;
        }
        if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate) {
          this.minScMin = this.minStartMin;
          this.minScHr = this.minStartHr;
        } else {
          this.minScMin = 0;
          this.minScHr = 0;
        }
        oc = this.getDifferenceInDays(
          moment(this.startScDate).format('YYYY-MM-DD'),
          moment(this.endScDate).format('YYYY-MM-DD'));
        break;

      case 'daily':
        if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate) {
          this.minScMin = this.minStartMin;
          this.minScHr = this.minStartHr;
        } else {
          this.minScMin = 0;
          this.minScHr = 0;
        }
        oc = this.getDifferenceInDays(
          moment(this.startScDate).format('YYYY-MM-DD'),
          moment(this.endScDate).format('YYYY-MM-DD'));
        break;

      case 'weekly':
        if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate) {
          this.minScMin = this.minStartMin;
          this.minScHr = this.minStartHr;
        } else {
          this.minScMin = 0;
          this.minScHr = 0;
        }
        oc = this.getDifferenceInWeeks(
          moment(this.startScDate).format('YYYY-MM-DD'),
          moment(this.endScDate).format('YYYY-MM-DD'));
        break;

      case 'monthy':
        if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate) {
          this.minScMin = this.minStartMin;
          this.minScHr = this.minStartHr;
        } else {
          this.minScMin = 0;
          this.minScHr = 0;
        }
        oc = this.getDifferenceInMonths(
          moment(this.startScDate).format('YYYY-MM-DD'),
          moment(this.endScDate).format('YYYY-MM-DD'));
        break;

    }
    if (
      moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate
      && (+this.upsertTask.controls.scStartHours.value) < (+this.minStartHr)) {
      this.upsertTask.controls.scStartHours.setValue(this.minStartHr);
    }
    if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate &&
      (+this.upsertTask.controls.scStartHours.value) === (+this.minStartHr) &&
      (+this.upsertTask.controls.scStartMinutes.value) < (+this.minStartMin)) {
      this.upsertTask.controls.scStartMinutes.setValue(this.minStartMin);
    }
    this.upsertTask.controls.afterOcc.setValue(oc + 1);

  }
  setEndDate(count) {
    if (count.currentTarget.value) {
      this.setEndDateBy(count.currentTarget.value);
    }
  }
  setEndDateBy(count) {
    if (count) {
      const rcFOn: any = this.upsertTask.controls.recur_on.value;
      switch (rcFOn.toLowerCase()) {
        case 'onetime':
          this.endScDate = moment(this.startScDate).utc().add(+count, 'days').format('YYYY-MM-DD');
          break;
        case 'daily':
          this.endScDate = moment(this.startScDate).utc().add(+count, 'days').format('YYYY-MM-DD');
          break;
        case 'weekly':
          this.endScDate = moment(this.startScDate).utc().add(+count, 'weeks').format('YYYY-MM-DD');
          break;
        case 'monthly':
          this.endScDate = moment(this.startScDate).utc().add(+count, 'months').format('YYYY-MM-DD');
          break;

      }

    }
    if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate) {
      this.minScMin = this.minStartMin;
      this.minScHr = this.minStartHr;
    } else {
      this.minScMin = 0;
      this.minScHr = 0;
    }
  }
  getDifferenceInDays(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return diffInMs / (1000 * 60 * 60 * 24);
  }
  getDifferenceInWeeks(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    const diffInMs = Math.abs(date2.getTime() - date1.getTime());
    return diffInMs / (1000 * 60 * 60 * 24 * 7);
  }
  getDifferenceInMonths(date1, date2) {
    date1 = new Date(date1);
    date2 = new Date(date2);
    let months;
    months = (date2.getFullYear() - date1.getFullYear()) * 12;
    months -= date1.getMonth();
    months += date2.getMonth();
    return months <= 0 ? 0 : months;
  }
  limitHRInput(event, maxLength) {
    // const tempDate = new Date();
    const latestDate = this.getUtcDateTime(new Date());

    const today = new Date();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    let hr;
    let mn;
    if (hours < 10 && hours.toString().length < 2) {
      hr = '0' + hours;
    } else {
      hr = hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      mn = '0' + minutes;
    } else {
      mn = minutes;
    }
    this.minStartHr = hr;
    this.minStartMin = mn;
    this.minStartScDate = latestDate;
    const value = event.currentTarget.value;
    if (value !== undefined && value.toString().length >= maxLength) {
      event.preventDefault();
    }
    if (value > 23) {
      this.upsertTask.controls.scStartHours.setValue('00');
    }
    if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate && (+value) < (+this.minStartHr)) {
      this.upsertTask.controls.scStartHours.setValue(this.minStartHr);
    }
  }
  limitMNInput(event, maxLength) {
    const latestDate = this.getUtcDateTime(new Date());

    const today = new Date();
    const hours = today.getUTCHours();
    const minutes = today.getUTCMinutes();
    let hr;
    let mn;
    if (hours < 10 && hours.toString().length < 2) {
      hr = '0' + hours;
    } else {
      hr = hours;
    }
    if (minutes < 10 && minutes.toString().length < 2) {
      mn = '0' + minutes;
    } else {
      mn = minutes;
    }
    this.minStartHr = hr;
    this.minStartMin = mn;
    this.minStartScDate = latestDate;
    const value = event.currentTarget.value;
    if (value !== undefined && value.toString().length >= maxLength) {
      event.preventDefault();
    }
    if (value > 59) {
      this.upsertTask.controls.scStartMinutes.setValue('00');
    }
    if (moment(this.startScDate).format('YYYY-MM-DD') === this.minStartScDate &&
      (+this.upsertTask.controls.scStartHours.value) === (+this.minStartHr) &&
      (+value) < (+this.minStartMin)) {
      this.upsertTask.controls.scStartMinutes.setValue(this.minStartMin);
    }
  }
}
