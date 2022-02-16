import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { ClusteringService } from '../../services/clustering.service';
@Component({
  selector: 'app-model-config-view',
  templateUrl: './model-config-view.component.html',
  styleUrls: ['./model-config-view.component.scss']
})
export class ModelConfigViewComponent implements OnInit {
  xFeatureSearch = '';
  trainFilterSearch = '';
  strFeatureSearch = '';
  selectedModelObject: any = {};
  detailLoader = false;
  regexAllSpace = new RegExp(/\s/, 'g');
  constructor(public clusteringService: ClusteringService,
              public dialogRef: MatDialogRef<ModelConfigViewComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notify: NotificationService) { }


  ngOnInit() {
    this.getModelConfigDetails(this.data);
  }

  checkifObjectExist() {
    return this.selectedModelObject && Object.keys(this.selectedModelObject).length > 0 ? true : false;
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

   trainingJobtype(jobType) {
    if (jobType === 'ANOMALYEXECUTION1') {
      return 'ANOMALYTRAINING1';
    } else if (jobType === 'ANOMALYEXECUTION2') {
      return 'ANOMALYTRAINING2';
    } else if (jobType === 'ASCEXECUTION') {
      return 'ASCTRAINING';
    } else {
      return jobType;
    }
  }

  getModelConfigDetails(modelConfObj) {
    this.detailLoader = true;
    const data = { jobType: this.trainingJobtype(modelConfObj.jobType), modelConfigName: modelConfObj.modelConfigName };
    this.clusteringService.getAnmolayModelConfigByName(data).subscribe((res: any) => {
      this.detailLoader = false;
      if (res && res.status === 'success' && res.data && Object.keys(res.data).length > 0) {
        const modelconfI = res.data.anomalyI && Object.keys(res.data.anomalyI).length > 0 ? res.data.anomalyI : null;
        const modelconfII = res.data.anomalyII && Object.keys(res.data.anomalyII).length > 0 ? res.data.anomalyII : null;
        const modelconfasc = res.data.asc && Object.keys(res.data.asc).length > 0 ? res.data.asc : null;
        const modelObjToCreate = modelconfI ? modelconfI : (modelconfII ? modelconfII : modelconfasc);
        this.selectedModelObject = modelObjToCreate ? this.craeteModelObject(modelObjToCreate) : {};
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to fetch model configuration details');
        this.selectedModelObject = {};
        this.detailLoader = false;
      }

    }, err => {
      this.selectedModelObject = {};
      this.detailLoader = false;
      this.notify.showToastrError('Alert', 'Exception while fetching model configuration details');
    });

  }

  craeteModelObject(modelConfigObj) {

    const newModelConfig = modelConfigObj ? Object.assign({}, modelConfigObj) : {};
    // tslint:disable-next-line:max-line-length
    newModelConfig.stringFeatures = modelConfigObj && modelConfigObj.stringFeatures && modelConfigObj.stringFeatures.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.stringFeatures]) : [];
    // tslint:disable-next-line:max-line-length
    newModelConfig.trainingFilter = modelConfigObj && modelConfigObj.trainingFilter && modelConfigObj.trainingFilter.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.trainingFilter]) : [];
    // tslint:disable-next-line:max-line-length
    newModelConfig.xfeatureList = modelConfigObj && modelConfigObj.xfeatureList && modelConfigObj.xfeatureList.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.xfeatureList]) : [];

    // const newModelConfig: any = {
    //   modelConfigName: modelConfigObj && modelConfigObj.modelConfigName ? modelConfigObj.modelConfigName : '',
    //   modelConfigCount: modelConfigObj && modelConfigObj.modelConfigCount ? modelConfigObj.modelConfigCount : 0,
    //   modelType: modelConfigObj && modelConfigObj.modelType ? modelConfigObj.modelType : '',
    //   encoder: modelConfigObj && modelConfigObj.encoder ? modelConfigObj.encoder : '',
    //   dataSetName: modelConfigObj && modelConfigObj.dataSetName ? modelConfigObj.dataSetName : '',
    //   id: modelConfigObj && modelConfigObj.id ? modelConfigObj.id : '',
    //   jobType: modelConfigObj && modelConfigObj.jobType ? modelConfigObj.jobType : '',
    //   scaler: modelConfigObj && modelConfigObj.scaler ? modelConfigObj.scaler : '',
    //   uniqueFeature: modelConfigObj && modelConfigObj.uniqueFeature ? modelConfigObj.uniqueFeature : '',
    //   // tslint:disable-next-line:max-line-length
    //   stringFeatures: modelConfigObj && modelConfigObj.stringFeatures &&
    // modelConfigObj.stringFeatures.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.stringFeatures]) : [],
    //   // tslint:disable-next-line:max-line-length  &&
    //   trainingFilter: modelConfigObj && modelConfigObj.trainingFilter
    //  modelConfigObj.trainingFilter.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.trainingFilter]) : [],
    //   // tslint:disable-next-line:max-line-length
    //   xfeatureList: modelConfigObj && modelConfigObj.xfeatureList &&
    //  modelConfigObj.xfeatureList.length > 0 ? this.createStrArrToObjArr([...modelConfigObj.xfeatureList]) : [],
    // };

    // if (modelConfigObj && this.checkkeyExist(['epochs', 'nodes'], modelConfigObj) === true) {
    //   newModelConfig.optimizer = modelConfigObj.optimizer ? modelConfigObj.optimizer : '';
    //   newModelConfig.activation = modelConfigObj.activation ? modelConfigObj.activation : '';
    //   newModelConfig.decoder_activation = modelConfigObj.decoder_activation ? modelConfigObj.decoder_activation : '';
    //   newModelConfig.loss = modelConfigObj.loss ? modelConfigObj.loss : '';
    //   newModelConfig.metrics = this.strTOArrVV(modelConfigObj.metrics);
    //   newModelConfig.epochs = modelConfigObj.epochs ? modelConfigObj.epochs : '';
    //   newModelConfig.dropout = modelConfigObj.dropout ? modelConfigObj.dropout : '';
    //   newModelConfig.l1L2 = this.strTOArrVV(modelConfigObj.l1L2);
    //   newModelConfig.batchSize = modelConfigObj.batchSize ? modelConfigObj.batchSize : '';


    //   newModelConfig.nodes = this.createcommaStrToArr(modelConfigObj.nodes);
    // } else if (modelConfigObj && this.checkkeyExist(['p_components'], modelConfigObj) === true) {
    //   newModelConfig.p_components = modelConfigObj.p_components ? modelConfigObj.p_components : '';
    // }

    return Object.assign({}, newModelConfig);

  }

  createStrArrToObjArr(arrVal) {
    if (typeof arrVal[0] === 'string') {
      return arrVal.map(it => Object.assign({ name: it }));
    } else {
      return arrVal.map(it => it.name);
    }

  }


  checkkeyExist(keyArr, modelConfigObj) {
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
            dataValStr = dataValStr + it.toString();
          } else {
            dataValStr = dataValStr + it.toString() + ', ';
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
            dataValStr = dataValStr + it.toString();
          } else {
            dataValStr = dataValStr + it.toString() + ', ';
          }
        });
      }
      return dataValStr;
    }
  }


}
