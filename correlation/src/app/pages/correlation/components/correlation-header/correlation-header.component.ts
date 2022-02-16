import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { MatSliderChange, MatMenuTrigger } from '@angular/material';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { CorrelationService } from '../../services/correlation.service';

@Component({
  selector: 'app-correlation-header',
  templateUrl: './correlation-header.component.html',
  styleUrls: ['./correlation-header.component.scss']
})
export class CorrelationHeaderComponent implements OnInit {
  @ViewChild('menuDateRange', { static: true }) public menuDateRangeFrm: NgForm;
  @Input() disableAll = false;
  @Input() activeView = '';
  @Input()
  set allDetails(value: any) {
    if (value) {
      this.setAllInputDetails(value);
    }
  }
  @Output() emitOut = new EventEmitter<any>();
  @ViewChild('clickMenuTrigger', { static: true }) trigger: MatMenuTrigger;
  chartType = 'bubble';
  groupType = false;
  showChart = true;
  tickIntervalVal = 1;
  dataSetValue = '';
  indexName = '';
  featureGroupValue = '';
  timeFilterValue = '';
  timeFilterDD = [];
  selectedFeature = [];
  enableFilterFeature = false;
  correlationFromTimePeriod = '';
  correlationToTimePeriod = '';
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
  selectedCategory = 'continuous';
  categories: any = [
    { name: 'Continuous VS Continuous', id: 'continuous' },
    { name: 'Continuous VS Categorical', id: 'continuous_categorical' },
    { name: 'Categorical VS Categorical', id: 'categorical' }
  ];
  // tslint:disable-next-line:jsdoc-format
  /** slider **/
  autoTicks = false;
  invert = true;
  negativeinvert = false;
  negativemax = 0;
  negativemin = -1;
  max = 1;
  min = 0;
  showTicks = false;
  step = 0.01;
  thumbLabel = false;
  positiveValue = 0;
  negativeValue = 0;
  sliderPosVal = 0;
  sliderNegVal = 0;
  vertical = false;
  valueSubject = new BehaviorSubject<any>(null);
  bufferNegative = 0;
  buffPositive = 0;
  // tslint:disable-next-line:jsdoc-format
  /** end of slider vars **/
  constructor(private router: Router, public global: GlobalService, public correlationService: CorrelationService) { }

  ngOnInit() {
    this.correlationService.disableSlider = false;
    this.valueSubject.pipe(debounceTime(1000)).subscribe(value => {
      if (value) {
        this.correlationService.disableSlider = this.activeView === 'Tableview' || this.activeView === 'CorrelatedGroups' ? true : false;
        this.provideParamsToMap(value);
      }

      // http request can go here
    });
    // send the header data to respective maps on load of correlation header
  }

  setAllInputDetails(inputDetails) {
    this.sliderNegVal = this.activeView === 'CorrelatedGroups' && this.groupType ? -1 : 0;
    this.negativeValue = this.sliderNegVal;
    this.sliderPosVal = this.activeView === 'CorrelatedGroups' && !this.groupType ? 1 : 0;
    this.positiveValue = this.sliderPosVal;
    this.dataSetValue = inputDetails.selectedDataSet;
    this.indexName = inputDetails.selectedIndexName;
    this.featureGroupValue = inputDetails.selectedFeaturegroup;
    this.timeFilterValue = inputDetails.selectedTimeFilterFeature;
    this.enableFilterFeature = inputDetails.enableTimeFilter;
    this.timeFilterDD = inputDetails.timeFilterFeature;
    this.selectedFeature = inputDetails.selectedFeatureList;
    this.correlationFromTimePeriod = inputDetails.from_Time;
    this.correlationToTimePeriod = inputDetails.to_Time;
    this.provideParamsToMap('oninput');
  }

  showGraph(value) {
    this.showChart = value;
    this.provideParamsToMap('showchart');
  }

  showGraphType(val) {
    this.chartType = val;
    this.provideParamsToMap('charttype');
  }

  OnRadioChange(groupType) {
    this.sliderNegVal = this.activeView === 'CorrelatedGroups' && this.groupType ? -1 : 0;
    this.negativeValue = this.sliderNegVal;
    this.sliderPosVal = this.activeView === 'CorrelatedGroups' && !this.groupType ? 1 : 0;
    this.positiveValue = this.sliderPosVal;
    this.provideParamsToMap('grouptype');
  }

  showTomeFilters(filterVal) {
    return this.selectedFeature.some(it => it.name === filterVal);
  }

  checkTimeFilterExist() {
    if (this.timeFilterDD.length === 0) {
      return false;
    } else {
      return true;
      // return this.selectedFeature.some(it => this.timeFilterDD.some(i => i.time_column === it.name));
    }
  }

