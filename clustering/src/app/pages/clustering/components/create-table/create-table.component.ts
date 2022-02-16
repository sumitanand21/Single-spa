import { width } from '@amcharts/amcharts4/.internal/core/utils/Utils';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent implements OnInit {
  dataSource = [{
    jobStatus: 'waiting',
    statusId: 'W',
    frontEndId: 1,
    dataSetName: 'alarm_data',
    jobType: ['ANOMALY DETECTION', 'FORECAST', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data1'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: 'running',
    statusId: 'R',
    frontEndId: 2,
    dataSetName: 'alarm_data1',
    jobType: ['FORECAST'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: 'stoppped',
    statusId: 'S',
    frontEndId: 3,
    dataSetName: 'alarm_data2',
    jobType: ['ANOMALY DETECTION'],
    dataSourceType: ['stored_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: 'waiting',
    statusId: 'y',
    frontEndId: 4,
    dataSetName: 'alarm_data3',
    jobType: ['CLASSIFICATION', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: '',
    statusId: '',
    frontEndId: 5,
    dataSetName: 'alarm_data3',
    jobType: ['CLASSIFICATION', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: 'waiting',
    statusId: 'W',
    frontEndId: 6,
    dataSetName: 'alarm_data3',
    jobType: ['CLASSIFICATION', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  },
  {
    jobStatus: 'waiting',
    statusId: 'W',
    frontEndId: 7,
    dataSetName: 'alarm_data3',
    jobType: ['CLASSIFICATION', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  }, {
    jobStatus: 'waiting',
    statusId: 'A',
    frontEndId: 8,
    dataSetName: 'alarm_data3',
    jobType: ['CLASSIFICATION', 'CORRELATION'],
    dataSourceType: ['stored_data', 'stream_data'],
    dbType: 'ElasticSearch',
    checkboxData: false
  }];

  dataStructure = [{
    type: 'checkbox', headerModel: false, name: 'headerName',
    bodyModel: 'checkboxData', feildname: 'checkboxData', displayName: '', enableSort: false,
    styleHeadObj: { 'max-width': '35px' }, styleBodyObj: { 'max-width': '35px' }
  },
  {
    type: 'status',
    bodyModel: 'statusId', feildname: 'jobStatus', displayName: '', enableSort: false
  },
  { type: 'text', feildname: 'dataSetName', displayName: 'DataSet Name', enableSort: true, hyperLink: true },
  { type: 'text', feildname: 'dbType', displayName: 'DB Type', enableSort: true },
  { type: 'text', feildname: 'dataSourceType', displayName: 'Data Source Type', enableSort: true },
  { type: 'text', feildname: 'dataSetName', displayName: 'DataSet Name ddfsfsff ewfwfw wffw efesfsfsf rgf rerg gregr  eg g re rgrg regreg regre geg rg', enableSort: true },
  { type: 'text', feildname: 'frontEndId', displayName: 'frontEndId', enableSort: true }];

  config: any = {
    id: 'axy',
    itemsPerPage: 2,
    currentPage: 3,
    totalItems: 0
  };

  seletedRowStr: string | number = 0;
  uniqueFeild = 'dataSetName';
  searchFilterObj = { dataSetName: '' };
  exactFilterObj = '';
  defaultngxFilterObj = '';
  // defaultngxFilterObj = {
  //   schedule_name: '', schedule_status: { $or: [[]] }
  // };
  constructor() { }

  ngOnInit() {

  }

  addDataSource() {
    console.log('asdd', this.config);
    // const dataSourceTemp = this.dataSource;
    // this.dataSource.push({
    //   checkboxData: false,
    //   frontEndId: 11,
    //   dataSetName: 'alarm_datax3',
    //   jobType: ['CLASSIFICATION', 'CORRELATION'],
    //   dataSourceType: ['stored_data', 'stream_data'],
    //   dbType: 'ElasticSearch'
    // }, {
    //   frontEndId: 12,
    //   checkboxData: false,
    //   dataSetName: 'alarm_data3x',
    //   jobType: ['CLASSIFICATION', 'CORRELATION'],
    //   dataSourceType: ['stored_data', 'stream_data'],
    //   dbType: 'ElasticSearch'
    // });
    // this.dataSource = dataSourceTemp;
  }

  getOutput(dataObj) {
    console.log('dataObj', dataObj);
  }


}
