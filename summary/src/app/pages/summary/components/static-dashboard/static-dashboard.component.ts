import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';
import { SummaryService } from '../../services/summary.service';

@Component({
  selector: 'summary-static-dashboard',
  templateUrl: './static-dashboard.component.html',
  styleUrls: ['./static-dashboard.component.scss']
})
export class StaticDashboardComponent implements OnInit {

  chartData1 = [];
  histogramDetails: any;
  rcaObj;

  timeFilterDetails: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    filterFeature: '',
    minToDate: '',
    enableFilter: false
  };
  correlationFromTimePeriod = '';
  correlationToTimePeriod = '';

  selectedDashboard;
  countObj = {
    noOfAlarmStormsOverTime: 0,
    noOfClustersOverTime: 0,
    noOfAlarmsOverTime: 0,
  };

  @ViewChild('clickMenuTrigger', { static: false }) trigger: MatMenuTrigger;
  @ViewChild('menuDateRange', { static: false }) public dateRangeFrm: NgForm;
  constructor(public summaryService: SummaryService,
              public global: GlobalService) {
  }

  ngOnInit() {
    if (this.summaryService.dashboardDetails && Object.keys(this.summaryService.dashboardDetails).length) {
      this.selectedDashboard = { ...this.summaryService.dashboardDetails };
    } else {
      this.selectedDashboard = null;
    }
    this.openTimeEditMenu();
    this.setDateDetails();
  }

  getAllDetails() {
    this.rcaObj = { ...this.selectedDashboard, fromTime: this.correlationFromTimePeriod, toTime: this.correlationToTimePeriod };
    this.setChartData();
    this.setBarChartData();
    this.setCountDetails();
  }


  setCountDetails() {
    const data = {
      dataSetName: this.selectedDashboard && this.selectedDashboard.dataSetName ? this.selectedDashboard.dataSetName : '',
      fromTime: this.toISO(this.correlationFromTimePeriod),
      toTime: this.toISO(this.correlationToTimePeriod)
    };

    this.summaryService.getDashBoardCount(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.countObj.noOfAlarmStormsOverTime = res.data && res.data.noOfAlarmStormsOverTime ? res.data.noOfAlarmStormsOverTime : 0;
        this.countObj.noOfAlarmsOverTime = res.data && res.data.noOfAlarmsOverTime ? res.data.noOfAlarmsOverTime : 0;
        this.countObj.noOfClustersOverTime = res.data && res.data.noOfClustersOverTime ? res.data.noOfClustersOverTime : 0;
      } else {
        this.countObj.noOfAlarmStormsOverTime = 0;
        this.countObj.noOfAlarmsOverTime = 0;
        this.countObj.noOfClustersOverTime = 0;
      }
    }, err => {
      this.countObj.noOfAlarmStormsOverTime = 0;
      this.countObj.noOfAlarmsOverTime = 0;
      this.countObj.noOfClustersOverTime = 0;
    });

  }

  setBarChartData() {
    const data = {
      dataSetName: this.selectedDashboard && this.selectedDashboard.dataSetName ? this.selectedDashboard.dataSetName : '',
      fromTime: this.toISO(this.correlationFromTimePeriod),
      toTime: this.toISO(this.correlationToTimePeriod)
    };
    this.summaryService.getHistogramDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const histogramgrahData = res.data && res.data ? res.data : [];
        this.histogramDetails = { chartArr: [...histogramgrahData], groupType: 'positive' };
      } else {
        this.histogramDetails = null;
      }
    }, err => {
      this.histogramDetails = null;
    });
  }

  setChartData() {
    const data = {
      dataSetName: this.selectedDashboard && this.selectedDashboard.dataSetName ? this.selectedDashboard.dataSetName : '',
      fromTime: this.toISO(this.correlationFromTimePeriod),
      toTime: this.toISO(this.correlationToTimePeriod)
    };
    this.summaryService.getLineChartDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const scatterchartArray = res.data && res.data && res.data.length ? res.data : [];
        this.chartData1 = this.buildChartData('y', scatterchartArray);
      } else {
        this.chartData1 = [];
      }
    }, err => {
      this.chartData1 = [];
    });
  }

  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  buildChartData(columnName, chartArr) {
    let chartData = chartArr.filter(it => it.hasOwnProperty(columnName) && this.checkEmptyVal(it[columnName]));
    chartData = chartData.map(it => Object.assign({ dateVal: it.x ? it.x : '', featureVal: it[columnName] }));
    return [...chartData];
  }

  public checkEmptyVal(val) {
    return val === undefined || val === null || val === '' ? false : true;
  }

  convertDateToUTC(localDate?) {
    localDate = localDate ? localDate : new Date();
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
  }

  openTimeEditMenu() {
    const currentDate = this.convertDateToUTC();
    const prevCurr = this.convertDateToUTC();
    prevCurr.setDate(prevCurr.getDate() - 1);
    // tslint:disable-next-line:max-line-length
    const fromDateObj = this.correlationFromTimePeriod ? this.getTimeFiterVal(this.correlationFromTimePeriod) : this.getTimeFiterVal(prevCurr);
    const toDateObj = this.correlationToTimePeriod ? this.getTimeFiterVal(this.correlationToTimePeriod) : this.getTimeFiterVal(currentDate);
    this.timeFilterDetails.fromDate = fromDateObj ? fromDateObj.dateVal : '';
    this.timeFilterDetails.fromTimeHr = fromDateObj ? fromDateObj.hrs : '';
    this.timeFilterDetails.fromTimeMin = fromDateObj ? fromDateObj.min : '';
    this.timeFilterDetails.toDate = toDateObj ? toDateObj.dateVal : '';
    this.timeFilterDetails.toTimeHr = toDateObj ? toDateObj.hrs : '';
    this.timeFilterDetails.toTimeMin = toDateObj ? toDateObj.min : '';
    this.timeFilterDetails.minToDate = new Date(this.timeFilterDetails.fromDate);
  }

  getTimeFiterVal(StrDate) {
    const dateObj = new Date(StrDate);
    let hrsVal: any = dateObj.getHours().toString();
    let minVal: any = dateObj.getMinutes().toString();
    hrsVal = hrsVal.length === 1 ? ('0' + hrsVal) : hrsVal;
    minVal = minVal.length === 1 ? ('0' + minVal) : minVal;
    return { dateVal: dateObj, hrs: hrsVal, min: minVal };
  }

  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterDetails.toDate && this.timeFilterDetails.fromDate && new Date(this.timeFilterDetails.toDate) < new Date(this.timeFilterDetails.fromDate)) {
      this.timeFilterDetails.toDate = '';
    }
    this.timeFilterDetails.minToDate = this.timeFilterDetails.fromDate ? new Date(this.timeFilterDetails.fromDate) : '';
  }

  someMethod() {
    if (this.trigger) {
      this.trigger.closeMenu();
    }
  }

  setDateDetails() {
    const fromDateInFormat = new Date(this.timeFilterDetails.fromDate);
    const toDateInFormat = new Date(this.timeFilterDetails.toDate);
    // tslint:disable-next-line:max-line-length
    const fromTimeDateCreate = this.getDateString(fromDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin);
    // tslint:disable-next-line:max-line-length
    const toTimeDateCreate = this.getDateString(toDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin);
    if (this.dateRangeFrm && this.dateRangeFrm.invalid) {
      this.global.opendisplayModal('Please provided all the date fields', 'OK', 'Alert');
    } else if (this.valdateTime(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin) === true) {
      this.global.opendisplayModal('From Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else if (this.valdateTime(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin) === true) {
      this.global.opendisplayModal('To Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
    } else {
      this.correlationFromTimePeriod = fromTimeDateCreate;
      this.correlationToTimePeriod = toTimeDateCreate;
      this.someMethod();
      this.getAllDetails();
    }
  }

  getDateString(dateObj) {
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    return (dateMonth + '-' + dateVal + '-' + dateYear);
  }
  getHrsMin(hrs, min) {
    const hrsVal = hrs.length === 1 ? ('0' + hrs) : hrs;
    const MinVal = min.length === 1 ? ('0' + min) : min;
    return (hrsVal + ':' + MinVal);
  }

  valdateTime(hrs, min) {
    if (hrs < 0 || hrs > 24) {
      return true;
    } else if (min < 0 || min > 60) {
      return true;
    } else {
      const totalTime = +(hrs + '' + min);
      return totalTime >= 0 && totalTime <= 2400 ? false : true;
    }
  }



}
