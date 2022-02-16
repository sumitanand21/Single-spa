import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AnomalyService } from '../../services/anomaly.service';
import { ToastrService } from 'ngx-toastr';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-upsert-anomaly-model-config',
  templateUrl: './upsert-anomaly-model-config.component.html',
  styleUrls: ['./upsert-anomaly-model-config.component.scss']
})
export class UpsertAnomalyModelConfigComponent implements OnInit, OnDestroy {
  isNodeValueChanged = false;
  regexAllSpace = new RegExp(/\s/, 'g');
  // maskNumregexNoLimit: any = new RegExp(/^[0-9]+(\,\s[0-9]+)+$/);
  maskNumregexNoLimit: any = new RegExp(/^(0*((1+[0-9]+)|([2-9]+[0-9]*)))+(\,\s(0*((1+[0-9]+)|([2-9]+[0-9]*))))*$/);
  masterData = undefined;
  requiredFeilds = [];
  key = 'name';
  reverse = false;
  maskNumregex: any = new RegExp(/^[0-9]+\,\s[0-9]+$/);
  // maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?|1(\.0+)?)(\, )(?:0*(?:\.\d+)?|1(\.0+)?)$/);
  maskL1l2Numregex: any = new RegExp(/^(?:0*(?:\.\d+)?)(\, )(?:0*(?:\.\d+)?)$/);
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  isActionTaken = false;
  isXfeaturesSelected = 0;
  isTrainingFilterSeleceted = 0;
  isStringFeatureSelected = 0;
  modelConfigName;
  jobTypeArr = ['ANOMALYTRAINING1', 'ANOMALYTRAINING2', 'ASCTRAINING'];
  selectedModel;
  modelConfigTempName = '';
  modelConfId = '';
  encoders;
  scalers;
  optimizers;
  activations;
  // tslint:disable-next-line:variable-name
  decoder_Activations;
  losses;
  selectAll = false;
  stringselectAll = false;
  uniqueselectAll = false;
  checked: boolean;
  metrics;
  datasets;
  uniqueFeatures;
  expression = false;
  editDays: any;
  all: any;
  modelconfBuffer;
  //  startPageIndex: any = 0;
  //  endPageIndex: any = 5;
  xfeatures: any[] = [];
  sfeatures: any[] = [];
  tfeatures: any[] = [];
  nodeListLength = 0;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPageX = this.defauultItempg;
  inputCurrentpageX = this.defaultCurrentPage;
  itemPerPageT = this.defauultItempg;
  inputCurrentpageT = this.defaultCurrentPage;
  itemPerPageS = this.defauultItempg;
  inputCurrentpageS = this.defaultCurrentPage;
  searchFilterX = '';
  searchFilterT = '';
  searchFilterS = '';
  selecteddata = '1';
  masterDataLoading = true;
  createFormLoader = true;
  pageArr = [25, 50, 100];
  configXFeature = {
    id: 'XFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };

  configTFeature = {
    id: 'TFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };

  configSFeature = {
    id: 'SFeature',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };



  displayObj = this.defaultDispObjEnable(false);
  upsertAnmModel = new FormGroup({
    id: new FormControl(),
    modelConfigName: new FormControl(),
    jobType: new FormControl(),
    encoder: new FormControl(),
    scaler: new FormControl(),
    optimizer: new FormControl(),
    activation: new FormControl(),
    decoder_activation: new FormControl(),
    loss: new FormControl(),
    epochs: new FormControl(),
    p_components: new FormControl(),
    dropout: new FormControl(),
    l1L2: new FormControl(),
    batchSize: new FormControl(),
    metrics: new FormControl(),
    krange: new FormControl(),
    desiredVariance: new FormControl(),
    nodes: new FormControl(),
    dataSetName: new FormControl(),
    trainingFilter: new FormControl(),
    xfeatureList: new FormControl(),
    uniqueFeature: new FormControl(),
    stringFeatures: new FormControl()
  });
  action;
  nodeList = [];
  // modelConfigPath = this.anomalyService.activatedPath.replace('/upsertmodelconfig', '');
  modelConfigPath = this.anomalyService.activatedPath.replace(/\/upsertmodelconfig.*$/, '');


  constructor(
    private formBuilder: FormBuilder,
    public anomalyService: AnomalyService,
    private notfyService: NotificationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public global: GlobalService
  ) {
    this.anomalyService.activatedPath = this.modelConfigPath;
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this.anomalyService.AnomalymodelName = queryParams.name ? queryParams.name : '';
      this.anomalyService.AnomalymodelType = queryParams.type ? queryParams.type : '';
    });

  }

