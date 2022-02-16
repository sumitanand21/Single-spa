import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-heat-map-tab',
  templateUrl: './heat-map-tab.component.html',
  styleUrls: ['./heat-map-tab.component.scss']
})
export class HeatMapTabComponent implements OnInit {
  setDisable = true;
  headerData: any = {};
  allCorrelationDetails: any = null;
  chartArray: any = [];
  categorialList = [];
  continuousList = [];
  categorialToContinuousList = [];
  isLoading = false;

  // tslint:disable-next-line:no-shadowed-variable
  constructor(private correlationService: CorrelationService,
              public global: GlobalService,
              private notify: NotificationService,
              private router: Router) { }

  ngOnInit() {
    if (this.correlationService.correlationDetails && this.correlationService.correlationDetails.hasOwnProperty('details')) {
      this.allCorrelationDetails = this.correlationService.correlationDetails.details;
    } else {
      this.router.navigate(['/' + this.global.prefixUrl + 'correlation/upsertfeature']);
    }
  }

  getFilteredDetils(dataList) {
    return dataList.filter(it => (it.value >= this.headerData.sliderNegativeMax && it.value <= this.headerData.sliderNegativeRange) ||
      (it.value >= this.headerData.sliderPositiveRange && it.value <= this.headerData.sliderPositiveMax)).map(it =>
        Object.assign({ rowsVal: it.index, column: it.column, value: it.value }));
  }

  filterGraphData(headerData) {
    if (headerData.selectedCategory === 'continuous_categorical') {
      this.chartArray = this.getFilteredDetils(this.categorialToContinuousList);
    } else if (headerData.selectedCategory === 'continuous') {
      this.chartArray = this.getFilteredDetils(this.continuousList);
    } else if (headerData.selectedCategory === 'categorical') {
      this.chartArray = this.getFilteredDetils(this.categorialList);
    } else {
      this.chartArray = [];
    }

  }

  provideInputsToMap(evt: any) {
    this.headerData = evt;
    if (evt.action === 'oninput' || evt.action === 'runcorr') {
      this.getHeatmapAPI();
    } else {
      this.filterGraphData(this.headerData);
    }

  }

  getIsoString(dateStr) {
    return dateStr ? (new Date(dateStr)).toISOString() : 'None';
  }

  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  handleEmptyVal(val) {
    return val ? val : 'None';
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
      this.isLoading = false;
      this.setDisable = false;
      if (res && res.status === 'success') {

        // tslint:disable-next-line:max-line-length
        this.categorialToContinuousList = res.data && res.data.continuous_categorical_matrix && res.data.continuous_categorical_matrix.values ? res.data.continuous_categorical_matrix.values : [];
        // tslint:disable-next-line:max-line-length
        this.continuousList = res.data && res.data.continuous_matrix && res.data.continuous_matrix.values ? res.data.continuous_matrix.values : [];
        // tslint:disable-next-line:max-line-length
        this.categorialList = res.data && res.data.categorical_matrix && res.data.categorical_matrix.values ? res.data.categorical_matrix.values : [];
      } else {
        this.categorialToContinuousList = [];
        this.continuousList = [];
        this.categorialList = [];
        this.notify.showToastrWarning('Alert', 'Exception occured');
        this.isLoading = false;
        this.setDisable = false;
      }
      this.filterGraphData(this.headerData);

    }, err => {
      this.categorialToContinuousList = [];
      this.continuousList = [];
      this.categorialList = [];
      this.filterGraphData(this.headerData);
      this.notify.showToastrError('Alert', 'Server error occured');
      this.isLoading = false;
      this.setDisable = false;
    });
  }
}
