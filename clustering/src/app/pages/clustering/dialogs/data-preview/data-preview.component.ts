import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { ClusteringService } from '../../services/clustering.service';
import * as moment from 'moment';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.scss']
})
export class DataPreviewComponent implements OnInit {
  previewLoader = false;
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

  featureName = [];
  featureDeatils = [];

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

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DataPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public clusteringService: ClusteringService,
    public notify: NotificationService) { }

  ngOnInit() {
    if (this.data.action === 'alarm') {
      this.getAlarmdataPreviewDetails();
    } else {
      this.getSequencePreviewDetails();
    }

  }

  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }

  getAlarmdataPreviewDetails() {
    this.previewLoader = true;

    const data = { dataSetName: this.data.selectedModel.dataSetName,
      startTime: this.data.selectedModel.RCAObj.startTime,
      endTime: this.data.selectedModel.RCAObj.endTime };
    this.clusteringService.getAlarmDataPreview(data).subscribe((res: any) => {
      this.previewLoader = false;
      if (res.status === 'success') {
        const dataObjectArr = res.data && res.data.length > 0 ? res.data : [];
        const featureObj = this.createFeatureObj(dataObjectArr);
        this.featureName = featureObj.featureNameArr;
        this.featureDeatils = featureObj.fetaureDetArr;
      } else {
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch alarm data');
        this.previewLoader = false;
      }
    },
      err => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch alarm data');
      });
  }

  getSequencePreviewDetails() {
    this.previewLoader = true;
    const data = { dataSetName: this.data.selectedModel.dataSetName,
      timestamp : this.data.selectedModel.dataSet,
      startTime: this.data.selectedModel.RCAObj.startTime,
      endTime: this.data.selectedModel.RCAObj.endTime };
    this.clusteringService.getSequenceDataPreview(data).subscribe((res: any) => {
      this.previewLoader = false;
      if (res.status === 'success') {
        const dataObjectArr = res.data && res.data.length > 0 ? res.data : [];
        const featureObj = this.createFeatureObj(dataObjectArr);
        this.featureName = featureObj.featureNameArr;
        this.featureDeatils = featureObj.fetaureDetArr;
      } else {
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch sequence details');
        this.previewLoader = false;
      }
    },
      err => {
        this.previewLoader = false;
        this.featureName = [];
        this.featureDeatils = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch sequence details');
      });
  }

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

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
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

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
  }


}