  disableTimeFilterFeature() {
    if (!this.checkTimeFilterExist()) {
      return true;
    } else {
      return false;
    }
  }

  convertDateToUTC(localDate?) {
    localDate = localDate ? localDate : new Date();
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
  }

  openTimeEditMenu() {
    this.timeFilterDetails.enableFilter = this.enableFilterFeature;
    this.timeFilterDetails.filterFeature = this.timeFilterValue;
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

  OnTimeFilterCheckBox(value) {
    if (value === false) {
      this.timeFilterDetails.filterFeature = '';

    }
  }

  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterDetails.toDate && this.timeFilterDetails.fromDate && new Date(this.timeFilterDetails.toDate) < new Date(this.timeFilterDetails.fromDate)) {
      this.timeFilterDetails.toDate = '';
    }
    this.timeFilterDetails.minToDate = this.timeFilterDetails.fromDate ? new Date(this.timeFilterDetails.fromDate) : '';
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


  onRunCorr() {
    if (this.timeFilterDetails.enableFilter) {
      if (!this.timeFilterDetails.filterFeature) {
        this.global.opendisplayModal('Either select the time filter feature details or uncheck the time filter feature', 'OK', 'Alert');

      } else if (this.menuDateRangeFrm.invalid) {
        this.global.opendisplayModal('Please provide date range details for time filter feature', 'OK', 'Alert');

      } else if (this.valdateTime(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin) === true) {
        this.global.opendisplayModal('From Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');

      } else if (this.valdateTime(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin) === true) {
        this.global.opendisplayModal('To Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');

      } else {
        this.setDateDetailsToRunCorrelation(true);
      }
    } else {
      this.setDateDetailsToRunCorrelation(false);
    }
  }

  setDateDetailsToRunCorrelation(setDetails) {
    if (setDetails) {
      const fromDateInFormat = new Date(this.timeFilterDetails.fromDate);
      const toDateInFormat = new Date(this.timeFilterDetails.toDate);
      // tslint:disable-next-line:max-line-length
      const fromTimeDateCreate = this.getDateString(fromDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.fromTimeHr, this.timeFilterDetails.fromTimeMin);
      // tslint:disable-next-line:max-line-length
      const toTimeDateCreate = this.getDateString(toDateInFormat) + ' ' + this.getHrsMin(this.timeFilterDetails.toTimeHr, this.timeFilterDetails.toTimeMin);
      if (new Date(fromTimeDateCreate) > new Date(toTimeDateCreate)) {
        this.global.opendisplayModal('From date should not be greater than to date', 'OK', 'Alert');
      } else {
        this.enableFilterFeature = this.timeFilterDetails.enableFilter;
        this.correlationFromTimePeriod = fromTimeDateCreate;
        this.correlationToTimePeriod = toTimeDateCreate;
        this.timeFilterValue = this.timeFilterDetails.filterFeature;
        this.correlationService.correlationDetails.details.from_Time = this.correlationFromTimePeriod;
        this.correlationService.correlationDetails.details.to_Time = this.correlationToTimePeriod;
        this.correlationService.correlationDetails.details.selectedTimeFilterFeature = this.timeFilterValue;
        this.correlationService.correlationDetails.details.enableTimeFilter = this.enableFilterFeature;
        this.provideParamsToMap('runcorr');
        this.someMethod();
      }

    } else {
      this.enableFilterFeature = this.timeFilterDetails.enableFilter;
      this.correlationFromTimePeriod = '';
      this.correlationToTimePeriod = '';
      this.timeFilterValue = '';
      this.correlationService.correlationDetails.details.from_Time = this.correlationFromTimePeriod;
      this.correlationService.correlationDetails.details.to_Time = this.correlationToTimePeriod;
      this.correlationService.correlationDetails.details.selectedTimeFilterFeature = this.timeFilterValue;
      this.correlationService.correlationDetails.details.enableTimeFilter = this.enableFilterFeature;
      this.provideParamsToMap('runcorr');
      this.someMethod();
    }
  }

  getHrsMin(hrs, min) {
    const hrsVal = hrs.length === 1 ? ('0' + hrs) : hrs;
    const MinVal = min.length === 1 ? ('0' + min) : min;
    return (hrsVal + ':' + MinVal);
  }

  getDateString(dateObj) {
    let dateVal: any = dateObj.getDate();
    const dateMonth = dateObj.toLocaleString('default', { month: 'short' });
    const dateYear = dateObj.getFullYear();
    dateVal = dateVal < 10 ? ('0' + dateVal) : dateVal;
    return (dateMonth + '-' + dateVal + '-' + dateYear);

  }


