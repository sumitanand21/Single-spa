import { Component, OnInit, Input, Output, ViewChild, EventEmitter, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UpsertGroupNameComponent } from '../../dialogs/upsert-group-name/upsert-group-name.component';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ClassificationService } from 'src/app/pages/classification/services/classification.service';

@Component({
  selector: 'app-feature-group',
  templateUrl: './feature-group.component.html',
  styleUrls: ['./feature-group.component.scss']
})
export class FeatureGroupComponent implements OnInit, AfterViewChecked {
  @ViewChild('dateRange', { static: true }) public dateRangeFrm: NgForm;
  @Input() featureLoader = false;
  @Input() selectorType = '';
  @Input()
  set dataSet(value) {
    if (value) {
      this.setDataSetDetails(value);
    }
  }

  @Input()
  set featureGrp(value) {
    if (value) {
      this.setFeatureGrpDetails(value);
    }
  }

  @Input()
  set timeFtr(value) {
    if (value) {
      this.setTimeFtrDetails(value);
    }
  }

  @Input()
  set timeFtrDate(value) {
    if (value) {
      this.setTimeFtrDate(value);
    }
  }

  @Input()
  set featureList(value) {
    if (value) {
      this.setFeatureListDetails(value);
    }
  }

  @Input()
  set featureLabel(value) {
    if (value) {
      this.setFeatureLabel(value);
    }
  }

