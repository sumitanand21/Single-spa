import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { WebsocketService } from 'src/app/services/websocket.service';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'datainsight-data-preview-dm',
  templateUrl: './data-preview-dm.component.html',
  styleUrls: ['./data-preview-dm.component.scss']
})
export class DataPreviewDMComponent implements OnInit, OnDestroy {
  previewLoader = false;
  dataSetName = '';
  defaultCurrentPage = 1;
  defaultItempg = 25;
  itemPerPage = this.defaultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';
  pageArr = [25, 50, 100];
  config = {
    id: 'configTable',
    itemsPerPage: this.defaultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  key = 'name';
  reverse = false;
  dataSourceType = '';

  storedDataType: 'storedDataType';
  streamDataType: 'streamDataType';

  radioButtonDisabled: boolean = false;

  webSocket: any;

  selectedStoredData: boolean = true;
  selectedStreamData: boolean = false;

  tempFeatureDetails = [
    { featureName: 'Feature 1', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 2', fetureCount: [1, 0, 5] },
    { featureName: 'Feature 3', fetureCount: [1, 0, 7, 5] },
    { featureName: 'Feature 4', fetureCount: [1, 4, 5] },
    { featureName: 'Feature 5', fetureCount: [1, 0, 7, 5] },
    { featureName: 'Feature 6', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 7', fetureCount: [1, 4, 5] },
    { featureName: 'Feature 8', fetureCount: [1, 0, 4, 5] },
    { featureName: 'Feature 9', fetureCount: [1, 0, 4] },
    { featureName: 'Feature 10', fetureCount: [0, 4, 5] }
  ];

  featureName = [];
  featureDeatils = [];

  constructor(public dataManagementService: DataManagementService,
    public global: GlobalService,
    private router: Router,
    public notify: NotificationService,
    private webSocketService: WebsocketService) { }

  ngOnInit() {
    this.dataManagementService.showDataPreview = true;
    if (this.dataManagementService.selectedDataSetName) {
      this.dataSetName = this.dataManagementService.selectedDataSetName;
      this.dataSourceType = this.dataManagementService.selectedDataSourceType;

      if (this.dataSourceType.length > 1) {
        this.radioButtonDisabled = false;
        this.getdataPreviewDetails();
      }

      else if (this.dataSourceType.includes("stored_data") && !this.dataSourceType.includes("stream_data")) {
        this.radioButtonDisabled = true;
        this.getdataPreviewDetails();
      }

      else {
        this.radioButtonDisabled = true;
        this.getStreamDataPreview();
      }

    } else {
      this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/datasource']);
    }
  }

  getdataPreviewDetails() {
    this.previewLoader = true;
    const data = { dataSetName: this.dataSetName, dataSourceType: "stored_data", pageNumber: this.config.currentPage, pageSize: this.config.itemsPerPage, fromTime: "", toTime: "" };
    this.dataManagementService.getDataPreview(data).subscribe((res: any) => {
      this.previewLoader = false;
      if (res.status === 'success') {
        this.featureName = [];
        this.featureDeatils = [];
        const dataObjectArr = res.data && res.data.data.data && res.data.data.data.length > 0 ? res.data.data.data : [];
        const featureObj = this.createFeatureObj(dataObjectArr);
        this.featureName = featureObj.featureNameArr;
        this.featureDeatils = featureObj.fetaureDetArr;
        this.config.totalItems = res.data.data.total;
      } else {
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data preview');
        this.previewLoader = false;
      }
    },
      err => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data preview');
      });
  }

  // createFeatureObj() {
  //   const fetureArr = [];
  //   const featureDetailsArr = [];
  //   for (let i = 1; i < 100; i++) {
  //     const featureDetObj = {};
  //     for (let j = 1; j < 15; j++) {
  //       const featureKeyVal = 'Feature' + j;
  //       const featureObj = { featureName: 'Feature ' + j, fetureKey: featureKeyVal };
  //       featureDetObj[featureKeyVal] = Math.floor((Math.random() * 100) + 1);
  //       if (i === 1) {
  //         fetureArr.push(Object.assign({}, featureObj));
  //       }
  //     }
  //     featureDetailsArr.push(Object.assign({}, featureDetObj));

  //   }
  //   return { featureNameArr: fetureArr, fetaureDetArr: featureDetailsArr };
  // }

  createFeatureObj(dataObjectArr) {
    const fetureArr = [];
    const featureDetailsArr = [...dataObjectArr];
    if (dataObjectArr.length > 0) {
      const featureDetObj = Object.assign({}, dataObjectArr[0]);
      Object.keys(featureDetObj).forEach(it => {
        const featureObj = { featureName: it, fetureKey: it };
        fetureArr.push(Object.assign({}, featureObj));
      });
    }
    return { featureNameArr: fetureArr, fetaureDetArr: featureDetailsArr };
  }

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
    } else {
      this.config.currentPage = parseInt(inputVal);
    }

    this.getdataPreviewDetails();
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.getdataPreviewDetails();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    if (this.selectedStoredData) {
      this.getdataPreviewDetails();
    }
    else {
      this.getStreamDataPreview();
    }
  }

  ngOnDestroy() {
    this.dataManagementService.showDataPreview = false;
    if (this.webSocket) {
      this.webSocket.complete();
    }
  }

  switchDataTypeFilter(val) {
    this.config.currentPage = 1;
    this.config.itemsPerPage = 25;
    this.config.totalItems = 0;
    this.inputCurrentpage = 1;

    if (val.detail.value === "storedDataType") {
      this.selectedStoredData = true;
      this.selectedStreamData = false;
      if (this.webSocket) {
        this.webSocket.complete();
      }
      this.getdataPreviewDetails();
    }

    else {
      this.selectedStoredData = false;
      this.selectedStreamData = true;
      this.getStreamDataPreview();
    }
  }

  getStreamDataPreview() {
    this.previewLoader = true;
    var data = {
      dataSetName: this.dataSetName,
      pageNumber: 1,
      pageSize: this.config.itemsPerPage
    }

    this.webSocket = this.webSocketService.connectToWebSocket(data).subscribe(
      (res: any) => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        const dataObjectArr = res.data;
        const featureObj = this.createFeatureObj(dataObjectArr);
        this.featureName = featureObj.featureNameArr;
        this.featureDeatils = featureObj.fetaureDetArr;
        this.config.totalItems = data.pageSize;
      },

      (err) => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data preview');
      },

      () => {
      }
    );
  }
}