  ngOnInit() {
    this.anomalyService.AnomalyModel = true;
    this.anomalyService.AnomalyUpdateModel = true;
    if (this.anomalyService.AnomalymodelName &&
      this.anomalyService.AnomalymodelType) {
      this.action = 'Update';
    } else {
      this.action = 'Create';
    }
    this.getMasterData();
  }

  getMasterData() {
    const data = {
      jobType: this.action === 'Update' ?
        this.anomalyService.AnomalymodelType : this.jobTypeArr[0]
    };
    this.masterDataLoading = true;
    // const JobType = { jobType: 'ANOMALY DETECTION' };
    this.anomalyService.getAnmMdConfigurations(data).subscribe((res: any) => {
      this.masterDataLoading = false;
      if (res.status === 'success') {
        this.masterData = res.data[0];
        this.setInitialMasterData(data.jobType);
      } else {
        this.createFormLoader = false;
      }

    }, (error) => {
      this.createFormLoader = false;
      this.masterDataLoading = false;
    });
  }




  setInitialMasterData(jobType) {
    this.encoders = this.masterData.enoders ? this.masterData.enoders : [];
    this.scalers = this.masterData.scalers ? this.masterData.scalers : [];
    this.losses = this.masterData.losses ? this.masterData.losses : [];
    this.optimizers = this.masterData.optimizers ? this.masterData.optimizers : [];
    this.activations = this.masterData.activations ? this.masterData.activations : [];
    this.decoder_Activations = this.masterData.decoder_activations ? this.masterData.decoder_activations : [];
    this.metrics = this.masterData.metrics ? this.masterData.metrics : [];

    if (this.action === 'Update') {
      this.getModelConfigDetails({
        jobType: this.anomalyService.AnomalymodelType,
        modelConfigName: this.anomalyService.AnomalymodelName
      });

    } else {
      this.getDataSetByJobType(jobType, true);
    }
  }


  getDataSetByJobType(jobType, initialLoad?, dataSetname?) {
    this.createFormLoader = true;
    this.requiredFeilds = [];
    if (this.masterData && this.masterData.mappings && this.masterData.mappings[jobType]) {
      this.requiredFeilds = [...this.masterData.mappings[jobType]];
      // this.masterDataSetNames = this.masterData.anomalyI.datasetName;
      // this.datasets = Object.keys(this.masterData.anomalyI.datasetName).map((key) => key);
    }
    const data = {
      jobType
    };
    let dataSetNm = dataSetname ? dataSetname : null;
    // const JobType = { jobType: 'ANOMALY DETECTION' };
    this.anomalyService.getAnomalyDataSets(data).subscribe((res: any) => {
      if (res.status === 'success') {
        this.datasets = res.data && res.data.data ? res.data.data : [];
        dataSetNm = dataSetNm ? dataSetNm : (this.datasets.length ? this.datasets[0] : null);
        this.setDataSetUniqueFeatures(dataSetNm, jobType, initialLoad);
      } else {
        this.datasets = [];
        this.setDataSetUniqueFeatures(dataSetNm, jobType, initialLoad);
      }

    }, (error) => {
      this.datasets = [];
      this.setDataSetUniqueFeatures(dataSetNm, jobType, initialLoad);
    });
  }

  setDataSetUniqueFeatures(dataSetName, jobType?, initialLoad?) {
    this.xfeatures = [];
    this.tfeatures = [];
    this.sfeatures = [];
    this.uniqueFeatures = [];
    this.selectAll = false;
    this.uniqueselectAll = false;
    this.stringselectAll = false;
    this.resetAllFeature();
    if (dataSetName) {
      const data = { dataSetName };
      this.anomalyService.getAnomalyDataSetFeatures(data).subscribe((res: any) => {
        this.isActionTaken = false;
        if (res.status === 'success') {
          const resData = res.data && res.data.data ? res.data.data : null;
          const fetaureListMap = resData && resData.length ?
            [...resData] : [];
          this.uniqueFeatures = [...fetaureListMap];
          const features = this.createFeatureList(this.uniqueFeatures);
          this.xfeatures = [...features];
          this.sfeatures = [...features];
          this.tfeatures = [...features];
          if (initialLoad) {
            this.createForm(jobType, dataSetName);
          } else {
            this.setFearureOnReuiredFeild();
            this.createFormLoader = false;
            this.upsertAnmModel.controls.uniqueFeature.setValue(this.uniqueFeatures[0]);
            // this.setInitialDataToForm(jobType);
          }
          // else {
          //   this.upsertAnmModel.controls.uniqueFeature.setValue(this.uniqueFeatures[0]);
          // }
        } else {
          if (initialLoad) {
            this.createForm(jobType, dataSetName);
          } else {
            this.setFearureOnReuiredFeild();
            this.createFormLoader = false;
            this.upsertAnmModel.controls.uniqueFeature.setValue('');
            // this.setInitialDataToForm(jobType);
          }
        }
      }, (error) => {
        this.isActionTaken = false;
        if (initialLoad) {
          this.createForm(jobType, dataSetName);
        } else {
          this.setFearureOnReuiredFeild();
          this.createFormLoader = false;
          this.upsertAnmModel.controls.uniqueFeature.setValue('');
          // this.setInitialDataToForm(jobType);
        }
        this.notfyService.showToastrError('Alert', 'Server error occured');
      });

    } else {
      if (initialLoad) {
        this.createForm(jobType, dataSetName);
      } else {
        this.upsertAnmModel.controls.uniqueFeature.setValue('');
        // this.setInitialDataToForm(jobType);
      }
    }
  }