  @Output() emitOut = new EventEmitter<any>();
  newGroupName = '';
  selectedFeatureId = '';
  checkAllFeature = false;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginateFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };

  minFromDate: any = '';
  minToDate: any = '';

  dataSetDD = [];
  selectedDataSet = '';
  selectedIndexName = '';

  labelDD = [];
  selectedLabel = '';

  enableFeatureGroup:boolean = false;
  featureGroup = [];
  selectedFeaturegroup = '';

  enableTimeFilter = false;
  timeFilterFeature = [];
  selectedTimeFilterFeature = '';
  defaultTimeFilterVal: any = {
    fromDate: '',
    fromTimeHr: '',
    fromTimeMin: '',
    toDate: '',
    toTimeHr: '',
    toTimeMin: '',
    from_Time: '',
    to_Time: ''
  };
  timeFilterVal: any = Object.assign({}, this.defaultTimeFilterVal);
  featureDetails = [];
  searchFilter = '';
  dataTypeDD = ['Boolean', 'Int', 'Float', 'Double', 'String', 'Date'];
  editAllProperty = false;

  showSelected = false;
  selectedFeature = [];

  constructor(public classificationService: ClassificationService,public global: GlobalService, private cdref: ChangeDetectorRef, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {

  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }

  setDataSetDetails(detailsObj) {
    this.dataSetDD = detailsObj.dataArr && detailsObj.dataArr.length > 0 ? [...detailsObj.dataArr] : [];
    this.selectedDataSet = detailsObj.selVal ? detailsObj.selVal : '';
  }


  setFeatureLabel(detailsObj) {
    this.labelDD = detailsObj.dataArr && detailsObj.dataArr.length > 0 ? [...detailsObj.dataArr] : [];
    this.selectedLabel = detailsObj.selVal ? detailsObj.selVal : '';
  }

  setFeatureGrpDetails(detailsObj) {
    this.featureGroup = detailsObj.dataArr && detailsObj.dataArr.length > 0 ? [...detailsObj.dataArr] : [];
    this.selectedFeaturegroup = detailsObj.selVal ? detailsObj.selVal : '';
    this.enableFeatureGroup = detailsObj.enable ? detailsObj.enable : false;
    this.showSelected = this.selectedFeaturegroup ? true : false;
    this.searchFilter = '';
    if (detailsObj.id) {
      this.selectedFeatureId = detailsObj.id;
    }
    this.onsearchChange('');
  }

  setTimeFtrDetails(detailsObj) {
    this.timeFilterFeature = detailsObj.dataArr && detailsObj.dataArr.length > 0 ? [...detailsObj.dataArr] : [];
    this.selectedTimeFilterFeature = detailsObj.selVal ? detailsObj.selVal : '';
    this.enableTimeFilter = detailsObj.enable ? detailsObj.enable : false;
  }

  setTimeFtrDate(detailsObj) {
    this.timeFilterVal.from_Time = detailsObj.from_Time ? detailsObj.from_Time : '';
    this.timeFilterVal.to_Time = detailsObj.to_Time ? detailsObj.to_Time : '';
    this.selectedIndexName = detailsObj.indexName ? detailsObj.indexName : '';
    this.openTimeEditMenu();
  }

  setFeatureListDetails(detailsObj) {
    this.featureDetails = detailsObj.dataArr && detailsObj.dataArr.length > 0 ? [...detailsObj.dataArr] : [];
    this.searchFilter = '';
    if (!this.featureDetails.some(it => it.checkSelect === true)) {
      this.showSelected = false;
    }

    this.selectedFeatureId = detailsObj.id ? detailsObj.id : '';

    this.onsearchChange('');
  }

  selectAllFeature(value) {

    if (value === true) {
      this.featureDetails.forEach(it => it.checkSelect = true);
    } else {
      this.featureDetails.forEach(it => it.checkSelect = false);
      this.selectedFeature = [];
      this.labelDD = [];
      // this.selectedTimeFilterFeature = '';
      this.selectedLabel = '';
      this.showSelected = false;
    }
  }

  onSelectFeature(featureObj) {
    if (featureObj.checkSelect === false) {
      // if (featureObj.name === this.selectedTimeFilterFeature) {
      //   this.selectedTimeFilterFeature = '';
      // }
      if (featureObj.name === this.selectedLabel) {
        this.selectedLabel = '';
      }
    }

  }

  OnFeatureGrpCheckBox(value) {
    if (value === false) {
      this.selectedFeaturegroup = '';
      this.featureDetails.forEach(it => it.checkSelect = false);
      this.selectedFeature = [];
      this.labelDD = [];
      this.showSelected = false;
      this.selectedFeatureId = '';
    }
  }

  OnTimeFilterCheckBox(value) {
    if (value === false) {
      this.selectedTimeFilterFeature = '';

    }
  }

  checkTimeFilterExist() {
    if (this.timeFilterFeature.length === 0) {
      return false;
    } else {
      return true;
      // return this.selectedFeature.some(it => this.timeFilterFeature.some(i => i.time_column === it.name));
    }
  }

  disableTimeFilterFeature() {
    if (!this.checkTimeFilterExist()) {
      this.selectedTimeFilterFeature = '';
      this.enableTimeFilter = false;
      return true;
    } else {
      return false;
    }
  }

  disableLabelCheck() {
    if (this.labelDD.length === 0) {
      if (this.selectedLabel) {
        this.selectedLabel = '';
      }
      return true;
    } else {
      if (this.selectedLabel && !this.labelDD.some(it => it === this.selectedLabel)) {
        this.selectedLabel = '';
      }
      return false;
    }
  }

  // onIndividualSave(featureObj) {
  //   featureObj.type = featureObj.selecedType;
  //   featureObj.editMode = false;

  // }

  // onIndividualCancel(featureObj) {
  //   featureObj.selecedType = '';
  //   featureObj.editMode = false;
  // }

  // onEdit(featureObj) {
  //   featureObj.selecedType = featureObj.type ? featureObj.type : '';
  //   featureObj.editMode = true;
  // }

  showSelectedFeature() {
    this.selectedFeature = this.featureDetails.filter(it => it.checkSelect === true);
    this.labelDD = this.selectedFeature.map(it => it.name);
    if (this.featureDetails.length > 0) {
      this.checkAllFeature = this.selectedFeature.length === this.featureDetails.length ? true : false;
      if (this.checkAllFeature) {
        this.showSelected = true;
      }
    }
    return this.selectedFeature.length;
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

  setDateDetailsToRunCorrelation(setDetails) {
    if (setDetails) {
      const fromDateInFormat = new Date(this.timeFilterVal.fromDate);
      const toDateInFormat = new Date(this.timeFilterVal.toDate);
      // tslint:disable-next-line:max-line-length
      const fromTimeDateCreate = this.getDateString(fromDateInFormat) + ' ' + this.getHrsMin(this.timeFilterVal.fromTimeHr, this.timeFilterVal.fromTimeMin);
      // tslint:disable-next-line:max-line-length
      const toTimeDateCreate = this.getDateString(toDateInFormat) + ' ' + this.getHrsMin(this.timeFilterVal.toTimeHr, this.timeFilterVal.toTimeMin);

      if (new Date(fromTimeDateCreate) > new Date(toTimeDateCreate)) {
        this.global.opendisplayModal('From date should not be greater than to date', 'OK', 'Alert');
      } else {
        this.timeFilterVal.from_Time = fromTimeDateCreate;
        this.timeFilterVal.to_Time = toTimeDateCreate;
        this.OnClickAction('run');
      }
    } else {
      this.timeFilterVal.from_Time = '';
      this.timeFilterVal.to_Time = '';
      this.OnClickAction('run');
    }

  }

  provideMsgText() {
    if (this.selectorType === 'profiler') {
      return 'profiler';
    } else {
      return 'correlation';
    }
  }

  onRunCorr() {
    if (this.selectedFeature.length <= 1) {
      this.global.opendisplayModal('Select atleast two features to run the ' + this.provideMsgText(), 'OK', 'Alert');
    } else if (this.selectedFeature.length > 50 && false) {
      this.global.opendisplayModal('Select features maximum 50 to run the ' + this.provideMsgText(), 'OK', 'Alert');
    } else if (this.selectorType === 'profiler' && !this.selectedLabel) {
      this.global.opendisplayModal('Select a label to run the ' + this.provideMsgText(), 'OK', 'Alert');
    } else if (this.enableTimeFilter) {
      if (!this.selectedTimeFilterFeature) {
        this.global.opendisplayModal('Either select the time filter feature details or uncheck the time filter feature', 'OK', 'Alert');
      } else if (this.dateRangeFrm.invalid) {
        this.global.opendisplayModal('Please provide date range details for time filter feature', 'OK', 'Alert');
      } else if (this.valdateTime(this.timeFilterVal.fromTimeHr, this.timeFilterVal.fromTimeMin) === true) {
        this.global.opendisplayModal('From Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
      } else if (this.valdateTime(this.timeFilterVal.toTimeHr, this.timeFilterVal.toTimeMin) === true) {
        this.global.opendisplayModal('To Time provided should be in the range 00:00 to 24:00', 'OK', 'Alert');
      } else {
        this.setDateDetailsToRunCorrelation(true);
      }
    } else {
      this.setDateDetailsToRunCorrelation(false);
    }
  }

  disableGroupCheck() {
    if (this.featureGroup.length === 0) {
      this.selectedFeaturegroup = '';
      this.enableFeatureGroup = false;
      return true;
    } else {
      return false;
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

  showTomeFilters(filterVal) {
    return this.selectedFeature.some(it => it.name === filterVal);

  }

  OnClickAction(actionVal) {
    const emitObj: any = { action: actionVal, details: {} };
    emitObj.details.dataSetArr = this.dataSetDD;
    emitObj.details.selectedDataSet = this.selectedDataSet;
    emitObj.details.selectedIndexName = this.selectedIndexName;
    emitObj.details.featureGroup = this.featureGroup;
    emitObj.details.enableFeatureGroup = this.enableFeatureGroup;
    emitObj.details.selectedFeaturegroup = this.selectedFeaturegroup;
    emitObj.details.timeFilterFeature = this.timeFilterFeature;
    emitObj.details.enableTimeFilter = this.enableTimeFilter;
    emitObj.details.selectedTimeFilterFeature = this.selectedTimeFilterFeature;
    emitObj.details.selectedFeatureList = [...this.selectedFeature];
    emitObj.details.from_Time = this.timeFilterVal.from_Time;
    emitObj.details.to_Time = this.timeFilterVal.to_Time;
    emitObj.details.newGroupName = this.newGroupName;
    emitObj.details.selectedLabel = this.selectedLabel;
    emitObj.details.labelDD = this.labelDD;
    emitObj.details.selectedFeatureId = this.selectedFeatureId;
    this.emitDetails(emitObj);
  }

  OnDDChangeAction(actionVal) {
    const emitObj: any = { action: actionVal, details: {} };
    emitObj.details.selectedDataSet = this.selectedDataSet;
    emitObj.details.selectedIndexName = this.selectedIndexName;
    emitObj.details.selectedFeaturegroup = this.selectedFeaturegroup;
    emitObj.details.selectedTimeFilterFeature = this.selectedTimeFilterFeature;
    emitObj.details.selectedLabel = this.selectedLabel;
    this.emitDetails(emitObj);
    if (actionVal === 'featureGrp') {
      this.showSelected = true;
    }
  }

  deleteFeatureGroup() {
    this.global.opendisplayModal('Do you wish to delete the selected feature group',
      'Confirm', 'Delete Feature Group', true).subscribe(result => {
        if (result === 'save') {
          this.OnClickAction('deletegroup');
        }
      });
  }

  getTimeFiterVal(StrDate) {
    const dateObj = new Date(StrDate);
    let hrsVal: any = dateObj.getHours().toString();
    let minVal: any = dateObj.getMinutes().toString();
    hrsVal = hrsVal.length === 1 ? ('0' + hrsVal) : hrsVal;
    minVal = minVal.length === 1 ? ('0' + minVal) : minVal;
    return { dateVal: dateObj, hrs: hrsVal, min: minVal };
  }

  convertDateToUTC(localDate?) {
    localDate = localDate ? localDate : new Date();
    return new Date(localDate.getTime() + (localDate.getTimezoneOffset() * 60000));
  }

  openTimeEditMenu() {
    const currentDate = this.convertDateToUTC();
    const prevCurr = this.convertDateToUTC();
    prevCurr.setDate(prevCurr.getDate() - 1);
    const fromDateObj = this.timeFilterVal.from_Time ? this.getTimeFiterVal(this.timeFilterVal.from_Time) : this.getTimeFiterVal(prevCurr);
    const toDateObj = this.timeFilterVal.to_Time ? this.getTimeFiterVal(this.timeFilterVal.to_Time) : this.getTimeFiterVal(currentDate);
    this.timeFilterVal.fromDate = fromDateObj ? fromDateObj.dateVal : '';
    this.timeFilterVal.fromTimeHr = fromDateObj ? fromDateObj.hrs : '';
    this.timeFilterVal.fromTimeMin = fromDateObj ? fromDateObj.min : '';
    this.timeFilterVal.toDate = toDateObj ? toDateObj.dateVal : '';
    this.timeFilterVal.toTimeHr = toDateObj ? toDateObj.hrs : '';
    this.timeFilterVal.toTimeMin = toDateObj ? toDateObj.min : '';
    this.minToDate = new Date(this.timeFilterVal.fromDate);
  }

  onFromDateChange() {
    // tslint:disable-next-line:max-line-length
    if (this.timeFilterVal.toDate && this.timeFilterVal.fromDate && new Date(this.timeFilterVal.toDate) < new Date(this.timeFilterVal.fromDate)) {
      this.timeFilterVal.toDate = '';
    }
    this.minToDate = this.timeFilterVal.fromDate ? new Date(this.timeFilterVal.fromDate) : '';
  }

  groupCreate() {
    if (this.selectedFeature.length > 0) {
      this.openGroupSavePopUp('', 'Create', 'New Feature Group', true).subscribe((res: any) => {
        if (res && res.action === 'create') {
          if (this.featureGroup.some(it => it.toLowerCase() === res.groupName.toLowerCase())) {
            // tslint:disable-next-line:max-line-length
            this.global.opendisplayModal('Provided feature group name alredy exist, Please provide a different feature group name', 'OK', 'Alert');
          } else {
            this.newGroupName = res.groupName;
            this.OnClickAction('create');
          }
        }
      });
    } else {
      this.global.opendisplayModal('Select atleast one feature to create the feature group', 'OK', 'Alert');
    }
  }


  groupUpdate() {
    if (this.selectedFeature.length > 0) {
      this.openGroupSavePopUp(this.selectedFeaturegroup, 'Save', 'Save Selection', true).subscribe((res: any) => {
        if (res && res.action === 'save') {
          this.OnClickAction('update');
        }
      });
    } else {
      this.global.opendisplayModal('Select atleast one feature to update the feature group', 'OK', 'Alert');
    }
  }


  openGroupSavePopUp(grpName, buttonTextVal, headerText, showCancel?) {

    const dialogRef = this.dialog.open(UpsertGroupNameComponent, {
      width: '600px',
      disableClose: true,
      data: { groupName: grpName, buttonText: buttonTextVal, header: headerText, dispCancel: showCancel }
    });


    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }


  emitDetails(emittingObj) {
    this.emitOut.emit(emittingObj);
  }

}
