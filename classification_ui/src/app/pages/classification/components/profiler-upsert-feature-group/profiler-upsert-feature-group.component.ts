import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ClassificationService } from '../../services/classification.service';
import * as moment from 'moment';
@Component({
  selector: 'app-profiler-upsert-feature-group',
  templateUrl: './profiler-upsert-feature-group.component.html',
  styleUrls: ['./profiler-upsert-feature-group.component.scss']
})
export class ProfilerUpsertFeatureGroupComponent implements OnInit {

  // providerInputObj = { featureGrp: null, dataSet: null, timeFtr: null, featureVal: null, x: null };
  dataSetLoader = false;
  featureGroupLoader = false;
  featuresLoader = false;
  timeFilterLoader = false;
  featureGrp: any = null;
  dataSet: any = null;
  timeFtr: any = null;
  label: any = null;
  timeFtrDate: any = null;
  featureVal: any = null;
  allFeatureByDataSet = [];
  allSelectedFeatures = [];

  previousFeatureDetails: any = {
    dataSetName: '',
    groupName: '',
    labelName: '',
    timeFilterName: '',
    from_Time: '',
    to_Time: '',
    selectedFeatures: [],
    selectedFeatureId: '',
  };

  defaultJobType = 'CLASSIFICATION';
  defaultmodelType = 'PROFILER';

  constructor(
    public notify: NotificationService,
    private router: Router,
    private global: GlobalService,
    public classificationService: ClassificationService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    if (this.classificationService.classificationDetails && this.classificationService.classificationDetails.details && this.classificationService.classificationDetails.action === 'loadBuf') {
      this.resetToPreviousFeature(this.classificationService.classificationDetails.details);
    } else {
      this.classificationService.classificationDetails = {};
      this.getDataSet();
    }
  }

  resetToPreviousFeature(selectedDeatils) {
    this.previousFeatureDetails.dataSetName = selectedDeatils.selectedDataSet ? selectedDeatils.selectedDataSet : '';
    this.previousFeatureDetails.groupName = selectedDeatils.selectedFeaturegroup ? selectedDeatils.selectedFeaturegroup : '';
    this.previousFeatureDetails.labelName = selectedDeatils.selectedLabel ? selectedDeatils.selectedLabel : '';
    // tslint:disable-next-line:max-line-length
    this.previousFeatureDetails.timeFilterName = selectedDeatils.selectedTimeFilterFeature ? selectedDeatils.selectedTimeFilterFeature : '';
    this.previousFeatureDetails.from_Time = selectedDeatils.from_Time ? selectedDeatils.from_Time : '';
    this.previousFeatureDetails.to_Time = selectedDeatils.to_Time ? selectedDeatils.to_Time : '';
    // tslint:disable-next-line:max-line-length
    this.previousFeatureDetails.selectedFeatures = selectedDeatils.selectedFeatureList && selectedDeatils.selectedFeatureList.length > 0 ? [...selectedDeatils.selectedFeatureList] : [];
    this.previousFeatureDetails.selectedFeatureId = selectedDeatils.selectedFeatureId ? selectedDeatils.selectedFeatureId : '';
    this.classificationService.classificationDetails = {};
    this.getDataSet();
  }


  getDataSet() {
    this.dataSetLoader = true;
    const JobType = { jobType: 'CLASSIFICATION' };
    this.classificationService.getFeatureDataSetProf(JobType).subscribe((res: any) => {
      this.dataSetLoader = false;
      if (res && res.status === 'success') {
        const dataSetList = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        const selectedDataSet = dataSetList.length > 0 ? this.previousFeatureDetails.dataSetName ? this.previousFeatureDetails.dataSetName : dataSetList[0] : '';
        this.dataSet = { dataArr: dataSetList, selVal: selectedDataSet };
        this.previousFeatureDetails.dataSetName = '';
        // this.getAllMasterDetails(selectedDataSet);
        this.getFeatureGroup(selectedDataSet);
        // this.getFeatureLabel(selectedDataSet);
        // this.getDateTimeFilter(selectedDataSet);
        this.getAllFeatures(selectedDataSet);
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
        this.dataSet = { dataArr: [], selVal: '' };
        this.getFeatureGroup('');
        // this.getFeatureLabel('');
        // this.getDateTimeFilter('');
        this.getAllFeatures('');
        this.dataSetLoader = false;
      }
    }, err => {
      this.dataSetLoader = false;
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
      this.dataSet = { dataArr: [], selVal: '' };
      this.getFeatureGroup('');
      // this.getFeatureLabel('');
      // this.getDateTimeFilter('');
      this.getAllFeatures('');
    });
  }

