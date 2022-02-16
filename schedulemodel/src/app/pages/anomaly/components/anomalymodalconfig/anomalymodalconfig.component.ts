import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AnomalyService } from '../../services/anomaly.service';
import { GlobalService } from 'src/app/services/global.service';
import { ChangeDetectorRef } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-anomalymodalconfig',
  templateUrl: './anomalymodalconfig.component.html',
  styleUrls: ['./anomalymodalconfig.component.scss']
})
export class AnomalymodalconfigComponent implements OnInit, AfterViewChecked, OnDestroy {
  detailLoader = false;
  tableLoader = false;
  regexAllSpace = new RegExp(/\s/, 'g');
  defaultModelType = 'ANOMALYTRAINING1';
  selectedTime = 'off';
  selectedModelObject: any = {};
  selModelObj: any = {};
  modelDetails: any = [];
  defaultCurrentPage = 1;
  defauultItempg = 25;
  searchFilter: any;
  xFeatureSearch = '';
  trainFilterSearch = '';
  strFeatureSearch = '';
  key = 'name';
  reverse = false;
  itemPerPage: number = this.defauultItempg;
  inputCurrentpage: number = this.defaultCurrentPage;
  pageArr = [25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  constructor(
    private cdref: ChangeDetectorRef,
    public global: GlobalService,
    public anomalyService: AnomalyService,
    private toastr: ToastrService,
    private router: Router,
    public notificationService:NotificationService) { }

  ngOnInit() {
    this.anomalyService.AnomalyModel = true;
    this.getAllModelConf();

  }

  ngAfterViewChecked() {
    this.cdref.detectChanges();
  }

  getAllModelConf() {
    this.tableLoader = true;
    this.anomalyService.getAllAnomalyModelConfig().subscribe((res: any) => {
      this.tableLoader = false;
      if (res && res.status === 'success') {
        this.modelDetails = res && res.data && res.data.length > 0 ? res.data : [];
        console.log(this.modelDetails);
        const modelConfObj = Object.assign({}, this.modelDetails[0]);
        this.getModelConfigDetails(modelConfObj);
      } else {
        this.notificationService.showToastrError('Alert', 'Exception occured');
        this.getModelConfigDetails(null);
        this.tableLoader = false;
      }

    }, err => {
      this.notificationService.showToastrError('Alert', 'Server error occured');
      this.getModelConfigDetails(null);
      this.tableLoader = false;
    });
  }

  getModelConfigDetails(modelConfObj) {
    this.selModelObj = modelConfObj ? modelConfObj : {};
    if (modelConfObj && modelConfObj.modelConfigName) {
      this.detailLoader = true;
      const data = { jobType: modelConfObj.jobType, modelConfigName: modelConfObj.modelConfigName };
      this.anomalyService.getAnmolayModelConfigByName(data).subscribe((res: any) => {
        this.detailLoader = false;
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          const modelconfI = res.data.anomalyI && Object.keys(res.data.anomalyI).length > 0 ? res.data.anomalyI : null;
          const modelconfII = res.data.anomalyII && Object.keys(res.data.anomalyII).length > 0 ? res.data.anomalyII : null;
          const ascconf = res.data.asc && Object.keys(res.data.asc).length > 0 ? res.data.asc : null;
          const modelObjToCreate = modelconfI ? modelconfI : modelconfII ? modelconfII : ascconf;
          this.selectedModelObject = modelObjToCreate ? this.craeteModelObject(modelObjToCreate) : {};
        } else {
          this.notificationService.showToastrError('Alert', 'Exception occured');
          this.selectedModelObject = {};
          this.detailLoader = false;
        }

      }, err => {
        this.selectedModelObject = {};
        this.detailLoader = false;
        this.notificationService.showToastrError('Alert', 'Server error occured');
      });
    } else {
      this.selectedModelObject = {};
    }
  }


  deleteModelConfig() {
    let modelObjByModelType: any;
    this.global.opendisplayModal('Do you wish to delete this model configuration', 'Confirm', 'Delete Model Configuration', true)
      .subscribe(result => {
        if (result === 'save') {
          const modelconfigObj = this.craeteModelObject(this.selectedModelObject, true);
          if (modelconfigObj.jobType.toUpperCase() === 'ANOMALYTRAINING1') {
            modelObjByModelType = { anomalyI: modelconfigObj, anomalyII: null, asc: null, reponseMessage: '', responseType: 'CONF' };
          } else if (modelconfigObj.jobType.toUpperCase() === 'ANOMALYTRAINING2') {
            modelObjByModelType = { anomalyI: null, anomalyII: modelconfigObj, asc: null, reponseMessage: '', responseType: 'CONF' };
          } else {
            modelObjByModelType = { anomalyI: null, anomalyII: null, asc: modelconfigObj, reponseMessage: '', responseType: 'CONF' };
          }
          const data = { jobType: modelconfigObj.jobType, modelConfig: modelObjByModelType };
          this.anomalyService.deleteAnomalyModelConfig(data).subscribe((res: any) => {
            if (res && res.status === 'success' && res.data.deletedCount !== 0) {
              this.removeModelFromList(modelconfigObj);
            } else {
              this.notificationService.showToastrError('Alert', 'Exception occured');
            }
          }, err => {
            this.notificationService.showToastrError('Alert', 'Server error occured');
          });
        }
      });

  }

