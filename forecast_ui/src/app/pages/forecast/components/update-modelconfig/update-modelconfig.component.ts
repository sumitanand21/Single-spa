import { Component, OnInit, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { ForecastService } from '../../services/forecast.service';
import { NotificationService } from 'src/app/services/notification.service';
@Component({
  selector: 'app-update-modelconfig',
  templateUrl: './update-modelconfig.component.html',
  styleUrls: ['./update-modelconfig.component.scss']
})
export class UpdateModelconfigComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('modeledit', { static: true }) public modelEditFrm: NgForm;
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  maskNumregex: any = new RegExp(/^[0-9]+\,\s[0-9]+$/);
  // maskNumregexNoLimit: any = new RegExp(/^[0-9]+(\,\s[0-9]+)+$/);
  maskNumregexNoLimit: any = new RegExp(/^([0-9]*[1-9]+[0-9]*)+(\,\s([0-9]*[1-9]+[0-9]*)+)*$/);

  // maskL1l2Numregex: any = new RegExp(/(?:0*(?:\.\d+|,)?|1(\.0*)?)/);
  // maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?|1(\.0+)?)(\, )(?:0*(?:\.\d+)?|1(\.0+)?)$/);
  maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?)(\, )(?:0*(?:\.\d+)?)$/);
  saveDisable = true;
  scalarTypeDD = [];
  EncoderTypeDD = [];
  optimizerDD = [];
  metricsDD = [];
  lossDD = [];
  lstmTypeDD = [];
  cnnActivationDD = [];
  convActivationDD = [];
  lstmActivationDD = [];
  fcnActivationDD = [];
  lstmDetails = {};
  isLoading = true;
  innerActivationDD = [];
  activationDD = [];
  defaultJobType = 'FORECASTEXECUTION';
  modelConfigName = '';
  displayObj = this.defaultDispObjEnable(true);
  modelObject: any = Object.assign({}, this.craeteModelObject(null));
  // modelConfigPath = this.forecastService.activatedPath.replace('/updateconfig', '');
  modelConfigPath = this.forecastService.activatedPath.replace(/\/updateconfig.*$/, '');

  constructor(
    public global: GlobalService,
    public forecastService: ForecastService,
    public cdRef: ChangeDetectorRef,
    private notify: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.forecastService.activatedPath = this.modelConfigPath;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.forecastService.ForecastmodelName = queryParams.name ? queryParams.name : '';
      this.modelConfigName = this.forecastService.ForecastmodelName;
    });
  }

  ngOnInit() {
    this.modelEditFrm.form.markAsPristine();
    this.forecastService.ForecastModel = true;
    this.forecastService.ForeCastUpdateModel = true;
    this.getModelDropDownDetails();
  }

  getModelDropDownDetails() {
    this.isLoading = true;
    const data = { jobType: this.defaultJobType };
    this.forecastService.getConfigurationModelConfig(data).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success' && res.data && res.data.length > 0) {
        const modelconfDD = res.data[0];
        this.setAllDropDown(modelconfDD);
      } else {
        this.isLoading = false;
        this.setAllDropDown(null);
        this.notify.showToastrWarning('Alert', 'Exception occured');

      }
    }, err => {
      this.isLoading = false;
      this.setAllDropDown(null);
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  setAllDropDown(modelconfDD) {

    this.lstmTypeDD = modelconfDD && modelconfDD.lstmType ? modelconfDD.lstmType : [];

    this.scalarTypeDD = modelconfDD && modelconfDD.scaler ? modelconfDD.scaler : [];
    this.EncoderTypeDD = modelconfDD && modelconfDD.encoder ? modelconfDD.encoder : [];
    this.optimizerDD = modelconfDD && modelconfDD.optimizer ? modelconfDD.optimizer : [];
    this.metricsDD = modelconfDD && modelconfDD.metrics ? modelconfDD.metrics : [];
    this.lossDD = modelconfDD && modelconfDD.loss ? modelconfDD.loss : [];
    this.activationDD = modelconfDD && modelconfDD.activation ? modelconfDD.activation : [];
    // this.innerActivationDD = modelconfDD && modelconfDD.inneractivation ? modelconfDD.inneractivation : [];
    this.cnnActivationDD = modelconfDD && modelconfDD.cnnActivation ? modelconfDD.cnnActivation : [];
    this.convActivationDD = modelconfDD && modelconfDD.convActivation ? modelconfDD.convActivation : [];
    this.lstmActivationDD = modelconfDD && modelconfDD.lstmActivation ? modelconfDD.lstmActivation : [];
    this.fcnActivationDD = modelconfDD && modelconfDD.fcnActivation ? modelconfDD.fcnActivation : [];

    this.lstmDetails = modelconfDD && modelconfDD.lstmDetails ? modelconfDD.lstmDetails : {};
    if (modelconfDD !== null) {
      this.getModelConfigData();
    }
  }


  getModelConfigData() {
    this.isLoading = true;
    if (this.modelConfigName) {
      const data = { jobType: this.defaultJobType, modelConfig: this.modelConfigName };
      this.forecastService.getModelConfigDetails(data).subscribe((res: any) => {
        this.isLoading = false;
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          const modelconf = res.data;
          this.modelObject = this.craeteModelObject(modelconf);
          const lstmType = modelconf && modelconf.lstmType ? modelconf.lstmType : '';
          if (lstmType) {
            this.lstmChangeEnableConfigs(lstmType);
          }
        }
      }, err => {
        this.isLoading = false;
        this.notify.showToastrError('Alert', 'Server error occured');
      });
    } else {
      this.isLoading = false;
      this.modelObject = this.craeteModelObject(null);
    }
  }


  navigateTo(navigationpath, addPrefix?) {
    if (addPrefix) {
      this.router.navigate(['/' + this.global.prefixUrl + navigationpath]);
    } else {
      this.router.navigate([navigationpath]);
    }

  }

  deleteModelConfig() {
    this.global.opendisplayModal('Do you wish to delete this model configuration',
      'Confirm', 'Delete Model Configuration', true).subscribe(result => {
        if (result === 'save') {
          const modelconfigObj = this.reponseObjectForAPI(this.modelObject);
          const data = { jobType: this.defaultJobType, modelConfig: modelconfigObj };
          this.forecastService.deleteModelConfigDetails(data).subscribe((res: any) => {
            if (res && res.status === 'success' && res.data.deletedCount !== 0) {
              this.notify.showToastrSuccess('Success', 'Model deleted successfully.');
              this.navigateTo(this.modelConfigPath);
            } else {
              this.notify.showToastrWarning('Alert', 'Exception occured');
            }

          }, err => {
            this.notify.showToastrError('Alert', 'Server error occured');
          });
        }
      });

  }

  saveModelDetails() {

    if (this.modelEditFrm.invalid) {
      this.global.opendisplayModal('Please provide all the model details', 'OK', 'Alert');
      // this.notify.showToastrWarning('Alert', 'Please provide all the model details.');
    } else if (this.modelObject.modelConfigName.length < 3) {
      this.global.opendisplayModal('Name provided should be atleast 3 characters long', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(this.modelObject.modelConfigName)) {
      this.global.opendisplayModal('Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (this.displayObj.blockUnits && this.modelObject.blockUnits < 1) {
      this.global.opendisplayModal('Block Unit value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.batchSize && this.modelObject.batchSize < 1) {
      this.global.opendisplayModal('Batch Size value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.epochs && this.modelObject.epochs < 1) {
      this.global.opendisplayModal('Epochs value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.layers && !this.maskNumregexNoLimit.test(this.modelObject.layers)) {
      this.global.opendisplayModal('Layer value should be in format 0, 0, ... and should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.dropout && this.modelObject.dropout < 0 || this.modelObject.dropout >= 1) {
      this.global.opendisplayModal('Drop Out value should be between 0 and 0.9', 'OK', 'Alert');
    } else if (this.displayObj.l1L2 && !this.maskL1l2Numregex.test(this.modelObject.l1L2)) {
      // tslint:disable-next-line:max-line-length
      this.global.opendisplayModal('L1, L2 value should be in format 0.0, 0.0 and should be in the range (0.0 - 0.9), (0.0 - 0.9)', 'OK', 'Alert');
    } else if (this.displayObj.nlags && this.modelObject.nlags < 1) {
      this.global.opendisplayModal('nLags value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.nleads && this.modelObject.nleads < 1) {
      this.global.opendisplayModal('nLeads value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.testSize && this.modelObject.testSize < 0 || this.modelObject.testSize >= 1) {
      this.global.opendisplayModal('Test Size value should be between 0 and 0.9', 'OK', 'Alert');
    } else if (this.displayObj.resetWeights && this.modelObject.resetWeights < 1) {
      this.global.opendisplayModal('Reset Weights value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.encLayers && !this.maskNumregexNoLimit.test(this.modelObject.encLayers)) {
      this.global.opendisplayModal('ENC Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else if (this.displayObj.decLayers && !this.maskNumregexNoLimit.test(this.modelObject.decLayers)) {
      this.global.opendisplayModal('DEC Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else if (this.displayObj.cnnLayers && !this.maskNumregexNoLimit.test(this.modelObject.cnnLayers)) {
      this.global.opendisplayModal('CNN Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else if (this.displayObj.convLayers && !this.maskNumregexNoLimit.test(this.modelObject.convLayers)) {
      this.global.opendisplayModal('Conv Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else if (this.displayObj.lstmLayers && !this.maskNumregexNoLimit.test(this.modelObject.lstmLayers)) {
      this.global.opendisplayModal('Lstm Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else if (this.displayObj.filters && this.modelObject.filters < 1) {
      this.global.opendisplayModal('Filters value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.kernelSize && this.modelObject.kernelSize < 1) {
      this.global.opendisplayModal('Kernel Size value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.poolsize && this.modelObject.poolsize < 1) {
      this.global.opendisplayModal('Pool Size value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.fcnLayers && !this.maskNumregexNoLimit.test(this.modelObject.fcnLayers)) {
      this.global.opendisplayModal('FNC Layers value should be in format 0, 0, ... and should be greater than or equal to 1',
        'OK', 'Alert');
    } else {
      if (this.modelConfigName) {
        this.UpdateModelConfig();
      } else {
        this.createModelConfig();
      }

    }
  }

  createModelConfig() {
    const modelconfigObj = this.reponseObjectForAPI(this.modelObject);
    const modelConfreq = { forecastModelConfig: modelconfigObj, reponseMessage: '', responseType: 'CONF' };
    const data = { jobType: this.defaultJobType, modelConfig: modelConfreq };
    this.forecastService.createModelConfigDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data.responseType !== 'ERR') {
        this.notify.showToastrSuccess('Success', 'Model created successfully.');
        this.navigateTo(this.modelConfigPath);
      } else if (res && res.status === 'success' && res.data.responseType === 'ERR') {
        this.notify.showToastrWarning('Alert', res.data.reponseMessage);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
      }
    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }

  reponseObjectForAPI(modelObject) {
    const respObj = {};
    Object.keys(modelObject).forEach(it => {
      if (this.displayObj[it]) {
        respObj[it] = modelObject[it];
      } else {
        respObj[it] = '';
      }
    });
    return respObj;
  }

  UpdateModelConfig() {
    const modelconfigObj = this.reponseObjectForAPI(this.modelObject);
    const modelConfreq = { forecastModelConfig: modelconfigObj, reponseMessage: '', responseType: 'CONF' };
    const data = { jobType: this.defaultJobType, modelConfig: modelConfreq };
    this.forecastService.UpdateModelConfigDetails(data).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data.responseType !== 'ERR') {
        this.modelConfigName = this.modelObject.modelConfigName;
        this.forecastService.ForecastmodelName = this.modelConfigName;
        this.notify.showToastrSuccess('Success', 'Model updated successfully.');
        this.modelEditFrm.form.markAsPristine();
        this.navigateTo(this.modelConfigPath);
      } else if (res && res.status === 'success' && res.data.responseType === 'ERR') {
        this.notify.showToastrWarning('Alert', res.data.reponseMessage);
      } else {
        this.notify.showToastrWarning('Alert', 'Exception occured');
      }

    }, err => {
      this.notify.showToastrError('Alert', 'Server error occured');
    });
  }


  ngAfterViewChecked() {
    this.cdRef.detectChanges();
    // if (this.modelEditFrm.dirty) {
    //   this.saveDisable = false;
    // } else {
    //   this.saveDisable = true;
    // }

  }

  ngOnDestroy(): void {
    this.forecastService.ForecastmodelName = '';
    this.forecastService.ForecastModel = false;
    this.forecastService.ForeCastUpdateModel = false;
  }


  craeteModelObject(modelConfigObj) {
    const newModelConfig = {
      id: modelConfigObj && modelConfigObj.id ? modelConfigObj.id : '',
      modelConfigName: modelConfigObj && modelConfigObj.modelConfigName ? modelConfigObj.modelConfigName : '',
      blockUnits: modelConfigObj && modelConfigObj.blockUnits ? modelConfigObj.blockUnits : '',
      batchSize: modelConfigObj && modelConfigObj.batchSize ? modelConfigObj.batchSize : '',
      epochs: modelConfigObj && modelConfigObj.epochs ? modelConfigObj.epochs : '',
      layers: modelConfigObj && modelConfigObj.layers ? modelConfigObj.layers : '',
      dropout: modelConfigObj && modelConfigObj.dropout ? modelConfigObj.dropout : '',
      activation: modelConfigObj && modelConfigObj.activation ? modelConfigObj.activation : this.activationDD[0],
      loss: modelConfigObj && modelConfigObj.loss ? modelConfigObj.loss : this.lossDD[0],
      metrics: modelConfigObj && modelConfigObj.metrics ? modelConfigObj.metrics : this.metricsDD[0],
      optimizer: modelConfigObj && modelConfigObj.optimizer ? modelConfigObj.optimizer : this.optimizerDD[0],
      stateful: modelConfigObj && modelConfigObj.stateful ? modelConfigObj.stateful : 'True',
      l1L2: modelConfigObj && modelConfigObj.l1L2 ? this.setMaskNumVal(modelConfigObj.l1L2) : '',
      nlags: modelConfigObj && modelConfigObj.nlags ? modelConfigObj.nlags : '',
      nleads: modelConfigObj && modelConfigObj.nleads ? modelConfigObj.nleads : '',
      exclude: modelConfigObj && modelConfigObj.exclude ? modelConfigObj.exclude : 'None',
      groupBy: modelConfigObj && modelConfigObj.groupBy ? modelConfigObj.groupBy : 'None',
      // timeStep: modelConfigObj && modelConfigObj.timeStep ? modelConfigObj.timeStep : '',
      encoderType: modelConfigObj && modelConfigObj.encoderType ? modelConfigObj.encoderType : this.EncoderTypeDD[0],
      scalerType: modelConfigObj && modelConfigObj.scalerType ? modelConfigObj.scalerType : this.scalarTypeDD[0],
      testSize: modelConfigObj && modelConfigObj.testSize ? modelConfigObj.testSize : '',
      resetWeights: modelConfigObj && modelConfigObj.resetWeights ? modelConfigObj.resetWeights : '',
      encLayers: modelConfigObj && modelConfigObj.encLayers ? modelConfigObj.encLayers : '',
      decLayers: modelConfigObj && modelConfigObj.decLayers ? modelConfigObj.decLayers : '',
      cnnActivation: modelConfigObj && modelConfigObj.cnnActivation ? modelConfigObj.cnnActivation : '',
      convActivation: modelConfigObj && modelConfigObj.convActivation ? modelConfigObj.convActivation : '',
      lstmActivation: modelConfigObj && modelConfigObj.lstmActivation ? modelConfigObj.lstmActivation : '',
      cnnLayers: modelConfigObj && modelConfigObj.cnnLayers ? modelConfigObj.cnnLayers : '',
      convLayers: modelConfigObj && modelConfigObj.convLayers ? modelConfigObj.convLayers : '',
      lstmLayers: modelConfigObj && modelConfigObj.lstmLayers ? modelConfigObj.lstmLayers : '',
      filters: modelConfigObj && modelConfigObj.filters ? modelConfigObj.filters : '',
      kernelSize: modelConfigObj && modelConfigObj.kernelSize ? modelConfigObj.kernelSize : '',
      poolsize: modelConfigObj && modelConfigObj.poolsize ? modelConfigObj.poolsize : '',
      fcnActivation: modelConfigObj && modelConfigObj.fcnActivation ? modelConfigObj.fcnActivation : '',
      fcnLayers: modelConfigObj && modelConfigObj.fcnLayers ? modelConfigObj.fcnLayers : '',
      lstmType: modelConfigObj && modelConfigObj.lstmType ? modelConfigObj.lstmType : '',
      jobType: this.defaultJobType,
      // modelType: this.defaultModelType
    };
    return Object.assign({}, newModelConfig);
  }

  setMaskNumVal(Value) {
    const splitVal = Value.split(',');
    const First = splitVal[0].trim();
    const Second = splitVal.length > 1 ? splitVal[1].trim() : '';
    return Second ? (First + ', ' + Second) : First;

  }



  defaultDispObjEnable(enable?) {
    return {
      id: true,
      modelConfigName: true,
      blockUnits: enable ? true : false,
      batchSize: enable ? true : false,
      epochs: enable ? true : false,
      layers: enable ? true : false,
      dropout: enable ? true : false,
      activation: enable ? true : false,
      loss: enable ? true : false,
      metrics: enable ? true : false,
      optimizer: enable ? true : false,
      stateful: enable ? true : false,
      l1L2: enable ? true : false,
      nlags: enable ? true : false,
      nleads: enable ? true : false,
      exclude: enable ? true : false,
      groupBy: enable ? true : false,

      encoderType: enable ? true : false,
      scalerType: enable ? true : false,
      testSize: enable ? true : false,
      resetWeights: enable ? true : false,
      encLayers: enable ? true : false,
      decLayers: enable ? true : false,
      cnnActivation: enable ? true : false,
      convActivation: enable ? true : false,
      lstmActivation: enable ? true : false,
      cnnLayers: enable ? true : false,
      convLayers: enable ? true : false,
      lstmLayers: enable ? true : false,
      filters: enable ? true : false,
      kernelSize: enable ? true : false,
      poolsize: enable ? true : false,
      fcnActivation: enable ? true : false,
      fcnLayers: enable ? true : false,
      lstmType: true,
      jobType: true
    };
  }

  lstmChangeEnableConfigs(lstmType) {
    if (lstmType) {
      const lstmDet = this.lstmDetails && this.lstmDetails[lstmType] ? this.lstmDetails[lstmType] : [];
      const enabledConfigs = {};
      lstmDet.forEach(it => {
        if (this.displayObj.hasOwnProperty(it)) {
          enabledConfigs[it] = true;
        }

      });
      const defaultObj: any = this.defaultDispObjEnable();
      this.displayObj = Object.assign({ ...defaultObj, ...enabledConfigs });
      console.log(this.displayObj);
    } else {
      this.displayObj = this.defaultDispObjEnable(true);
    }

  }

}

