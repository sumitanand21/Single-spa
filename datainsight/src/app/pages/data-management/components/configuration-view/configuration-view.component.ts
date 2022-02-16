import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataManagementService } from '../../services/data-management.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'datainsight-configuration-view',
  templateUrl: './configuration-view.component.html',
  styleUrls: ['./configuration-view.component.scss']
})
export class ConfigurationViewComponent implements OnInit, OnDestroy {
  tableLoader = false;
  detailsLoader = false;
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

  congigurationTableData: any = [];
  DetailsViewData: any = [];
  selectedConfiguration: any = null;
  ConfigDetails: any = null;
  ConfigDetailsDataView: any[] = [];
  staticTableData: any[] = [];
  ConfigName: any;
  constructor(public dataManagementService: DataManagementService,
              public global: GlobalService,
              private router: Router,
              public dialog: MatDialog,
              private notfyService: NotificationService) { }

  ngOnInit() {
    this.dataManagementService.showConfiguration = true;
    this.getdatatableAPI();
  }

  getdatatableAPI() {
    // let userData = { dataSetName: this.selecteddata };
    let selectedConfigObj: any = null;
    this.tableLoader = true;
    this.dataManagementService.getConfigurationTableData({}).subscribe((res: any) => {
      this.tableLoader = false;
      if (res.status === 'success') {
        this.congigurationTableData = res && res.data.data ? res.data.data : [];
        selectedConfigObj = this.congigurationTableData.length > 0 ? this.congigurationTableData[0] : null;
      } else {
        this.congigurationTableData = [];
        this.notfyService.showToastrWarning('Alert', 'API failed in fetching configuration');
        this.tableLoader = false;
      }
      this.getConfigurationDetails(selectedConfigObj);
    }, err => {
      this.getConfigurationDetails(selectedConfigObj);
      this.notfyService.showToastrError('Alert', 'Exception while fetching configuration');
      this.tableLoader = false;
      this.congigurationTableData = [];
      selectedConfigObj = [];
    });

  }

  ngOnDestroy() {
    this.dataManagementService.showConfiguration = false;
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.emptyDetails();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
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
    // this.key = key;
    // this.reverse = !this.reverse;
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.emptyDetails();
  }

  upsertConfiguration(action) {
    if (action === 'add') {
      this.dataManagementService.selectedConfiguration = {};
      this.dataManagementService.selectedConfigurationName = '';
    } else if (action === 'update') {
      this.dataManagementService.selectedConfiguration = Object.assign({}, this.selectedConfiguration);
      this.dataManagementService.selectedConfigurationName = this.selectedConfiguration.configurationName;
    }
    this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/upsertconfiguration']);
  }


  getConfigDetailsOnRow(selectedObj, i) {
    this.selectedConfiguration = Object.assign({}, selectedObj);
    this.getConfigurationDetails(selectedObj);
  }

  getConfigurationDetails(selectedObj) {
    this.selectedConfiguration = selectedObj ? Object.assign({}, selectedObj) : null;
    if (selectedObj) {
      this.detailsLoader = true;
      const dataSetName = { dataSetName: this.selectedConfiguration.configurationName };
      this.dataManagementService.getConfigurationViewDetails(dataSetName).subscribe((res: any) => {
        this.detailsLoader = false;
        if (res && res.status === 'success') {
          if (res.data.message === 'configuration not available') {
            this.detailsLoader = false;
          } else {
            const configDet: any = {};
            configDet.configurationName = (res.data.data.configurationName) ? res.data.data.configurationName : null;
            configDet.description = (res.data.data.description) ? res.data.data.description : null;
            configDet.dbType = (res.data.data.dbType) ? res.data.data.dbType : null;
            configDet.url = (res.data.data.url) ? res.data.data.url : null;
            configDet.hostName = (res.data.data.hostName) ? res.data.data.hostName : null;
            configDet.portNumber = (res.data.data.portNumber) ? res.data.data.portNumber : null;
            configDet.DetailsKey = (res.data.data.details) ? res.data.data.details : [];
            this.DetailsViewData = configDet.DetailsKey;
            this.ConfigDetails = Object.assign({}, configDet);
          }
        } else {
          this.ConfigDetails = null;
          this.notfyService.showToastrWarning('Alert', 'API failed in fetching configuration details');
          this.detailsLoader = false;
        }
      }, (error) => {
        this.ConfigDetails = null;
        this.detailsLoader = false;
        this.notfyService.showToastrError('Alert', 'Exception while fetching configuration details');
      });
    } else {
      this.ConfigDetails = null;
    }
  }

  deleteConfiguration(actionType) {
    if (this.selectedConfiguration) {
      this.global.opendisplayModal('Do you wish to delete the selected configuration', 'Confirm', 'Delete Configuration', true)
        .subscribe(result => {
          if (result === 'save') {
            const delTrainedModel = this.selectedConfiguration.configurationName;
            const configName = { configName: delTrainedModel };
            this.dataManagementService.deleteConfiguration(configName).subscribe((res: any) => {
              if (res && res.status === 'success') {
                if (res.data.message && res.data.responseType === 'ERR') {
                  this.notfyService.showToastrWarning('Warning', res.data.message);
                } else {
                  this.removeConfigurationFromList(this.selectedConfiguration);
                }
              } else {
                this.notfyService.showToastrWarning('Alert', 'Exception occured');
              }
            }, err => {
              this.notfyService.showToastrError('Alert', 'Server error occured');
            });
          }
        });
    } else {
      this.global.opendisplayModal('Please select a configuration to proceed with the action', 'OK', 'Alert');
    }

  }

  removeConfigurationFromList(selectedConfig) {
    const index = this.congigurationTableData.findIndex(it => it.configurationName === selectedConfig.configurationName);
    this.congigurationTableData.splice(index, 1);
    // if (this.congigurationTableData.length > 0) {
    //   const configurationObj = Object.assign({}, this.congigurationTableData[0]);
    //   this.getConfigurationDetails(configurationObj);

    // } else {
    //   this.getConfigurationDetails(null);
    // }
    this.emptyDetails();
    this.notfyService.showToastrSuccess('Success', 'Configuration deleted successfully.');
  }

  emptyDetails() {
    this.selectedConfiguration = null;
    this.ConfigDetails = null;
    this.DetailsViewData = [];
  }


}