  defaultDispObjEnable(enable?) {
    return {
      id: true,
      modelConfigName: true,
      jobType: true,
      encoder: enable ? true : false,
      scaler: enable ? true : false,
      optimizer: enable ? true : false,
      activation: enable ? true : false,
      decoder_activation: enable ? true : false,
      dropout: enable ? true : false,
      l1L2: enable ? true : false,
      batchSize: enable ? true : false,
      metrics: enable ? true : false,
      krange: enable ? true : false,
      desiredVariance: enable ? true : false,
      nodes: enable ? true : false,
      dataSetName: enable ? true : false,
      trainingFilter: enable ? true : false,
      xfeatureList: enable ? true : false,
      uniqueFeature: enable ? true : false,
      stringFeatures: enable ? true : false,
      loss: enable ? true : false,
      epochs: enable ? true : false,
      p_components: enable ? true : false,
    };
  }

  createForm(jobType, dataSetName?) {
    if (this.upsertAnmModel &&
      this.upsertAnmModel.controls &&
      this.upsertAnmModel.controls.modelConfigName.value &&
      this.upsertAnmModel.controls.modelConfigName.value !== '') {
      this.modelConfigTempName = this.modelConfigTempName;
    }
    const selectDataSet = dataSetName ? dataSetName :
      (this.datasets && this.datasets.length && this.datasets.length > 0 ? this.datasets[0] : '');
    const selectEncoder = this.encoders && this.encoders.length && this.encoders.length > 0 ? this.encoders[0] : '';
    const selectScaler = this.scalers && this.scalers.length && this.scalers.length > 0 ? this.scalers[0] : '';
    const selectOptimizers = this.optimizers && this.optimizers.length && this.optimizers.length > 0 ? this.optimizers[0] : '';
    const selectActivations = this.activations && this.activations.length && this.activations.length > 0 ? this.activations[0] : '';
    const selectDecoderActivations = this.decoder_Activations
      && this.decoder_Activations.length && this.decoder_Activations.length > 0 ? this.decoder_Activations[0] : '';
    const selectUniqueFeatures = this.uniqueFeatures
      && this.uniqueFeatures.length && this.uniqueFeatures.length > 0 ? this.uniqueFeatures[0] : '';
    const selectLosses = this.losses && this.losses.length && this.losses.length > 0 ? this.losses[0] : '';

    if (jobType) {
      const enabledConfigs = {};
      this.requiredFeilds.forEach(it => {
        if (this.displayObj.hasOwnProperty(it)) {
          enabledConfigs[it] = true;
        }

      });
      const defaultObj: any = this.defaultDispObjEnable();
      this.displayObj = Object.assign({ ...defaultObj, ...enabledConfigs });
    } else {
      this.displayObj = this.defaultDispObjEnable(true);
    }

    // this.sfeatures = [];

    this.upsertAnmModel = this.formBuilder.group({
      id: this.modelConfId,
      modelConfigName: [this.modelConfigTempName, Validators.required],
      jobType: [jobType, Validators.required],
      encoder: this.displayObj.encoder ? [selectEncoder, Validators.required] : '',
      scaler: this.displayObj.scaler ? [selectScaler, Validators.required] : '',
      optimizer: this.displayObj.optimizer ? [selectOptimizers, Validators.required] : '',
      activation: this.displayObj.activation ? [selectActivations, Validators.required] : '',
      decoder_activation: this.displayObj.decoder_activation ? [selectDecoderActivations, Validators.required] : '',
      dropout: this.displayObj.dropout ? ['', Validators.required] : '',
      l1L2: this.displayObj.l1L2 ? ['', Validators.required] : '',
      krange: this.displayObj.krange ? ['', Validators.required] : '',
      desiredVariance: this.displayObj.desiredVariance ? ['', Validators.required] : '',
      batchSize: this.displayObj.batchSize ? ['', Validators.required] : '',
      metrics: this.displayObj.metrics ? [this.metrics[0], Validators.required] : '',
      nodes: this.displayObj.nodes ? [[], Validators.required] : [[]],
      dataSetName: this.displayObj.dataSetName ? [selectDataSet, Validators.required] : '',
      trainingFilter: '',
      xfeatureList: '',
      uniqueFeature: this.displayObj.uniqueFeature ? [selectUniqueFeatures, Validators.required] : '',
      stringFeatures: '',
      loss: this.displayObj.loss ? [this.losses[0], Validators.required] : '',
      epochs: this.displayObj.epochs ? ['', Validators.required] : '',
      p_components: this.displayObj.p_components ? ['', Validators.required] : '',
    });

    this.nodeList = this.upsertAnmModel.controls.nodes.value;
    this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
    this.setFearureOnReuiredFeild();
    if (this.action === 'Update') {
      this.setInitialDataToForm(jobType);
    }

    this.createFormLoader = false;

    // this.setFormControls({ value: jobType });
  }

