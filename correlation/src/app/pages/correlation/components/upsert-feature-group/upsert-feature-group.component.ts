import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { CorrelationService } from '../../services/correlation.service';
@Component({
  selector: 'app-upsert-feature-group',
  templateUrl: './upsert-feature-group.component.html',
  styleUrls: ['./upsert-feature-group.component.scss']
})
export class UpsertFeatureGroupComponent implements OnInit {
  // providerInputObj = { featureGrp: null, dataSet: null, timeFtr: null, featureVal: null, x: null };
  dataSetLoader = false;
  featureGroupLoader = false;
  featuresLoader = false;
  timeFilterLoader = false;
  featureGrp: any = null;
  dataSet: any = null;
  timeFtr: any = null;
  timeFtrDate: any = null;
  featureVal: any = null;
  allFeatureByDataSet = [];
  allSelectedFeatures = [];

  previousFeatureDetails: any = {
    dataSetName: '',
    groupName: '',
    timeFilterName: '',
    from_Time: '',
    to_Time: '',
    selectedFeatures: []
  };

  constructor(
    public notify: NotificationService,
    public global: GlobalService,
    private router: Router,
    public correlationService: CorrelationService) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    if (this.correlationService.correlationDetails && this.correlationService.correlationDetails.details && this.correlationService.correlationDetails.action === 'loadBuf') {
      this.resetToPreviousFeature(this.correlationService.correlationDetails.details);
    } else {
      this.correlationService.correlationDetails = {};
      this.getDataSet();
    }
  }

  resetToPreviousFeature(selectedDeatils) {
    this.previousFeatureDetails.dataSetName = selectedDeatils.selectedDataSet ? selectedDeatils.selectedDataSet : '';
    this.previousFeatureDetails.groupName = selectedDeatils.selectedFeaturegroup ? selectedDeatils.selectedFeaturegroup : '';
    // tslint:disable-next-line:max-line-length
    this.previousFeatureDetails.timeFilterName = selectedDeatils.selectedTimeFilterFeature ? selectedDeatils.selectedTimeFilterFeature : '';
    this.previousFeatureDetails.from_Time = selectedDeatils.from_Time ? selectedDeatils.from_Time : '';
    this.previousFeatureDetails.to_Time = selectedDeatils.to_Time ? selectedDeatils.to_Time : '';
    // tslint:disable-next-line:max-line-length
    this.previousFeatureDetails.selectedFeatures = selectedDeatils.selectedFeatureList && selectedDeatils.selectedFeatureList.length > 0 ? [...selectedDeatils.selectedFeatureList] : [];
    this.correlationService.correlationDetails = {};
    this.getDataSet();
  }


  getDataSet() {
    this.dataSetLoader = true;
    const JobType = { jobType: 'CORRELATION' };
    this.correlationService.getFeatureDataSet(JobType).subscribe((res: any) => {
      this.dataSetLoader = false;
      if (res && res.status === 'success') {
        const dataSetList = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length
        const selectedDataSet = dataSetList.length > 0 ? this.previousFeatureDetails.dataSetName ? this.previousFeatureDetails.dataSetName : dataSetList[0] : '';
        this.dataSet = { dataArr: dataSetList, selVal: selectedDataSet };
        this.previousFeatureDetails.dataSetName = '';
        // this.getAllMasterDetails(selectedDataSet);
        this.getFeatureGroup(selectedDataSet);
        // this.getDateTimeFilter(selectedDataSet);
        this.getAllFeatures(selectedDataSet);
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
        this.dataSet = { dataArr: [], selVal: '' };
        this.getFeatureGroup('');
        // this.getDateTimeFilter('');
        this.getAllFeatures('');
        this.dataSetLoader = false;
      }
    }, err => {
      this.dataSetLoader = false;
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
      this.dataSet = { dataArr: [], selVal: '' };
      this.getFeatureGroup('');
      // this.getDateTimeFilter('');
      this.getAllFeatures('');
    });
  }

  resetAllOnDataSetChange(selectedDataSet) {
    this.getFeatureGroup(selectedDataSet);
    // this.getDateTimeFilter(selectedDataSet);
    this.getAllFeatures(selectedDataSet);
  }

  getFeatureGroup(dataSetVal) {
    if (dataSetVal) {
      this.featureGroupLoader = true;
      const data = { dataSetName: dataSetVal };
      this.correlationService.getFeatureGroup(data).subscribe((res: any) => {
        this.featureGroupLoader = false;
        if (res && res.status === 'success') {
          const groupList = res.data && res.data.groups && res.data.groups.length > 0 ? [...res.data.groups] : [];
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
      this.correlationService.getFeaturesTimeColumn(data).subscribe((res: any) => {
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
      this.correlationService.getCorrelatedDatasourceDeatils(data).subscribe((res: any) => {
        this.featuresLoader = false;
        if (res && res.status === 'success') {
          // tslint:disable-next-line:max-line-length
          const resData = res.data && res.data.data ? res.data.data : null;
          this.allFeatureByDataSet = resData && resData.featureMapping && resData.featureMapping.length ?
            this.getAllFeatureObject(resData.featureMapping) : [];

          this.showSelectedFeature(this.previousFeatureDetails.selectedFeatures);
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
          this.featureVal = { dataArr: [] };
          // set Time Filter Feature
          this.timeFtr = { dataArr: [], selVal: '', enable: false };
          this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
          this.featuresLoader = false;
        }
      }, err => {
        this.featuresLoader = false;
        this.notify.showToastrError('Alert', 'API failed to fetch feature list');
        this.allFeatureByDataSet = [];
        this.featureVal = { dataArr: [] };
        // set Time Filter Feature
        this.timeFtr = { dataArr: [], selVal: '', enable: false };
        this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
      });
    } else {
      this.allFeatureByDataSet = [];
      this.featureVal = { dataArr: [] };
      // set Time Filter Feature
      this.timeFtr = { dataArr: [], selVal: '', enable: false };
      this.timeFtrDate = { from_Time: '', to_Time: '', indexName: '' };
    }
  }


  getAllFeatureByGroup(dataSetVal, groupVal) {
    this.featuresLoader = true;
    const data = { db_name: dataSetVal, group_name: groupVal };
    this.correlationService.getALLFeaturesListByGroup(data).subscribe((res: any) => {
      this.featuresLoader = false;
      if (res && res.status === 'success') {
        // tslint:disable-next-line:max-line-length
        this.allSelectedFeatures = res.data && res.data.columns_mapping ? this.getFeatureObject(res.data.columns_mapping) : [];
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

  showSelectedFeature(selectedFeature) {
    this.allFeatureByDataSet.forEach(it => {
      if (selectedFeature.some(el => el.name === it.name)) {
        it.checkSelect = true;
      } else {
        it.checkSelect = false;
      }
    });
    this.featureVal = { dataArr: [...this.allFeatureByDataSet] };
    this.previousFeatureDetails.selectedFeatures = [];
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
  upsertGroup(action, details) {
    const groupName = action === 'create' ? details.newGroupName : details.selectedFeaturegroup;
    const data = {
      db_name: details.selectedDataSet,
      group_name: groupName,
      columns_mapping: this.craeteSaveObject(details.selectedFeatureList)
    };
    this.correlationService.upsertFeatureGroup(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.notify.showToastrSuccess('Success', 'Feature group ' + action + 'd successfully');
        if (action === 'create') {
          this.createGroup(details);
        }

      } else {
        this.notify.showToastrWarning('Alert', 'API failed to ' + action + ' feature group');
      }

    }, err => {
      this.notify.showToastrError('Alert', 'API failed to ' + action + ' feature group');
    });
  }

  createGroup(details) {
    this.featureGrp = { dataArr: [...details.featureGroup, details.newGroupName], selVal: details.newGroupName, enable: true };

  }

  deleteFeatureGroup(action, details) {
    const data = { db_name: details.selectedDataSet, group_name: details.selectedFeaturegroup };
    this.correlationService.deleteCorrelatedGroup(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
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
      this.correlationService.correlationDetails = evt;
      this.router.navigate(['/' + this.global.prefixUrl + '/correlation/heatmap']);
    } else if (evt.action === 'featureGrp') {
      this.getAllFeatureByGroup(evt.details.selectedDataSet, evt.details.selectedFeaturegroup);
    } else if (evt.action === 'dataSet') {
      this.resetAllOnDataSetChange(evt.details.selectedDataSet);
    } else if (evt.action === 'create') {
      this.upsertGroup(evt.action, evt.details);
    } else if (evt.action === 'update') {
      this.upsertGroup(evt.action, evt.details);
    } else if (evt.action === 'deletegroup') {
      this.deleteFeatureGroup(evt.action, evt.details);
    }

  }


}