  removeModelFromList(modelObj) {
    const index = this.modelDetails.findIndex(it => it.modelConfigName === modelObj.modelConfigName);
    this.modelDetails.splice(index, 1);
    // if (this.modelDetails.length > 0) {
    //   const modelDetailsObj = Object.assign({}, this.modelDetails[0]);
    //   this.getModelConfigDetails(modelDetailsObj);

    // } else {
    //   this.getModelConfigDetails(null);
    // }
    this.clearSelection();
    this.showToastrSuccess('Success', 'Model deleted successfully.');
  }


  // on search
  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
    this.clearSelection();
  }
  // change page on input
  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
      // alert("Invalid page number")
    } else {
      this.config.currentPage = inputVal;
      this.clearSelection();
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
    this.clearSelection();
  }

  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.clearSelection();
  }


  showToastrSuccess(headText, msg) {
    this.toastr.success(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }

  // Info
  showToastrinfo(headText, msg) {
    this.toastr.info(msg, headText, {
      timeOut: 2500,
      positionClass: 'toast-bottom-right',
    });
  }


  checkifObjectExist(checkObj) {
    return checkObj && Object.keys(checkObj).length > 0 ? true : false;
  }

  navigateTo(navigationpath, modelDetails) {
    // this.router.navigate([navigationpath,{state:{name:'OPMAX'} }]);
    this.anomalyService.AnomalymodelName = modelDetails.modelName;
    this.anomalyService.AnomalymodelType = modelDetails.jobType;
    this.router.navigate(['/' + this.global.prefixUrl + navigationpath],
      { queryParams: { name: modelDetails.modelConfigName, type: modelDetails.jobType } });
    // { queryParams:  filter, skipLocationChange: true}

  }

  onFeatureTabChanged(evt) {
    if (evt.index === 0) {
      this.xFeatureSearch = '';
    } else if (evt.index === 1) {
      this.trainFilterSearch = '';
    } else if (evt.index === 2) {
      this.strFeatureSearch = '';
    }
  }

  ngOnDestroy() {
    this.anomalyService.AnomalyModel = false;
  }

  craeteModelObject(modelConfigObj, deleteObj?) {
    const newModelConfig = modelConfigObj ? Object.assign({}, modelConfigObj) : {};
    // tslint:disable-next-line:max-line-length
    newModelConfig.stringFeatures = modelConfigObj && modelConfigObj.stringFeatures && modelConfigObj.stringFeatures.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.stringFeatures]) : [];
    // tslint:disable-next-line:max-line-length
    newModelConfig.trainingFilter = modelConfigObj && modelConfigObj.trainingFilter && modelConfigObj.trainingFilter.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.trainingFilter]) : [];
    // tslint:disable-next-line:max-line-length
    newModelConfig.xfeatureList = modelConfigObj && modelConfigObj.xfeatureList && modelConfigObj.xfeatureList.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.xfeatureList]) : [];

    if (deleteObj) {
      if (!newModelConfig.stringFeaturesEnable) {
        delete newModelConfig.stringFeatures;
      }
      if (!newModelConfig.trainingFilterEnable) {
        delete newModelConfig.trainingFilter;
      }
      if (!newModelConfig.xfeatureListEnable) {
        delete newModelConfig.xfeatureList;
      }
      delete newModelConfig.stringFeaturesEnable;
      delete newModelConfig.trainingFilterEnable;
      delete newModelConfig.xfeatureListEnable;
    } else {
      newModelConfig.stringFeaturesEnable = modelConfigObj && modelConfigObj.stringFeatures ? true : false;
      newModelConfig.trainingFilterEnable = modelConfigObj && modelConfigObj.trainingFilter ? true : false;
      newModelConfig.xfeatureListEnable = modelConfigObj && modelConfigObj.xfeatureList ? true : false;

    }

    return Object.assign({}, newModelConfig);

  }

  createStrArrToObjArr(arrVal) {
    if (typeof arrVal[0] === 'string') {
      return arrVal.map(it => {
        return Object.assign({ name: it });
      });
    } else {
      return arrVal.map(it => it.name);
    }

  }


  checkkeyExist(keyArr, modelConfigObj) {
    // return Object.keys(modelConfigObj).some(it => it == key) ;
    if (modelConfigObj && Object.keys(modelConfigObj).length > 0) {
      return keyArr.every(item => modelConfigObj.hasOwnProperty(item));
    } else {
      return false;
    }

  }

  strTOArrVV(dataValue) {
    if (typeof dataValue === 'string') {
      return dataValue ? [dataValue] : [''];
    } else {
      let dataValStr = '';
      if (dataValue && dataValue.length > 0) {
        dataValue.forEach((it, i, arrList) => {
          if (i === (arrList.length - 1)) {
            dataValStr = dataValStr + ((it !== null && it !== undefined) ? it.toString() : '');
          } else {
            dataValStr = dataValStr + ((it !== null && it !== undefined) ? it.toString() : '') + ', ';
          }
        });
      }
      return dataValStr;
    }
  }

  createcommaStrToArr(dataValue) {
    if (typeof dataValue === 'string') {
      dataValue = dataValue.replace(this.regexAllSpace, '');
      return dataValue.split(',');
    } else {
      let dataValStr = '';
      if (dataValue && dataValue.length > 0) {
        dataValue.forEach((it, i, arrList) => {
          if (i === (arrList.length - 1)) {
            dataValStr = dataValStr + ((it !== null && it !== undefined) ? it.toString() : '');
          } else {
            dataValStr = dataValStr + ((it !== null && it !== undefined) ? it.toString() : '') + ', ';
          }
        });
      }
      return dataValStr;
    }
  }

  sort(key) {
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
    this.clearSelection();
  }
  clearSelection() {
    this.selModelObj = {};
    this.selectedModelObject = {};
  }
}