  setFearureOnReuiredFeild() {
    if (!this.displayObj.xfeatureList) {
      this.xfeatures = [];
    }
    if (!this.displayObj.trainingFilter) {
      this.tfeatures = [];
    }

    if (!this.displayObj.stringFeatures) {
      this.sfeatures = [];
    }
  }

  // setFormControls(event, anyAction?) {
  //   const jobType = event.value;
  //   if (anyAction) {
  //     this.nodeList = [];
  //     this.setInitialMasterData(jobType);
  //   }

  //   if (jobType === 'ANOMALYTRAINING1') {
  //     this.upsertAnmModel.controls.optimizer.enable();
  //     this.upsertAnmModel.controls.activation.enable();
  //     this.upsertAnmModel.controls.decoder_activation.enable();
  //     this.upsertAnmModel.controls.dropout.enable();
  //     this.upsertAnmModel.controls.l1L2.enable();
  //     this.upsertAnmModel.controls.batchSize.enable();
  //     this.upsertAnmModel.controls.metrics.enable();
  //     this.upsertAnmModel.controls.nodes.enable();

  //     this.upsertAnmModel.controls.epochs.enable();
  //     this.upsertAnmModel.controls.p_components.disable();
  //   } else if (jobType === 'ANOMALYTRAINING2') {

  //     this.upsertAnmModel.controls.optimizer.disable();
  //     this.upsertAnmModel.controls.activation.disable();
  //     this.upsertAnmModel.controls.decoder_activation.disable();
  //     this.upsertAnmModel.controls.dropout.disable();
  //     this.upsertAnmModel.controls.l1L2.disable();
  //     this.upsertAnmModel.controls.batchSize.disable();
  //     this.upsertAnmModel.controls.metrics.disable();
  //     this.upsertAnmModel.controls.nodes.disable();
  //     this.upsertAnmModel.controls.epochs.disable();

  //     this.upsertAnmModel.controls.p_components.enable();
  //   }

  // }

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

