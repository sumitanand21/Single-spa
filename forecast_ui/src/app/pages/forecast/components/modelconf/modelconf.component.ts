import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ForecastService } from '../../services/forecast.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-modelconf',
  templateUrl: './modelconf.component.html',
  styleUrls: ['./modelconf.component.scss'],
})
export class ModelconfComponent implements OnInit, OnDestroy {
  selectedModelObject: any = {};
  modelDetails: any = [];
  defaultJobType = 'FORECASTEXECUTION';
  defaultCurrentPage = 1;
  defauultItempg = 25;
  searchFilter: any;
  keyTask = 'name';
  isShown = true;
  reverseTask = false;
  isLoading = true;
  selectedModel: any = {};
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  modelConfigs = [];
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  tableErrorMsg = '';
  modelConfigName = '';
  tableDetailsErrorMsg = '';
  selectedInterval = 'off';
  constructor(
    public forecastService: ForecastService,
    public global: GlobalService,
    private notify: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.forecastService.ForecastModel = true;
    this.loadAllModelConfigs();
  }

  loadAllModelConfigs(setvalue?) {
    this.isLoading = true;
    const data = { jobType: this.defaultJobType };
    this.forecastService.getAllModelConfigs(data).subscribe((res: any) => {
      this.isLoading = false;
      if (res.status === 'success') {
        this.modelConfigs = res.data;
        this.setModelsTable(setvalue);
      } else {
        this.tableErrorMsg = 'No Records found';
        this.tableDetailsErrorMsg = 'No Records found';
        this.isLoading = false;
      }
    }, (error) => {
      this.isLoading = false;
      this.tableErrorMsg = 'Failed in reaching to server';
      this.tableDetailsErrorMsg = 'No Records found';
    });
  }
  toggleShow() {
    this.isShown = !this.isShown;
  }
  setModelsTable(setvalue?) {
    this.modelDetails = this.modelConfigs;
    if (this.modelDetails.length > 0 && !setvalue) {
      this.tableErrorMsg = '';
      this.displayModel(this.modelDetails[0]);
    } else {
      this.emptyDetails();
      this.tableErrorMsg = 'No records found';
    }
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

  sortTask(key) {
    // this.keyTask = key;
    // this.reverseTask = !this.reverseTask;
    if (key === this.keyTask) {
      this.reverseTask = !this.reverseTask;
    } else {
      this.keyTask = key;
      this.reverseTask = true;
    }
    this.emptyDetails();
  }

  displayModel(modelVal) {
    this.modelConfigName = modelVal.modelConfigName;
    this.selectedModel = modelVal;
    this.getModelConfigData();
  }

  getModelConfigData() {
    if (this.modelConfigName) {
      const data = { jobType: this.defaultJobType, modelConfig: this.modelConfigName };
      this.forecastService.getModelConfigDetails(data).subscribe((res: any) => {
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          // res.data.L1 = res.data.l1L2 ? res.data.l1L2.split(',')[0] : '';
          // res.data.L2 = res.data.l1L2 ? res.data.l1L2.split(',')[1] : '';
          const modelconf = res.data;
          this.selectedModelObject = modelconf;
          this.tableDetailsErrorMsg = '';
        }
      }, err => {
        this.tableDetailsErrorMsg = 'Failed in reaching to server';
        this.notify.showToastrError('Alert', 'Server error occured');
      });
    }
  }

  checkifObjectExist(checkObj) {
    return checkObj && Object.keys(checkObj).length > 0 ? true : false;

  }

  deleteModelConfig(model) {
    this.global.opendisplayModal('Do you wish to delete this model configuration',
      'Confirm', 'Delete Model Configuration', true).subscribe(result => {
        if (result === 'save') {
          const data = { jobType: this.defaultJobType, modelConfig: model };
          this.forecastService.deleteModelConfigDetails(data).subscribe((res: any) => {
            if (res && res.status === 'success' && res.data.deletedCount !== 0) {
              this.loadAllModelConfigs(true);
              this.notify.showToastrSuccess('Success', 'Model deleted successfully.');
              this.emptyDetails();
            } else {
              this.notify.showToastrWarning('Alert', 'Exception occured');
            }

          }, err => {
            this.notify.showToastrError('Alert', 'Server error occured');
          });
        }
      });
  }

  // removeModelFromList(modelObj){
  //   let index = this.modelDetails.findIndex(it=> it.modelConfigName == modelObj.modelConfigName);
  //   this.modelDetails.splice(index, 1);
  //   if(this.modelDetails.length>0){
  //     let modelDetailsObj = Object.assign({},this.modelDetails[0]);
  //     this.getModelConfigDetails(modelDetailsObj);

  //   }else{
  //     this.getModelConfigDetails(null);
  //   }
  //   this.showToastrSuccess('Success','Model deleted successfully.');
  // }


  navigateTo(navigationpath, modelDetails) {
    this.forecastService.selectedModelConfig = modelDetails;
    this.router.navigate(['/' + this.global.prefixUrl + navigationpath], { queryParams: { name: modelDetails.modelConfigName } });
  }

  emptyDetails() {
    this.selectedModelObject = {};
    this.selectedModel = {};
  }

  ngOnDestroy() {
    this.forecastService.ForecastModel = false;
  }
}