  resetAllOnDataSetChange(selectedDataSet) {
    this.getFeatureGroup(selectedDataSet);
    // this.getFeatureLabel(selectedDataSet);
    // this.getDateTimeFilter(selectedDataSet);
    this.getAllFeatures(selectedDataSet);
  }

  getFeatureLabel(selectedFeature) {
    this.label = {
      dataArr: selectedFeature.map(it => it.name),
      selVal: this.previousFeatureDetails.labelName
    };
    this.previousFeatureDetails.labelName = '';
  }

  getFeatureGroup(dataSetVal) {
    if (dataSetVal) {
      this.featureGroupLoader = true;
      const data = {
        jobType: this.defaultJobType,
        modelType: this.defaultmodelType,
        dataSetName: dataSetVal
      };
      this.classificationService.getFeatureGroupProf(data).subscribe((res: any) => {
        this.featureGroupLoader = false;
        if (res && res.status === 'success') {
          const groupList = res.data && res.data.length > 0 ? [...res.data] : [];
          this.featureGrp = {
            dataArr: groupList,
            selVal: this.previousFeatureDetails.groupName,
            enable: this.previousFeatureDetails.groupName ? true : false
          };

          this.previousFeatureDetails.groupName = '';
        } else {
          this.notify.showToastrWarning('Alert', 'API failed to fetch feature group');
          this.featureGrp = { dataArr: [], selVal: '', enable: false };
          this.featureGroupLoader = false;
        }
      }, err => {
        this.featureGroupLoader = false;
        this.notify.showToastrError('Alert', 'API failed to fetch feature group');
        this.featureGrp = { dataArr: [], selVal: '', enable: false };
      });

    } else {
      this.featureGrp = { dataArr: [], selVal: '', enable: false };
    }
  }

  getDateTimeFilter(dataSetVal) {
    if (dataSetVal) {
      this.timeFilterLoader = true;
      const data = { dataSetName: dataSetVal };
      this.classificationService.getFeaturesTimeColumnProf(data).subscribe((res: any) => {
        this.timeFilterLoader = false;
        if (res && res.status === 'success') {
          const timeFilterList = res.data && res.data.time_columns && res.data.time_columns.length > 0 ? [...res.data.time_columns] : [];
          this.timeFtr = {
            dataArr: [...timeFilterList],
            selVal: this.previousFeatureDetails.timeFilterName,
            enable: this.previousFeatureDetails.timeFilterName ? true : false
          };
          this.timeFtrDate = {
            from_Time: this.previousFeatureDetails.from_Time,
            to_Time: this.previousFeatureDetails.to_Time
          };

          this.previousFeatureDetails.timeFilterName = '';
          this.previousFeatureDetails.to_Time = '';
          this.previousFeatureDetails.from_Time = '';
        } else {
          this.notify.showToastrWarning('Alert', 'API failed to fetch time filter feature');
          this.timeFtr = { dataArr: [], selVal: '', enable: false };
          this.timeFtrDate = { from_Time: '', to_Time: '' };
          this.timeFilterLoader = false;
        }
      }, err => {
        this.timeFilterLoader = false;
        this.notify.showToastrError('Alert', 'API failed to fetch time filter feature');
        this.timeFtr = { dataArr: [], selVal: '', enable: false };
        this.timeFtrDate = { from_Time: '', to_Time: '' };
      });
    } else {
      this.timeFtr = { dataArr: [], selVal: '', enable: false };
      this.timeFtrDate = { from_Time: '', to_Time: '' };
    }
  }

  createTimeFilterObj(dataObj) {
    const outDataArr = [];
    dataObj.forEach(it => {
      const newObject = Object.assign({ time_column: it, start_date: '' });
      outDataArr.push(newObject);
    });
    return outDataArr;
  }