  setInitialDataToForm(jobType) {
    const model = this.modelconfBuffer[jobType];
    this.modelconfBuffer = null;
    if (model) {
      // this.upsertAnmModel.controls.id.setValue(model.id ? model.id : '');
      this.upsertAnmModel.controls.modelConfigName.setValue(model.modelConfigName);
      this.upsertAnmModel.controls.jobType.setValue(model.jobType ? model.jobType : '');
      this.upsertAnmModel.controls.encoder.setValue(model.encoder ? model.encoder : '');
      this.upsertAnmModel.controls.scaler.setValue(model.scaler ? model.scaler : '');
      this.upsertAnmModel.controls.dataSetName.setValue(model.dataSetName ? model.dataSetName : '');
      this.upsertAnmModel.controls.uniqueFeature.setValue(model.uniqueFeature ? model.uniqueFeature : '');
      this.upsertAnmModel.controls.loss.setValue(model.loss ? model.loss : '');
      this.upsertAnmModel.controls.optimizer.setValue(model.optimizer ? model.optimizer : '');
      this.upsertAnmModel.controls.activation.setValue(model.activation ? model.activation : '');
      this.upsertAnmModel.controls.decoder_activation.setValue(model.decoder_activation ? model.decoder_activation : '');
      this.upsertAnmModel.controls.dropout.setValue(model.dropout ? model.dropout : '');
      this.upsertAnmModel.controls.l1L2.setValue(model.l1L2 && model.l1L2.length ? this.createcommaStrToArr(model.l1L2) : '');
      this.upsertAnmModel.controls.krange.setValue(model.krange && model.krange.length ? this.createcommaStrToArr(model.krange) : '');
      this.upsertAnmModel.controls.desiredVariance.setValue(model.desiredVariance ? model.desiredVariance : '');
      this.upsertAnmModel.controls.batchSize.setValue(model.batchSize ? model.batchSize : '');
      this.upsertAnmModel.controls.metrics.setValue(model.metrics && model.metrics.length ? model.metrics[0] : '');
      this.upsertAnmModel.controls.nodes.setValue(model.nodes ? model.nodes : []);
      this.upsertAnmModel.controls.epochs.setValue(model.epochs ? model.epochs : '');
      this.upsertAnmModel.controls.p_components.setValue(model.p_components ? model.p_components : '');
      this.upsertAnmModel.controls.desiredVariance.setValue(model.desiredVariance ? model.desiredVariance : '');
      this.nodeList = model.nodes ? model.nodes : [];
      this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
      this.setAllFeatures(model);

    }
  }

  setAllFeatures(model) {
    this.setXFeature(model.xfeatureList ? model.xfeatureList : []);
    this.setTrainingFilter(model.trainingFilter ? model.trainingFilter : []);
    this.setSFeature(model.stringFeatures ? model.stringFeatures : []);
    this.isAllChecked();
  }

