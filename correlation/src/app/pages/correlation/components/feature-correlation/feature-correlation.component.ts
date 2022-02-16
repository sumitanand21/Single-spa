import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-feature-correlation',
  templateUrl: './feature-correlation.component.html',
  styleUrls: ['./feature-correlation.component.scss']
})
export class FeatureCorrelationComponent implements OnInit {
  setDisable = true;
  groupsData: any;
  selecteddata: any;
  allCorrelationDetails: any = null;
  headerData: any = {};
  chartArrayvalue: any = this.getFilteredDetils([]);
  partitionDataList: any = [];
  isLoading = false;
  constructor(private correlationService: CorrelationService,
              public global: GlobalService,
              private router: Router,
              private notify: NotificationService) { }

  ngOnInit() {
    if (this.correlationService.correlationDetails && this.correlationService.correlationDetails.hasOwnProperty('details')) {
      this.allCorrelationDetails = this.correlationService.correlationDetails.details;
    } else {
      this.router.navigate(['/' + this.global.prefixUrl + 'correlation/upsertfeature']);
    }
  }

  provideInputsToMap(evt: any) {
    this.headerData = evt;
    if (evt.action === 'runcorr') {
      this.getHeatmapAPI();
    } else if (evt.action === 'oninput' || evt.action === 'category') {
      this.getCorrelatedData();
    } else {
      this.filterGraphData(this.headerData);
    }
  }

  getCorrelatedData() {
    const correlatedType = this.headerData.selectedCategory;
    const params = {
      // tslint:disable-next-line:object-literal-key-quotes
      'correlationType': correlatedType
    };
    this.setDisable = true;
    this.correlationService.getCorrelationListData(params).subscribe((result: any) => {
      if (result && result.status === 'success') {
        this.groupsData = result.data && result.data.length ? result.data : [];
        this.selecteddata = this.groupsData.length > 0 ? this.groupsData[0] : '';

      } else {
        this.groupsData = [];
        this.selecteddata = '';
      }
      this.setDisable = false;
      this.getpartionedchartAPI();
    }, (error) => {
      this.setDisable = false;
      this.groupsData = [];
      this.selecteddata = '';
      this.getpartionedchartAPI();
    });
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
    this.setDisable = true;
    this.isLoading = true;
    const userData = {
      db_name: this.headerData.selectedIndexName ? this.headerData.selectedIndexName : this.headerData.selectedDataSet,
      time_column: this.handleEmptyVal(this.headerData.timeFilterValue),
      from_time: this.toISO(this.headerData.timeFilterFrom),
      to_time: this.toISO(this.headerData.timeFilterTo),
      columns_mapping: this.craeteSaveObject(this.headerData.selectedFeature)
    };
    this.correlationService.getCorrelationHeatMap(userData).subscribe((res: any) => {
      this.getpartionedchartAPI();
    }, err => {
      this.getpartionedchartAPI();
    });
  }

  getpartionedchartAPI() {
    if (this.selecteddata) {
      this.isLoading = true;
      this.setDisable = true;
      const correlatedType: any = this.headerData.selectedCategory;
      const userData = { column_name: this.selecteddata, correlation_type: correlatedType };
      this.correlationService.getPartionedChartData(userData).subscribe((res: any) => {
        this.isLoading = false;
        this.setDisable = false;
        if (res && res.status === 'success') {
          this.partitionDataList = res.data && res.data.correlated_features ? res.data.correlated_features : [];
        } else {
          this.partitionDataList = [];
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.isLoading = false;
          this.setDisable = false;
        }
        this.filterGraphData(this.headerData);
      }, err => {
        this.partitionDataList = [];
        this.filterGraphData(this.headerData);
        this.notify.showToastrError('Alert', 'Server error occured');
        this.isLoading = false;
        this.setDisable = false;
      });
    } else {
      this.isLoading = false;
      this.setDisable = false;
      this.partitionDataList = [];
      this.filterGraphData(this.headerData);
    }
  }

  getFilteredDetils(dataList) {
    const posArrList = [];
    const negArrList = [];
    let firstNeg = '';
    let lastNeg = '';
    let firstPos = '';
    let lastPos = '';
    dataList.forEach(it => {
      if (it.key2 === 'negative' && it.value >= this.headerData.sliderNegativeMax && it.value <= this.headerData.sliderNegativeRange) {
        if (!firstNeg) {
          firstNeg = it.key1;
        }
        lastNeg = it.key1;
        negArrList.push(Object.assign({}, it));
      // tslint:disable-next-line:max-line-length
      } else if (it.key2 === 'positive' && it.value >= this.headerData.sliderPositiveRange && it.value <= this.headerData.sliderPositiveMax) {
        if (!firstPos) {
          firstPos = it.key1;
        }
        lastPos = it.key1;
        posArrList.push(Object.assign({}, it));
      }
    });
    const negValLength = negArrList.length;
    const posValLength = posArrList.length;
    return {posArrList, negArrList, firstNeg, lastNeg, firstPos, lastPos, negValLength, posValLength};
    // return dataList.filter(it => (it.value >= this.headerData.sliderNegativeMax && it.value <= this.headerData.sliderNegativeRange) ||
    //   (it.value >= this.headerData.sliderPositiveRange && it.value <= this.headerData.sliderPositiveMax));
  }

  filterGraphData(headerData) {
    if (this.partitionDataList.length > 0) {
      this.chartArrayvalue = this.getFilteredDetils(this.partitionDataList);
    } else {
      this.chartArrayvalue = this.getFilteredDetils([]);
    }
  }

  OnGroupCorrelated() {
    this.getpartionedchartAPI();
  }

}