  // tslint:disable-next-line:jsdoc-format
  /**slider modules **/
  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this.tickIntervalVal) : 0;
  }
  set tickInterval(value) {
    this.tickIntervalVal = coerceNumberProperty(value);
  }

  onChangeSliderVal(pos, matVal) {
    if (pos && matVal.value !== this.buffPositive) {
      this.buffPositive = matVal.value;
      this.positiveValue = matVal.value;
      this.valueSubject.next('sliderchange');
      // this.provideParamsToMap('sliderchange');
    } else if (!pos && matVal.value !== this.bufferNegative) {
      this.bufferNegative = matVal.value;
      this.negativeValue = matVal.value;
      this.valueSubject.next('sliderchange');
      // this.provideParamsToMap('sliderchange');
    }
  }

  onChangeInpVal(pos, inpVal) {
    if (pos) {
      if (!inpVal || inpVal < 0 || inpVal > 1) {
        this.positiveValue = this.sliderPosVal;
      } else {
        this.positiveValue = inpVal;
        this.sliderPosVal = inpVal;
        this.valueSubject.next('posinpchange');
        // this.provideParamsToMap('posinpchange');
      }
    } else {
      if (!inpVal || inpVal > 0 || inpVal < -1) {
        this.negativeValue = this.sliderNegVal;
      } else {
        this.negativeValue = inpVal;
        this.sliderNegVal = inpVal;
        this.valueSubject.next('neginpchange');
        // this.provideParamsToMap('neginpchange');
      }
    }
  }

  onSliderInpVal(pos, event: MatSliderChange) {
    if (pos) {
      this.positiveValue = event.value;
    } else {
      this.negativeValue = event.value;
    }
    // this.provideParamsToMap();
  }
  // tslint:disable-next-line:jsdoc-format
  /** end of slider modules **/
  displayView(path) {
    if (!this.disableAll) {
      this.router.navigate(['/' + this.global.prefixUrl + path]);
    }
  }

  backToFeature() {
    this.correlationService.correlationDetails.action = 'loadBuf';
    this.router.navigate(['/' + this.global.prefixUrl + '/correlation/upsertfeature']);
  }

  someMethod() {
      this.trigger.closeMenu();
  }

  setDataSetValue(dataSetDetails: any) {
    if (dataSetDetails) {
      this.dataSetValue = (dataSetDetails.selVal !== '') ? dataSetDetails.selVal : '-';
    }
  }
  setFeatureGroupValue(featureGroupDetails: any) {
    if (featureGroupDetails && featureGroupDetails.enableFeatureGroup) {
      this.featureGroupValue = (featureGroupDetails.selectedFeaturegroup !== '') ? featureGroupDetails.selectedFeaturegroup : 'None';
    }
  }
  setTimeFilterFeatureValue(timeFilterDetails: any) {
    if (timeFilterDetails && timeFilterDetails.enableTimeFilter) {
      this.timeFilterValue = (timeFilterDetails.selectedTimeFilterFeature !== '') ? timeFilterDetails.selectedTimeFilterFeature : '-';
    }
  }
  setcorrelationTimePeriodValue(value: any) {
    if (value) {
      this.correlationFromTimePeriod = value.fromTime;
      this.correlationToTimePeriod = value.toTime;
    }
  }
  categoriesChanged() {
    this.sliderNegVal = 0;
    this.sliderPosVal = 0;
    this.positiveValue = 0;
    this.negativeValue = 0;
    setTimeout(() => {
      this.provideParamsToMap('category');
    }, 1000);
  }
  provideParamsToMap(actionVal) {
    const inputsToMap = {
      selectedDataSet: this.dataSetValue,
      selectedIndexName : this.indexName,
      isFeatureGroupEnable: this.featureGroupValue ? true : false,
      featureGroupValue: this.featureGroupValue,
      isTimeFilterEnable: this.timeFilterValue ? true : false,
      timeFilterValue: this.timeFilterValue,
      timeFilterFrom: this.correlationFromTimePeriod,
      timeFilterTo: this.correlationToTimePeriod,
      selectedCategory: this.selectedCategory,
      selectedFeature: [...this.selectedFeature],
      sliderNegativeMax: -1,
      sliderPositiveMax: 1,
      sliderPositiveRange: this.positiveValue,
      sliderNegativeRange: this.negativeValue,
      showChart: this.showChart,
      chartType: this.chartType,
      groupType: this.groupType ? 'positive' : 'negative',
      action: actionVal
    };
    this.emitOut.emit(inputsToMap);
  }
}
