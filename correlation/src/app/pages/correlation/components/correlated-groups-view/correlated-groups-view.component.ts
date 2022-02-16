import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';

@Component({
  selector: 'app-correlated-groups-view',
  templateUrl: './correlated-groups-view.component.html',
  styleUrls: ['./correlated-groups-view.component.scss']
})
export class CorrelatedGroupsViewComponent implements OnInit {
  isLoading = false;
  isLoadingGraph = false;
  continuouscolumn1: any;
  selectedcorrelatedType: any;
  continuouscolumn2: any;
  chartData1: any = [];
  chartData2: any = [];
  selectedFeature: any = null;
  tableData = [];
  groupDetails: any = {};
  reverse = false;
  key = 'name';
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  searchFilter = '';
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  toggle = false;
  isShown = true;
  selectedRow: number;
  allCorrelationDetails: any = {};
  headerData: any = {};
  ScatterchartArray: any[];
  constructor(
    public correlationService: CorrelationService,
    private router: Router,
    public global: GlobalService,
    private notify: NotificationService) { }

  ngOnInit() {
    this.groupDetails = this.correlationService.groupDetils;
    this.selectedcorrelatedType = this.groupDetails.CorrelationType;
    this.getTableData(this.selectedRow);
  }
  buildChartData(columnName, dataArray) {
    let chartData = dataArray.filter(it => it.hasOwnProperty(columnName) && this.checkEmptyVal(it[columnName]));
    chartData = chartData.map(it => Object.assign({ dateVal: it.x ? it.x : '', featureVal: it[columnName]}));
    return [...chartData];
  }
  checkEmptyVal(val) {
    return val === undefined || val === null || val === '' ? false : true;
  }
  getDatelinechartData(selectedRow) {
    if (selectedRow) {
      this.isLoadingGraph = true;
      const userData = { columns: [selectedRow.featureone, selectedRow.featuretwo] };
      this.correlationService.getCorrelationPlotData(userData).subscribe((res: any) => {
        this.isLoadingGraph = false;
        if (res && res.status === 'success') {
          const chartData = res.data && res.data.data && res.data.data.length > 0 ? res.data.data : [];
          this.chartData1 = this.buildChartData('column1', chartData);
          setTimeout(() => {
            this.chartData2 = this.buildChartData('column2', chartData);
          }, 4000);
          if (res.data.data.length > 0) {
            this.continuouscolumn1 = res.data.data[0].column1;
            this.continuouscolumn2 = res.data.data[0].column2;
          }
        } else {
          this.chartData1 = [];
          this.chartData2 = [];
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.isLoadingGraph = false;
        }

      }, err => {
        this.chartData1 = [];
        this.chartData2 = [];
        this.notify.showToastrError('Alert', 'Server error occured');
        this.isLoadingGraph = false;
      });
    } else {
      this.chartData1 = [];
      this.chartData2 = [];
    }
  }
  getTableData(selectedRowVal) {
    if (this.correlationService.groupDetils &&
      this.correlationService.groupDetils.CorrelationType &&
      this.correlationService.groupDetils.GroupType) {
      this.isLoading = true;
      const inputuserData = {
        correlation_type: this.correlationService.groupDetils.CorrelationType,
        group_type: this.correlationService.groupDetils.GroupType,
        group_name: this.correlationService.groupDetils.GroupName
      };
      const requestData = JSON.stringify(inputuserData);
      this.correlationService.getGroupsDetailsData(requestData).subscribe((result: any) => {
        this.isLoading = false;
        if (result && result.status === 'success') {
          this.tableData = result.data && result.data.group_details &&
           result.data.group_details.Values && result.data.group_details.Values.length > 0 ?
            result.data.group_details.Values.map((item) =>
            ({ featureone: item.key1, featuretwo: item.key2, correlation: item.value })) : [];
        } else {
          this.tableData = [];
          this.notify.showToastrWarning('Alert', 'Exception occured');
          this.isLoading = false;
        }
        const selectedData = this.tableData.length > 0 ? this.tableData[0] : null;
        this.setClickedRow(0, selectedData);
      }, (error) => {
        this.notify.showToastrError('Alert', 'Server error occured');
        this.setClickedRow(0, null);
        this.isLoading = false;
      });
    } else {
      this.router.navigate(['/' + this.global.prefixUrl + 'correlation/upsertfeature']);
    }
  }
  mtsNavigation(navigationpath, newConfig?) {
    this.router.navigate(['/' + this.global.prefixUrl + navigationpath]);
  }
  setClickedRow(index, selectedRowObj) {
    this.selectedRow = index;
    this.selectedFeature = selectedRowObj ? Object.assign({}, selectedRowObj) : null;
    this.getDatelinechartData(selectedRowObj);
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
  emptyDetails() {
    this.selectedFeature = null;
    this.chartData1 = [];
    this.chartData2 = [];
    this.selectedRow = -1;
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

  numberFormat(value) {
    return value ? parseFloat(value).toFixed(3) : '';
  }
}
