import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-correlated-groups',
  templateUrl: './correlated-groups.component.html',
  styleUrls: ['./correlated-groups.component.scss']
})
export class CorrelatedGroupsComponent implements OnInit {
  setDisable = true;
  chartDetails = { chartArr: [], groupType: 'negative' };
  histogramDetails = { chartArr: [], groupType: 'negative' };
  key = '';
  reverse = true;
  showchart = true;
  chartType = 'bubble';
  searchFilter = '';
  groupsData: any = [];
  selectedGroup: any = null;
  allCorrelationDetails: any = null;
  headerData: any = {};
  isLoading = false;
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
  groupMembers = [];
  constructor(public correlationService: CorrelationService,
              private router: Router,
              public global: GlobalService,
              private notify: NotificationService) { }

  ngOnInit() {
    if (this.correlationService.correlationDetails && this.correlationService.correlationDetails.hasOwnProperty('details')) {
      this.allCorrelationDetails = this.correlationService.correlationDetails.details;
    } else {
      this.router.navigate(['/' + this.global.prefixUrl + 'correlation/upsertfeature']);
    }
  }

  setClickedRow(groupObj) {
    this.selectedGroup = groupObj ? Object.assign({}, groupObj) : null;
    this.groupMembers = groupObj && groupObj.GroupMembers && groupObj.GroupMembers.length > 0 ? [...groupObj.GroupMembers] : [];

  }

  navigateTo() {
    this.correlationService.groupDetils = Object.assign({}, this.selectedGroup);
    this.correlationService.groupDetils.CorrelationType = this.headerData.selectedCategory;
    this.correlationService.groupDetils.GroupType = this.headerData.groupType;
    this.router.navigate(['/' + this.global.prefixUrl + '/correlation/correlatedgroupsview']);
  }
  emptyDetails() {
    this.selectedGroup = null;
    this.groupMembers = [];
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.emptyDetails();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
      this.emptyDetails();
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.emptyDetails();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.emptyDetails();
  }

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.emptyDetails();
  }

  provideInputsToMap(evt: any) {
    this.headerData = evt;
    if (evt.action === 'showchart') {
      this.showchart = evt.showChart;
    } else if (evt.action === 'charttype') {
      this.chartType = evt.chartType;
    } else if (evt.action === 'runcorr') {
      this.getHeatmapAPI();
    } else if (evt.action === 'oninput' || evt.action === 'category' || evt.action === 'grouptype') {
      this.getCorrelatedGroupData();
    } else {
      this.getCorrelatedGroupData();
    }
  }

  getCorrelatedGroupData() {
    if (this.headerData.groupType === 'positive') {
      this.getPositiveGroupDetails();
    } else {
      this.getNegativeGroupDetails();
    }
  }

  handleEmptyVal(val) {
    return val ? val : 'None';
  }
  getIsoString(dateStr) {
    return dateStr ? (new Date(dateStr)).toISOString() : 'None';
  }

  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  craeteSaveObject(selectedFeatureList) {
    const outObj = {};
    selectedFeatureList.forEach((it: any) => {
      const newObj = { [it.name]: it.type };
      Object.assign(outObj, newObj);
    });

    return outObj;

  }

  getHeatmapAPI() {
    this.isLoading = true;
    this.setDisable = true;
    const userData = {
      db_name: this.headerData.selectedIndexName ? this.headerData.selectedIndexName : this.headerData.selectedDataSet,
      time_column: this.handleEmptyVal(this.headerData.timeFilterValue),
      from_time: this.toISO(this.headerData.timeFilterFrom),
      to_time: this.toISO(this.headerData.timeFilterTo),
      columns_mapping: this.craeteSaveObject(this.headerData.selectedFeature)
    };
    this.correlationService.getCorrelationHeatMap(userData).subscribe((res: any) => {
      this.getCorrelatedGroupData();
    }, err => {
      this.getCorrelatedGroupData();
    });
  }

  getPositiveGroupDetails() {
    this.setDisable = true;
    this.isLoading = true;
    const inputuserData = {
      correlation_type: this.headerData.selectedCategory,
      range_from: this.headerData.sliderNegativeRange,
      range_to: this.headerData.sliderPositiveRange
    };
    const userData = JSON.stringify(inputuserData);
    this.correlationService.getPositiveGroupsData(userData).subscribe((res: any) => {
      this.correlationService.disableSlider = false;
      this.isLoading = false;
      this.setDisable = false;
      if (res && res.status === 'success') {
        const histogramgrahData = res.data && res.data.histogram_values ? res.data.histogram_values : [];
        this.histogramDetails = { chartArr: [...histogramgrahData], groupType: this.headerData.groupType };
        this.groupsData = res.data && res.data.positive_groups ? res.data.positive_groups : [];
        this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
        const groupObj = this.groupsData.length > 0 ? this.groupsData[0] : null;
        this.setClickedRow(groupObj);
      } else {
        this.groupsData = [];
        this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
        this.histogramDetails = { chartArr: [], groupType: this.headerData.groupType };
        this.setClickedRow(null);
        // this.notify.showToastrWarning('Alert', 'API failed to fetch correlated groups details');
      }
    }, err => {
      this.groupsData = [];
      this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
      this.histogramDetails = { chartArr: [], groupType: this.headerData.groupType };
      this.setClickedRow(null);
      this.notify.showToastrError('Alert', 'Exception while fetching correlated groups details');
      this.correlationService.disableSlider = false;
      this.isLoading = false;
      this.setDisable = false;
    });
  }

  getNegativeGroupDetails() {
    this.isLoading = true;
    this.setDisable = true;
    const inputuserData = {
      correlation_type: this.headerData.selectedCategory,
      range_from: this.headerData.sliderNegativeRange,
      range_to: this.headerData.sliderPositiveRange
    };
    const userData = JSON.stringify(inputuserData);
    this.correlationService.getNegativeGroupsData(userData).subscribe((res: any) => {
      this.correlationService.disableSlider = false;
      this.isLoading = false;
      this.setDisable = false;
      if (res && res.status === 'success') {
        const histogramgrahData = res.data && res.data.histogram_values ? res.data.histogram_values : [];
        this.histogramDetails = { chartArr: [...histogramgrahData], groupType: this.headerData.groupType };
        this.groupsData = res.data && res.data.negative_groups ? res.data.negative_groups : [];
        this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
        const groupObj = this.groupsData.length > 0 ? this.groupsData[0] : null;
        this.setClickedRow(groupObj);
      } else {
        this.groupsData = [];
        this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
        this.histogramDetails = { chartArr: [], groupType: this.headerData.groupType };
        this.setClickedRow(null);
        // this.notify.showToastrWarning('Alert', 'API failed to fetch correlated groups details');
      }
    }, err => {
      this.groupsData = [];
      this.chartDetails = { chartArr: [...this.groupsData], groupType: this.headerData.groupType };
      this.histogramDetails = { chartArr: [], groupType: this.headerData.groupType };
      this.setClickedRow(null);
      this.notify.showToastrError('Alert', 'Exception while fetching correlated groups details');
      this.correlationService.disableSlider = false;
      this.isLoading = false;
      this.setDisable = false;
    });
  }


  // filterGraphData(headerData) {
  //   if (this.partitionDataList.length > 0) {
  //     this.chartArrayvalue = this.getFilteredDetils(this.partitionDataList);
  //   } else {
  //     this.chartArrayvalue = this.getFilteredDetils([]);
  //   }
  // }

}
