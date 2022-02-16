import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { DataManagementService } from '../../services/data-management.service';
import { NgForm } from '@angular/forms';
import { GlobalService } from 'src/app/services/global.service';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { DataModel } from '../../models/data-model.model';
@Component({
  selector: 'datainsight-upsert-configuration',
  templateUrl: './upsert-configuration.component.html',
  styleUrls: ['./upsert-configuration.component.scss']
})
export class UpsertConfigurationComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('modeledit', { static: true }) public modelEditFrm: NgForm;
  prefixUrl = this.global.prefixUrl;
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  DataModel = new DataModel();
  selectedConfiguration: any = null;
  detailsView: any;
  dataArray = [];
  ConfigName: any;
  prevdescription: any;
  // customDataName: any;
  urlPatternval: any;
  stepValue: any;
  HostName: any;
  objValDropdown: any;
  datasetArr: any[] = [];
  showMyContainer = false;
  // selectedRowTask = 0;
  // typeVal = 0;
  options = '';
  portNumber = '';
  UrlVal = '';
  description = '';
  customDataName = '';
  actiontypeVal: any;

  storedDataType: boolean = false;
  streamDataType: boolean = false;

  //Add new db type
  addDbDataType = "stored_data";
  addDbdataTypeValue = '';

  //Add & Edit configuration type
  configurationDataType = ''
  configurationDataTypeValue = ''

  configurationStepValue = '';
  constructor(
    public dataManagementService: DataManagementService,
    private notfyService: NotificationService,
    private router: Router, public global: GlobalService) { }

  ngOnInit() {
    this.modelEditFrm.form.markAsPristine();
    this.dataManagementService.showUpsertConfiguration = true;
    this.getDBList();
    if (this.dataManagementService.selectedConfigurationName) {
      this.getConfigurationDetails(this.dataManagementService.selectedConfigurationName);
    }
  }
  ngAfterViewChecked() {
    // this.cdRef.detectChanges();
  }
  assignDefaultCustom() {
    this.DataModel = new DataModel();
    // const dynamicValue = Math.random().toString(36).substring(2);
    // this.DataModel.uniquefeild = dynamicValue;
    this.dataArray = [this.DataModel];
  }

  datasetChange() {
    if (this.options === 'add') {
      // this.assignDefaultCustom();
      this.customDataName = '';
      // this.description = '';
    }
  }
  showCustomised() {
    this.showMyContainer = true;
  }
  showPredefined() {
    this.showMyContainer = false;
  }

  removeInp() {
    this.options = '';
    this.getDBList();
  }
  cancelFormData() {
    this.options = '';
    this.getDBList();
  }
  cancelNewDBtype() { }
  addForm() {
    this.detailsView = 'detailsData';
    this.DataModel = new DataModel();
    // const dynamicValue = Math.random().toString(36).substring(2);
    // this.DataModel.uniquefeild = dynamicValue;
    this.dataArray.push(this.DataModel);
  }

  getDBList() {
    this.dataManagementService.getDBList({}).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.datasetArr = res && res.data.data ? res.data.data : [];
        // this.options = this.datasetArr[0];
      } else {
        this.datasetArr = [];
        this.notfyService.showToastrWarning('Alert', 'API failed in fetching DB Type');
      }
    }, err => {
      this.datasetArr = [];
      this.notfyService.showToastrError('Alert', 'Exception while fetching DB Type');
    });
  }
  removeForm(index) {
    this.dataArray.splice(index, 1);
    return true;
  }

  getConfigurationDetails(selectedObj) {
    if (selectedObj) {
      const data = { dataSetName: selectedObj };
      this.dataManagementService.getConfigurationViewDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success') {
          this.ConfigName = (res.data.data.configurationName) ? res.data.data.configurationName : null;
          this.description = (res.data.data.description) ? res.data.data.description : null;
          this.options = (res.data.data.dbType) ? res.data.data.dbType : null;
          this.UrlVal = (res.data.data.url) ? res.data.data.url : null;
          this.HostName = (res.data.data.hostName) ? res.data.data.hostName : null;
          this.portNumber = (res.data.data.portNumber) ? res.data.data.portNumber : null;
          this.dataArray = (res.data.data.details) ? res.data.data.details : [];
          this.configurationStepValue = (res.data.data.steps) ? res.data.data.steps : null;

          this.configurationDataType = (res.data.data.dataSourceType) ? res.data.data.dataSourceType : null;
          this.configurationDataTypeValue = (res.data.data.dataSourceType) ? res.data.data.dataSourceType : null;
          this.actiontypeVal = 'update';
        } else {
          this.notfyService.showToastrWarning('Alert', 'API failed in fetching configuration details');
        }
      }, (error) => {
        this.notfyService.showToastrError('Alert', 'Exception while fetching configuration details');
      });
    } else {
      // this.configurationDetails = [];
    }
  }

  addnewVal() {
    this.stepValue = '';
    this.customDataName = '';
  }
  validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    const urlPattern = !!pattern.test(str);
    this.urlPatternval = urlPattern;
  }
  addNewConfiguration() {
    if (this.ConfigName === undefined || this.ConfigName === '' ||
      this.options === undefined || this.options === '' ||
      this.description === undefined || this.description === '' ||
      this.HostName === undefined || this.HostName === '' ||
      this.portNumber === undefined || this.portNumber === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.ConfigName.length < 3) {
      this.global.opendisplayModal('Configuration Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.ConfigName)) {
      this.global.opendisplayModal('Configuration Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else {
      this.createConfiguration();
    }
  }

  updateNewConfiguration() {
    if (this.ConfigName === undefined || this.ConfigName === '' ||
      this.options === undefined || this.options === '' ||
      this.description === undefined || this.description === '' ||
      this.UrlVal === undefined || this.UrlVal === '' ||
      this.HostName === undefined || this.HostName === '' ||
      this.portNumber === undefined || this.portNumber === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.ConfigName.length < 3) {
      this.global.opendisplayModal('Configuration Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.ConfigName)) {
      this.global.opendisplayModal('Configuration Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (this.urlPatternval === false) {
      this.global.opendisplayModal('Please Enter Valid URL', 'OK', 'Alert');
    } else {
      this.updateConfiguration();
    }
  }

  createConfiguration() {
    // var dataSourceType;
    // this.storedDataType ? dataSourceType = "stored_data" : dataSourceType = "stream_data";
    const data = {
      configurationName: this.ConfigName,
      dbType: this.options,
      dataSourceType: this.configurationDataTypeValue,
      description: this.description,
      url: this.UrlVal,
      hostName: this.HostName,
      portNumber: this.portNumber,
      details: this.dataArray,
      steps: this.configurationStepValue
    };
    this.dataManagementService.createConfigurationData(data).subscribe((res: any) => {
      if (res.data.responseType === 'ERR') {
        this.notfyService.showToastrError('Warning', res.data.message);
      }
      else if (res && res.status === 'success' && res.data.message !== 'data source already exists') {
        this.notfyService.showToastrSuccess('Success', 'Added New Configuration');
        this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/configuration']);
      } else {
        this.notfyService.showToastrWarning('Warning', 'Required feilds are missing');
      }
    }, err => {
      this.notfyService.showToastrError('Alert', 'Server error occured');
    });
  }

  addNewDBtype() {
    if (this.customDataName === undefined || this.customDataName === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.customDataName.length < 3) {
      this.global.opendisplayModal('DB Type provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.customDataName)) {
      this.global.opendisplayModal('DB Type provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else {
      this.createDBtype();
    }
  }

  updateNewDBtype() {
    if (this.customDataName === undefined || this.customDataName === '') {
      this.global.opendisplayModal('Please provide all the details', 'OK', 'Alert');
    } else if (this.customDataName.length < 3) {
      this.global.opendisplayModal('DB Type provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.customDataName)) {
      this.global.opendisplayModal('DB Type provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else {
      this.updateDBtype();
    }
  }
  createDBtype() {
    const data = { dbType: this.customDataName, steps: this.stepValue, dataSourceType: this.addDbdataTypeValue };
    this.dataManagementService.createNewDataType(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        if (res.data.responseType === 'ERR') {
          this.notfyService.showToastrError('Warning', res.data.message);
        } else {
          this.notfyService.showToastrSuccess('Success', 'Added New DB Type');
          this.removeInp();
          this.getDBList();
        }
      } else {
        this.notfyService.showToastrWarning('Warning', res.data.message);
      }
    }, err => {
      this.notfyService.showToastrError('Alert', 'Server error occured');
    });
  }

  updateConfiguration() {
    const data = {
      configurationName: this.ConfigName,
      dbType: this.options,
      dataSourceType: this.configurationDataTypeValue,
      description: this.description,
      url: this.UrlVal,
      hostName: this.HostName,
      portNumber: this.portNumber,
      details: this.dataArray,
      steps: this.configurationStepValue
    };
    this.dataManagementService.updateConfiguration(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.notfyService.showToastrSuccess('Success', 'Updated Configuration');
        this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/configuration']);
      } else {
        this.notfyService.showToastrWarning('Warning', 'Required feilds are missing');
      }
    }, err => {
      this.notfyService.showToastrError('Alert', 'Server error occured');
    });
  }

  updateDBtype() {
    const data = { dbType: this.customDataName, steps: this.stepValue };
    this.dataManagementService.createNewDataType(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.notfyService.showToastrSuccess('Success', 'DB Type Updated');
        this.removeInp();
        this.getDBList();
      } else {
        this.notfyService.showToastrWarning('Warning', res.data.message);
      }
    }, err => {
      this.notfyService.showToastrError('Alert', 'Server error occured');
    });
  }
  ngOnDestroy() {
    this.dataManagementService.showUpsertConfiguration = false;
  }
}