  getAllFeatures(dataSetVal) {
    if (dataSetVal) {
      this.featuresLoader = true;
      const data = { dataSetName: dataSetVal };
      this.classificationService.getProfDatasourceDeatils(data).subscribe((res: any) => {
        this.featuresLoader = false;
        if (res && res.status === 'success') {
          // tslint:disable-next-line:max-line-length
          const resData = res.data && res.data.data ? res.data.data : null;
          this.allFeatureByDataSet = resData && resData.featureMapping && resData.featureMapping.length ?
            this.getAllFeatureObject(resData.featureMapping) : [];

          this.showSelectedFeature(this.previousFeatureDetails.selectedFeatures, true);
          // set Time Filter Feature
          const timeFilterList = resData.timeFilterFeature && resData.timeFilterFeature.length ?
            this.createTimeFilterObj(resData.timeFilterFeature) : [];

          const step1Arr = resData && resData.configuration ?
            resData.configuration.filter(it => it.type === 'step1') : [];
          const step1Obj = step1Arr.length > 0 ? step1Arr[0] : null;
          const indexName = step1Obj && step1Obj.value ? step1Obj.value : '';


          this.timeFtr = {
            dataArr: [...timeFilterList],
            selVal: this.previousFeatureDetails.timeFilterName,
            enable: this.previousFeatureDetails.timeFilterName ? true : false
          };
          this.timeFtrDate = {
            from_Time: this.previousFeatureDetails.from_Time,
            to_Time: this.previousFeatureDetails.to_Time,
            indexName: indexName ? indexName : ''
          };

          this.previousFeatureDetails.timeFilterName = '';
          this.previousFeatureDetails.to_Time = '';
          this.previousFeatureDetails.from_Time = '';
        } else {
          this.notify.showToastrWarning('Alert', 'API failed to fetch feature list');
          this.allFeatureByDataSet = [];
          this.featureVal = { dataArr: [], id: '' };
          this.getFeatureLabel([]);
          // set Time Filter Feature
          this.timeFtr = { dataArr: [], selVal: '', enable: false };
          this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
          this.featuresLoader = false;
        }
      }, err => {
        this.featuresLoader = false;
        this.notify.showToastrError('Alert', 'API failed to fetch feature list');
        this.allFeatureByDataSet = [];
        this.featureVal = { dataArr: [], id: '' };
        this.getFeatureLabel([]);
        // set Time Filter Feature
        this.timeFtr = { dataArr: [], selVal: '', enable: false };
        this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
      });
    } else {
      this.allFeatureByDataSet = [];
      this.featureVal = { dataArr: [], id: '' };
      this.getFeatureLabel([]);
      // set Time Filter Feature
      this.timeFtr = { dataArr: [], selVal: '', enable: false };
      this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
    }
  }


  getAllFeatureByGroup(dataSetVal, groupVal) {
    this.featuresLoader = true;
    const data = {
      jobType: this.defaultJobType,
      modelType: this.defaultmodelType,
      groupName: groupVal
    };
    this.classificationService.getALLFeaturesListByGroupProf(data).subscribe((res: any) => {
      this.featuresLoader = false;
      if (res && res.status === 'success') {
        // tslint:disable-next-line:max-line-length
        this.allSelectedFeatures = res.data && res.data.features && res.data.features.length > 0 && res.data.features[0] ? this.getFeatureObject(res.data.features[0]) : [];
        this.previousFeatureDetails.selectedFeatureId = res.data && res.data.id ? res.data.id : '';
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to fetch feature list');
        this.allSelectedFeatures = [];
        this.featuresLoader = false;
      }
      this.showSelectedFeature(this.allSelectedFeatures);

    }, err => {
      this.featuresLoader = false;
      this.notify.showToastrError('Alert', 'API failed to fetch feature list');
      this.allSelectedFeatures = [];
      this.showSelectedFeature(this.allSelectedFeatures);
    });
  }

  showSelectedFeature(selectedFeature, setLabel?) {
    this.allFeatureByDataSet.forEach(it => {
      if (selectedFeature.some(el => el.name === it.name)) {
        it.checkSelect = true;
      } else {
        it.checkSelect = false;
      }
    });
    this.featureVal = { dataArr: [...this.allFeatureByDataSet], id: this.previousFeatureDetails.selectedFeatureId };
    if (setLabel) {
      this.getFeatureLabel([...selectedFeature]);
    }
    this.previousFeatureDetails.selectedFeatures = [];
    this.previousFeatureDetails.selectedFeatureId = '';
  }



  getFeatureObject(dataObj) {
    const outDataArr = [];
    Object.keys(dataObj).forEach(it => {
      const objValue = dataObj[it];
      const newObject = Object.assign({ name: it, type: objValue, checkSelect: false });
      outDataArr.push(newObject);
    });
    return outDataArr;
  }


  getAllFeatureObject(dataObj) {
    const outDataArr = [];
    dataObj.forEach(it => {
      const newObject = Object.assign({ name: it.feature, type: it.propertyType, checkSelect: false });
      outDataArr.push(newObject);
    });
    return outDataArr;
  }

  craeteSaveObject(selectedFeatureList) {
    const outObj = {};
    selectedFeatureList.forEach((it: any) => {
      const newObj = { [it.name]: it.type };
      Object.assign(outObj, newObj);
    });
    return outObj;
  }

