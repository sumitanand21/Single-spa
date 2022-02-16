import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';
import * as moment from 'moment';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-table-view-tab',
  templateUrl: './table-view-tab.component.html',
  styleUrls: ['./table-view-tab.component.scss']
})
export class TableViewTabComponent implements OnInit {
  setDisable = true;
  reverse = false;
  key = 'name';
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  searchFilter = '';
  MasterTableData: any[] = [];
  tableData: any[] = [];
  pageArr = [25, 50, 100];
  continuouscolumn1: any;
  continuouscolumn2: any;
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  selectedRow: number;
  allCorrelationDetails;
  headerData: any = {};
  selectedcorrelatedType: any;
  ScatterchartArray: any[] = [];
  isLoading = false;
  toggle = false;
  isShown = true;
chartData1 = [];
chartData2 = [];
selectedData;
  constructor(public correlationService: CorrelationService,
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
  toggleicons(x) {
    x.classList.toggle('fa-chevron-circle-right');
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  toggleView() {
    this.toggle = !this.toggle;
  }
  setClickedRow(index, selectedRowObj) {
    this.selectedRow = index;
    this.getScatterplotterAPI(selectedRowObj);
  }
  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.emptyDetails();
  }
  emptyDetails() {
    this.ScatterchartArray = [];
    this.chartData1 = [];
    this.chartData2 = [];
    this.selectedRow = -1;
    this.selectedData = null;
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
    if (evt.action === 'runcorr') {
      this.getHeatmapAPI();
    } else if (evt.action === 'oninput' || evt.action === 'category') {
      this.searchFilter = '';
      this.getTableData();
    } else {
      this.filterGraphData(this.headerData);
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
    this.setDisable = true;
    const userData = {
      db_name: this.headerData.selectedIndexName ? this.headerData.selectedIndexName : this.headerData.selectedDataSet,
      time_column: this.handleEmptyVal(this.headerData.timeFilterValue),
      from_time: this.toISO(this.headerData.timeFilterFrom),
      to_time: this.toISO(this.headerData.timeFilterTo),
      columns_mapping: this.craeteSaveObject(this.headerData.selectedFeature)
    };
    this.correlationService.getCorrelationHeatMap(userData).subscribe((res: any) => {
      this.getTableData();
    }, err => {
      this.getTableData();
    });
  }

  numberFormat(value) {
    return value ? parseFloat(value).toFixed(3) : '';
  }

  buildChartData(columnName) {
    let chartData = this.ScatterchartArray.filter(it => it.hasOwnProperty(columnName) && this.checkEmptyVal(it[columnName]));
    chartData = chartData.map(it => Object.assign({ dateVal: it.x ? it.x : '', featureVal: it[columnName]}));
    return [...chartData];
  }
  checkEmptyVal(val) {
    return val === undefined || val === null || val === '' ? false : true;
  }
  getScatterplotterAPI(selectedRow) {
    if (selectedRow) {
      this.selectedData  = selectedRow;
      this.isLoading = true;
      this.setDisable = true;
      const userData = { columns: [selectedRow.featureone, selectedRow.featuretwo] };
      this.correlationService.getCorrelationPlotData(userData).subscribe((res: any) => {
        this.correlationService.disableSlider = false;
        this.isLoading = false;
        this.setDisable = false;
        if (res && res.status === 'success') {
          this.ScatterchartArray = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
          // this.ScatterchartArray = new_list;
          this.chartData1 = this.buildChartData('column1');
          setTimeout(() => {
            this.chartData2 = this.buildChartData('column2');
          }, 4000);
          if (res.data.data.length > 0) {
            this.continuouscolumn1 = res.data.data[0].column1;
            this.continuouscolumn2 = res.data.data[0].column2;
          }
        } else {
          this.ScatterchartArray = [];
          this.chartData1 = [];
          this.chartData2 = [];
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.correlationService.disableSlider = false;
          this.isLoading = false;
          this.setDisable = false;
        }
      }, err => {
        this.chartData1 = [];
        this.chartData2 = [];
        this.correlationService.disableSlider = false;
        this.ScatterchartArray = [];
        this.notify.showToastrError('Alert', 'Server error occured');
        this.isLoading = false;
        this.setDisable = false;
      });
    } else {
      this.selectedData = null;
      this.ScatterchartArray = [];
      this.chartData1 = [];
      this.chartData2 = [];
      this.correlationService.disableSlider = false;
      this.setDisable = false;
    }
  }

  getTableData() {
    // tslint:disable-next-line: prefer-const
    let correlatedType = this.headerData.selectedCategory;
    const params = {
      // tslint:disable-next-line: object-literal-key-quotes
      'correlationType': correlatedType
    };
    this.selectedcorrelatedType = correlatedType;
    this.setDisable = true;
    this.correlationService.getCorrelationTableViewData(params).subscribe((result: any) => {
      if (result && result.status === 'success') {
        this.MasterTableData = result.data && result.data.length > 0 ?
          result.data.map((item) => ({ featureone: item.key1, featuretwo: item.key2, correlation: item.value })) : [];
      } else {
        this.MasterTableData = [];
        this.notify.showToastrWarning('Alert', 'Exception occured');
      }
      this.setDisable = false;
      this.filterGraphData(this.headerData);
    }, (error) => {
      this.notify.showToastrError('Alert', 'Server error occured');
      this.MasterTableData = [];
      this.filterGraphData(this.headerData);
      this.setDisable = false;
    });
  }

  getFilteredDetils(dataList) {
    // tslint:disable-next-line:max-line-length
    return dataList.filter(it => (it.correlation >= this.headerData.sliderNegativeMax && it.correlation <= this.headerData.sliderNegativeRange) ||
      (it.correlation >= this.headerData.sliderPositiveRange && it.correlation <= this.headerData.sliderPositiveMax));
  }

  filterGraphData(headerData) {
    if (this.MasterTableData.length > 0) {
      this.tableData = this.getFilteredDetils(this.MasterTableData);
    } else {
      this.tableData = [];
    }
    this.selectedData = this.tableData.length > 0 ? this.tableData[0] : null;
    this.selectedRow = 0;
    this.getScatterplotterAPI(this.selectedData);
    // this.onsearchChange(this.searchFilter);
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;

  }

}