  setXFeature(xfeatureList) {
    xfeatureList.forEach(selData => {
      this.xfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkXData = true;
        }
      });
    });

  }
  setTrainingFilter(trainingFilter) {
    trainingFilter.forEach(selData => {
      this.tfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkTrainData = true;
        }
      });
    });
  }
  setSFeature(stringFeatures) {
    stringFeatures.forEach(selData => {
      this.sfeatures.forEach(el => {
        if (el.name === selData) {
          el.checkStringData = true;
        }
      });
    });
  }
  removeNodes() {
    if (this.nodeList.length > 0) {
      this.nodeList.splice(this.nodeList.length - 1, 1);
    }
    this.upsertAnmModel.controls.nodes.setValue([]);
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);
    this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
  }
  addNodes() {
    this.nodeList.push('0');
    this.upsertAnmModel.controls.nodes.setValue([]);
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);
    this.nodeListLength = this.upsertAnmModel.controls.nodes.value.length;
  }
  setValue(event, i) {
    this.isNodeValueChanged = true;
    setTimeout(() => {
      this.isNodeValueChanged = false;
    }, 0);
    this.nodeList[i] = event.currentTarget.value;
    this.upsertAnmModel.controls.nodes.setValue(this.nodeList);


  }
  // clearfeatures() {
  //   this.xfeatures = [];
  //   this.tfeatures = [];
  //   this.sfeatures = [];
  //   this.uniqueFeatures = [];
  //   this.isAllChecked();
  //   this.uniqueisAllChecked();
  //   this.isAllCheckedstring();
  // }
  saveAnmModelData() {
    // tslint:disable-next-line:prefer-const
    const modelData = Object.assign({}, this.upsertAnmModel.value);
    Object.keys(this.displayObj).forEach(it => {
      if (this.displayObj[it] === false) {
        delete modelData[it];
      }
    });

    if (this.action === 'Create') {
      delete modelData.id;
    }

    this.isAnySelected();
    if (this.isActionTaken) {
      this.global.opendisplayModal('Please provide some changes to save the data', 'OK', 'Alert');
    } else if (this.displayObj.nodes && modelData.nodes.includes('0')) {
      this.global.opendisplayModal('Node Value should be greater than 0', 'OK', 'Alert');
    } else if (!this.upsertAnmModel.valid) {
      this.global.opendisplayModal('Please provide all the model details', 'OK', 'Alert');
    } else if (!this.leastOneAlpha.test(modelData.modelConfigName)) {
      this.global.opendisplayModal('Configuration Name provided should have atleast 1 character(A-Z)', 'OK', 'Alert');
    } else if (this.displayObj.epochs && (modelData.epochs <= 1)) {
      this.global.opendisplayModal('Epochs value should be greater than 1', 'OK', 'Alert');
    } else if (this.displayObj.p_components && this.displayObj.xfeatureList && (modelData.p_components > this.isXfeaturesSelected)) {
      this.global.opendisplayModal(
        'p_components value should be less than or equal to selected Xfeatures List count (' + this.isXfeaturesSelected + ')',
      'OK', 'Alert');
    } else if (this.displayObj.dropout && (modelData.dropout < 0 || modelData.dropout >= 1)) {
      this.global.opendisplayModal('Drop Out value should be between 0 and 0.9', 'OK', 'Alert');
    } else if (this.displayObj.l1L2 &&
      modelData.l1L2 && !this.maskL1l2Numregex.test(modelData.l1L2)) {
      // tslint:disable-next-line:max-line-length
      this.global.opendisplayModal('L1, L2 value should be in format 0.0, 0.0 and should be in the range (0.0 - 0.9), (0.0 - 0.9)', 'OK', 'Alert');
    } else if (this.displayObj.batchSize && (modelData.batchSize < 1)) {
      this.global.opendisplayModal('Batch Size value should be greater than or equal to 1', 'OK', 'Alert');
    } else if (this.displayObj.krange && !this.maskNumregexNoLimit.test(modelData.krange)) {
      this.global.opendisplayModal('K Range value should be in format 2, 2, ... and should be greater than or equal to 2',
      'OK', 'Alert');
    } else if (this.displayObj.desiredVariance && (modelData.desiredVariance < 0 || modelData.desiredVariance >= 1)) {
      this.global.opendisplayModal('Desired Variance value should be between 0 and 0.9', 'OK', 'Alert');
    } else if (!this.isXfeaturesSelected) {
      this.global.opendisplayModal('Please Select Features and Filters', 'OK', 'Alert');
    } else {
      this.isActionTaken = true;
      if (this.displayObj.stringFeatures) {
        modelData.stringFeatures = [];
        this.sfeatures.forEach(x => {
          if (x.checkStringData) {
            modelData.stringFeatures.push(x.name);
          }
        });
      }

      if (this.displayObj.xfeatureList) {
        modelData.xfeatureList = [];
        this.xfeatures.forEach(x => {
          if (x.checkXData) {
            modelData.xfeatureList.push(x.name);
          }
        });
      }

      if (this.displayObj.trainingFilter) {
        modelData.trainingFilter = [];
        this.tfeatures.forEach(x => {
          if (x.checkTrainData) {
            modelData.trainingFilter.push(x.name);
          }
        });
      }
      // modelData.jobType = 'TRAINING';
      // modelData.modelConfigCount = 0;
      // tslint:disable-next-line:prefer-const
      if (this.displayObj.l1L2) {
        modelData.l1L2 = this.createcommaStrToArr(modelData.l1L2);
        // const l1 = modelData.l1L2.split(',')[0];
        // let l2 = modelData.l1L2.split(',')[1];
        // l2 = l2.trim();
        // modelData.l1L2 = [l1, l2];
      }
      if (this.displayObj.krange) {
        modelData.krange = this.createcommaStrToArr(modelData.krange);
      }
      if (this.displayObj.metrics) {
        modelData.metrics = [modelData.metrics];
      }
      if (this.displayObj.p_components) {
        modelData.p_components = modelData.p_components;
      }

      const modelConfig = {
        responseType: 'CONF',
        reponseMessage: '',
        anomalyI: null,
        anomalyII: null,
        asc: null
      };

      if (modelData.jobType === 'ANOMALYTRAINING1') {
        modelConfig.anomalyI = { ...modelData };
      } else if (modelData.jobType === 'ANOMALYTRAINING2') {
        modelConfig.anomalyII = { ...modelData };
      } else if (modelData.jobType === 'ASCTRAINING') {
        modelConfig.asc = { ...modelData };
      }

      const data = {
        jobType: modelData.jobType,
        modelConfig
      };


      if (this.action === 'Update') {
        this.anomalyService.updateAnmModel(data).subscribe((res: any) => {
          this.isActionTaken = false;
          if (res.status === 'success') {
            if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
              this.notfyService.showToastrWarning('Alert', res.data.reponseMessage);
            } else {
              this.notfyService.showToastrSuccess('Success', 'Anomaly Model Updated');
              this.anomalyNavigation(this.modelConfigPath);
            }
          }
        }, (error) => {
          this.isActionTaken = false;
          this.notfyService.showToastrError('Alert', 'Server error occured');
        });
      } else if (this.action === 'Create') {
        this.anomalyService.createAnmModel(data).subscribe((res: any) => {
          this.isActionTaken = false;
          if (res.status === 'success') {
            if (res.data && res.data.responseType && res.data.responseType === 'ERR') {
              this.notfyService.showToastrWarning('Alert', res.data.reponseMessage);
            } else {
              this.notfyService.showToastrSuccess('Success', 'Anomaly Model Creation');
              this.anomalyNavigation(this.modelConfigPath);
            }
          }
        }, (error) => {
          this.isActionTaken = false;
          this.notfyService.showToastrError('Alert', 'Server error occured');
        });
      }
    }
  }

  resetAllFeature() {
    this.configXFeature.itemsPerPage = this.defauultItempg;
    this.configXFeature.currentPage = this.defaultCurrentPage;
    this.searchFilterX = '';
    this.inputCurrentpageX = this.defaultCurrentPage;

    this.configTFeature.itemsPerPage = this.defauultItempg;
    this.configTFeature.currentPage = this.defaultCurrentPage;
    this.searchFilterT = '';
    this.inputCurrentpageT = this.defaultCurrentPage;

    this.configSFeature.itemsPerPage = this.defauultItempg;
    this.configSFeature.currentPage = this.defaultCurrentPage;
    this.searchFilterS = '';
    this.inputCurrentpageS = this.defaultCurrentPage;
  }


  createFeatureList(data) {
    return data && data.length > 0 ? data.map(it => ({ checkXData: false, checkStringData: false, checkTrainData: false, name: it })) : [];
  }
  checkAlls(value) {
    this.xfeatures.forEach(x => x.checkXData = value);
  }
  clearAllSelection(opt) {
    switch (opt) {
      case 1:
        this.xfeatures.forEach(x => x.checkXData = false);
        this.isAllChecked();
        break;
      case 2:
        this.tfeatures.forEach(x => x.checkTrainData = false);
        this.uniqueisAllChecked();
        break;
      case 3:
        this.sfeatures.forEach(x => x.checkStringData = false);
        this.isAllCheckedstring();
        break;
    }
  }
  isAllChecked() {
    if (this.xfeatures.length === 0) {
      this.selectAll = false;
    } else {
      this.selectAll = this.xfeatures.every(_ => _.checkXData);
    }
  }
  checkAllunique(value) {
    this.tfeatures.forEach(x => x.checkTrainData = value);
  }
  isAnySelected() {
    this.isXfeaturesSelected = this.xfeatures.filter(x => x.checkXData).length;
    this.isTrainingFilterSeleceted = this.tfeatures.filter(x => x.checkTrainData).length;
    this.isStringFeatureSelected = this.sfeatures.filter(x => x.checkStringData).length;
  }
  uniqueisAllChecked() {
    if (this.tfeatures.length === 0) {
      this.uniqueselectAll = false;
    } else {
      this.uniqueselectAll = this.tfeatures.every(_ => _.checkTrainData);
    }
  }
  checkAllselected(elval) {
    this.sfeatures.forEach(x => x.checkStringData = elval);
  }
  isAllCheckedstring() {
    if (this.sfeatures.length === 0) {
      this.stringselectAll = false;
    } else {
      this.stringselectAll = this.sfeatures.every(_ => _.checkStringData);
    }
  }

  // checkItem(event,item) {
  //  item.checkboxdata = !item.checkboxdata;
  // }

  /*************************************Sumit Code Starts********* */

  // on search
  onsearchChange(searchVal, featureType) {
    switch (featureType) {
      case 'XFeature':
        this.inputCurrentpageX = this.defaultCurrentPage;
        this.configXFeature.currentPage = this.defaultCurrentPage;
        // const fetx = this.uniqueFeatures.filter((el) => el.includes(searchVal));
        // this.xfeatures = this.createFeatureList(fetx);
        break;
      case 'TFeature':
        this.inputCurrentpageT = this.defaultCurrentPage;
        this.configTFeature.currentPage = this.defaultCurrentPage;
        // const fett = this.uniqueFeatures.filter((el) => el.includes(searchVal));
        // this.tfeatures = this.createFeatureList(fett);
        break;
      case 'SFeature':
        this.inputCurrentpageS = this.defaultCurrentPage;
        this.configSFeature.currentPage = this.defaultCurrentPage;
        // const fets = this.uniqueFeatures.filter((el) => el.includes(searchVal));
        // this.sfeatures = this.createFeatureList(fets);
        break;
    }
  }
  // change page on input
  changepageinp(inputVal, lastpage, featureType) {
    switch (featureType) {
      case 'XFeature':
        if (inputVal < 1 || inputVal > lastpage) {
          this.inputCurrentpageX = this.configXFeature.currentPage;
        } else {
          this.configXFeature.currentPage = inputVal;
        }
        break;
      case 'TFeature':
        if (inputVal < 1 || inputVal > lastpage) {
          this.inputCurrentpageT = this.configTFeature.currentPage;
        } else {
          this.configTFeature.currentPage = inputVal;
        }
        break;
      case 'SFeature':
        if (inputVal < 1 || inputVal > lastpage) {
          this.inputCurrentpageS = this.configSFeature.currentPage;
        } else {
          this.configSFeature.currentPage = inputVal;
        }
        break;
    }
  }
  onFeatureTabChanged(evt) {
    if (evt.index === 0) {
      this.searchFilterX = '';
      this.inputCurrentpageX = this.defaultCurrentPage;
      this.configXFeature.currentPage = this.defaultCurrentPage;
      this.itemPerPageX = this.defauultItempg;
    } else if (evt.index === 1) {
      this.inputCurrentpageT = this.defaultCurrentPage;
      this.configTFeature.currentPage = this.defaultCurrentPage;
      this.itemPerPageT = this.defauultItempg;
      this.searchFilterT = '';
    } else if (evt.index === 2) {
      this.inputCurrentpageS = this.defaultCurrentPage;
      this.configSFeature.currentPage = this.defaultCurrentPage;
      this.itemPerPageS = this.defauultItempg;
      this.searchFilterS = '';
    }
  }
  // onpage change
  changepage(evt, featureType) {

    switch (featureType) {
      case 'XFeature':
        this.configXFeature.currentPage = evt;
        this.inputCurrentpageX = evt;
        break;
      case 'TFeature':
        this.configTFeature.currentPage = evt;
        this.inputCurrentpageT = evt;
        break;
      case 'SFeature':
        this.configSFeature.currentPage = evt;
        this.inputCurrentpageS = evt;
        break;
    }
  }

  // set new page size for pagination
  setNewPageSize(pageSize, featureType) {
    switch (featureType) {
      case 'XFeature':
        this.configXFeature.itemsPerPage = pageSize;
        this.configXFeature.currentPage = this.defaultCurrentPage;
        this.inputCurrentpageX = this.defaultCurrentPage;
        break;
      case 'TFeature':
        this.configTFeature.itemsPerPage = pageSize;
        this.configTFeature.currentPage = this.defaultCurrentPage;
        this.inputCurrentpageT = this.defaultCurrentPage;
        break;
      case 'SFeature':
        this.configSFeature.itemsPerPage = pageSize;
        this.configSFeature.currentPage = this.defaultCurrentPage;
        this.inputCurrentpageS = this.defaultCurrentPage;
        break;
    }
  }
  /*************************************Sumit Code End********* */
  sort(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }


  anomalyNavigation(navigationpath, addprefix?) {
    if (addprefix) {
      this.router.navigate(['/' + this.global.prefixUrl + navigationpath]);
    } else {
      this.router.navigate([navigationpath]);
    }

  }

  getModelConfigDetails(modelConfObj) {
    if (modelConfObj && modelConfObj.modelConfigName) {
      const body = { jobType: modelConfObj.jobType, modelConfigName: modelConfObj.modelConfigName };
      this.anomalyService.getAnmolayModelConfigByName(body).subscribe((res: any) => {
        if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
          const modelconfI = res.data.anomalyI && Object.keys(res.data.anomalyI).length > 0 ? res.data.anomalyI : null;
          const modelconfII = res.data.anomalyII && Object.keys(res.data.anomalyII).length > 0 ? res.data.anomalyII : null;
          const modelconfasc = res.data.asc && Object.keys(res.data.asc).length > 0 ? res.data.asc : null;
          const modelConf = modelconfI ? modelconfI : (modelconfII ? modelconfII : modelconfasc);
          if (modelConf) {
            this.modelconfBuffer = { [modelConfObj.jobType]: modelConf };
            this.modelConfId = modelConf.id ? modelConf.id : '';
            this.getDataSetByJobType(modelConfObj.jobType, true, modelConf.dataSetName);
          } else {
            this.createFormLoader = false;
          }
        } else {
          this.notfyService.showToastrError('Alert', 'Exception occured');
          this.createFormLoader = false;
        }
      }, err => {
        this.createFormLoader = false;
        this.notfyService.showToastrError('Alert', 'Server error occured');
      });
    } else {
      this.createFormLoader = false;
    }
  }


  ngOnDestroy() {
    this.anomalyService.AnomalyModel = false;
    this.anomalyService.AnomalyUpdateModel = false;
  }

}