  updateGroup(action, details) {
    const data = {
      dataSetName: details.selectedDataSet,
      features: [this.craeteSaveObject(details.selectedFeatureList)],
      groupName: details.selectedFeaturegroup,
      id: details.selectedFeatureId,
      jobType: this.defaultJobType,
      modelType: this.defaultmodelType
    };
    this.classificationService.updateFeatureGroupProf(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.notify.showToastrSuccess('Success', 'Feature group ' + action + 'd successfully');
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to ' + action + ' feature group');
      }
    }, err => {
      this.notify.showToastrError('Alert', 'API failed to ' + action + ' feature group');
    });
  }

  createSaveGroup(action, details) {
    const data = {
      dataSetName: details.selectedDataSet,
      features: [this.craeteSaveObject(details.selectedFeatureList)],
      groupName: details.newGroupName,
      jobType: this.defaultJobType,
      modelType: this.defaultmodelType
    };
    this.classificationService.createFeatureGroupProf(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        const id = res.data && res.data.id ? res.data.id : '';
        this.notify.showToastrSuccess('Success', 'Feature group ' + action + 'd successfully');
        this.createGroup(details, id);
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to ' + action + ' feature group');
      }

    }, err => {
      this.notify.showToastrError('Alert', 'API failed to ' + action + ' feature group');
    });
  }

  createGroup(details, selectedFeatureId) {
    this.featureGrp = {
      dataArr: [...details.featureGroup, details.newGroupName], selVal: details.newGroupName,
      enable: true,
      id: selectedFeatureId
    };
  }

  deleteFeatureGroup(action, details) {
    const data = {
      jobType: 'CLASSIFICATION',
      modelType: 'PROFILER',
      groupName: details.selectedFeaturegroup
    };
    this.classificationService.deleteFeatureGroupProf(data).subscribe((res: any) => {
      if (res && res.status === 'success' && res.data.deletedCount !== 0) {
        this.notify.showToastrSuccess('Success', 'Feature group deleted successfully');
        const featureGrpList = details.featureGroup.filter(it => it !== details.selectedFeaturegroup);
        this.featureGrp = { dataArr: [...featureGrpList], selVal: '', enable: false };
        this.showSelectedFeature([]);
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to delete feature group');
      }

    }, err => {
      this.notify.showToastrError('Alert', 'API failed to delete feature group');
    });

  }

  providerOutput(evt) {
    if (evt.action === 'run') {
      this.classificationService.classificationDetails = evt;
      if (evt.details.from_Time) {
        evt.details.from_Time = evt.details.from_Time + ':01';
      }
      if (evt.details.to_Time) {
        evt.details.to_Time = evt.details.to_Time + ':01';
      }
      const data = {
        dataSetName: evt.details.selectedDataSet ? evt.details.selectedDataSet : '',
        fromTime: evt.details.from_Time ? this.toISO(evt.details.from_Time) : '',
        groupName: evt.details.selectedFeaturegroup ? evt.details.selectedFeaturegroup : '',
        hyperparameterConfig: null,
        hyperparameterFlag: true,
        jobStatus: 'ACTIVE',
        jobType: 'CLASSIFICATION',
        modelType: 'PROFILER',
        indexName: 'basic_profiler*',
        label: evt.details.selectedLabel ? evt.details.selectedLabel : '',
        timeFilterFeature: evt.details.selectedTimeFilterFeature ? evt.details.selectedTimeFilterFeature : '',
        toTime: evt.details.to_Time ? this.toISO(evt.details.to_Time) : '',
        modelConfigName: '',
        modelFromTime: '',
        modelName: '',
        modelToTime: '',
      };
      this.classificationService.scheduleProfiler(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.classificationService.scheduleRes = res.data;
          this.notify.showToastrSuccess('Success', 'Classification scheduled');
          this.router.navigate(['/' + this.global.prefixUrl + '/classification/profiler']);
        } else {
          this.notify.showToastrWarning('Failed', 'Classification schedule');
        }
      }, (error) => {
        this.notify.showToastrError('Error', 'Classification schedule');
      });
    } else if (evt.action === 'featureGrp') {
      this.getAllFeatureByGroup(evt.details.selectedDataSet, evt.details.selectedFeaturegroup);
    } else if (evt.action === 'dataSet') {
      this.resetAllOnDataSetChange(evt.details.selectedDataSet);
    } else if (evt.action === 'create') {
      this.createSaveGroup(evt.action, evt.details);
    } else if (evt.action === 'update') {
      this.updateGroup(evt.action, evt.details);
    } else if (evt.action === 'deletegroup') {
      this.deleteFeatureGroup(evt.action, evt.details);
    }
  }
  toISO(dt) {
    return dt ? moment(dt).format('YYYY-MM-DDTHH:mm:ss') + 'Z' : 'None';
  }
}

