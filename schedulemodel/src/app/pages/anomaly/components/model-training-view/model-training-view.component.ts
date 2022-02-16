import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnomalyService } from '../../services/anomaly.service';
import { MatDialog } from '@angular/material/dialog';
import { ModelConfigViewComponent } from '../../dialogs/model-config-view/model-config-view.component';
import { DataPreviewComponent } from '../../dialogs/data-preview/data-preview.component';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { GlobalService } from 'src/app/services/global.service';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { SUBSCRIPTIONS } from 'src/app/constants/app.constants';


@Component({
  selector: 'app-model-training-view',
  templateUrl: './model-training-view.component.html',
  styleUrls: ['./model-training-view.component.scss']
})
export class ModelTrainingViewComponent implements OnInit, OnDestroy {
  socket;

  taskCompleted = false;
  modelTrainingName = '';
  triningModel;
  anmdTrResLoading = true;
  modelTrainingData;
  disableDetectAnomalyBtn = false;
  activeBackUrl = this.anomalyService.activatedPath.replace(/\/modeltraining.*$/, '');
  constructor(
    public anomalyService: AnomalyService,
    public dialog: MatDialog,
    private router: Router,
    public global: GlobalService,
    private appScheduler: AppSchedulerService,
    private notfyService: NotificationService) {}

  ngOnInit() {
    this.modelTrainingName = this.anomalyService.AnomalyModelTrainingName;
    if (!this.anomalyService.AnomalySelectedTrainingModel) {
      this.router.navigate([this.activeBackUrl]);
    } else {
      if (this.modelTrainingName) {
        this.taskCompleted = true;
      } else {
        this.taskCompleted = false;
      }
      this.triningModel = this.anomalyService.AnomalySelectedTrainingModel;
      this.getTrainingResults();
      this.scheduleSoc('5s');
    }
    this.anomalyService.AnomalyModelTraining = true;
  }

  openModelConfigDialog(model) {
    const dialogRef = this.dialog.open(ModelConfigViewComponent, {
      width: '90%',
      disableClose: true,
      maxHeight: '80vh',
      data: { modelConfigName: model.modelConfigName, jobType: model.jobType },
      panelClass: 'anmaly-model-config-dialog'
    });
    dialogRef.afterClosed().subscribe(res => {

    });
  }
  getTrainingResults() {
    this.anmdTrResLoading = true;
    const data = { modelId: this.triningModel.uid };
    this.anomalyService.getAnomalyDetTrainingResultDetails(data).subscribe((res: any) => {
      this.anmdTrResLoading = false;
      if (res.status === 'success') {

        this.modelTrainingData = res.data;
        this.modelTrainingData.speedDisp = this.modelTrainingData.speed
          && !isNaN(this.modelTrainingData.speed) ? Math.round(this.modelTrainingData.speed * 1000) / 1000 : null;
        this.modelTrainingData.cpuUsageDisp = this.modelTrainingData.cpuUsage
          && !isNaN(this.modelTrainingData.cpuUsage) ? Math.round(this.modelTrainingData.cpuUsage * 100) : null;
        this.modelTrainingData.cpuMemoryUsageDisp = this.modelTrainingData.cpuMemoryUsage
          && !isNaN(this.modelTrainingData.cpuMemoryUsage) ? Math.round(this.modelTrainingData.cpuMemoryUsage * 100) : null;
        this.modelTrainingData.gpuUsageDisp = this.modelTrainingData.gpuUsage
          && !isNaN(this.modelTrainingData.gpuUsage) ? Math.round(this.modelTrainingData.gpuUsage * 100) : null;
        this.modelTrainingData.gpuMemoryUsageDisp = this.modelTrainingData.gpuMemoryUsage
          && !isNaN(this.modelTrainingData.gpuMemoryUsage) ? Math.round(this.modelTrainingData.gpuMemoryUsage * 100) : null;
        if (this.modelTrainingData.modelName && this.modelTrainingData.modelName.includes('.')) {
          const modList = this.modelTrainingData.modelName.split('.');
          this.modelTrainingData.modelNameDisp = modList[0];
        } else {
          this.modelTrainingData.modelNameDisp = this.modelTrainingData.modelName;
        }
        if (this.modelTrainingData.featureImportance) {
          this.modelTrainingData.featureImportance = Object.keys(res.data.featureImportance).map((x) => {
            return {
              key: x,
              value: res.data.featureImportance[x],
              color: +res.data.featureImportance[x] < 0 ? 'warn' : '',
              barVal: Math.abs(res.data.featureImportance[x]),
              displayValue: Math.round(res.data.featureImportance[x] * 1000) / 1000,
              count: 0
            };
          });
        }
        if (!this.modelTrainingData.threshold) {
          this.modelTrainingData.threshold = 0.001;
        }
        // if (this.modelTrainingData.accuracy && this.modelTrainingData.accuracy.length && this.modelTrainingData.accuracy.length > 0) {
        //   if (this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] &&
        //     !isNaN(Number(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1]))) {
        //     this.modelTrainingData.accuracyDisp =
        //       Math.round(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] * 1000) / 1000;
        //     if (this.modelTrainingData.accuracyDisp === 1) {
        //       this.modelTrainingData.accuracyDisp =
        //         Math.floor(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] * 1000) / 1000;
        //     }
        //   } else {
        //     this.modelTrainingData.accuracyDisp = 'NA';
        //   }
        // }

        this.modelTrainingData.accuracyDisp = this.createAccuracy(this.modelTrainingData.accuracy);

        if (this.modelTrainingData.numberOfComponents &&
          this.modelTrainingData.numberOfComponents.length && this.modelTrainingData.numberOfComponents.length > 0) {
          this.modelTrainingData.numberOfComponentsDisp =
            !isNaN(Number(this.modelTrainingData.numberOfComponents[this.modelTrainingData.numberOfComponents.length - 1]))
              ?
              this.modelTrainingData.numberOfComponents[this.modelTrainingData.numberOfComponents.length - 1]
              :
              'NA';
        }
        if (this.modelTrainingData.progress) {
          if (this.modelTrainingData.progress.includes('/')) {
            if (this.modelTrainingData.progress.includes(':')) {
              this.modelTrainingData.progress = this.modelTrainingData.progress.split(':')[0];
            }
            const arr = this.modelTrainingData.progress.split('/');
            if (arr.length > 1) {
              this.modelTrainingData.progressPer = Math.round((+arr[0] / +arr[1]) * 100);
              this.modelTrainingData.progress = this.modelTrainingData.progressPer;
            }
          } else if (!isNaN(Number(this.modelTrainingData.progress))) {
            if (Number(this.modelTrainingData.progress) > 1) {
              this.modelTrainingData.progressPer = Math.round(+this.modelTrainingData.progress);
              this.modelTrainingData.progress = this.modelTrainingData.progressPer;
            } else if (Number(this.modelTrainingData.progress) <= 1) {
              this.modelTrainingData.progressPer = Math.round(+this.modelTrainingData.progress * 100);
              this.modelTrainingData.progress = this.modelTrainingData.progressPer;
            }
          } else {
            this.modelTrainingData.progressPer = 0;
            this.modelTrainingData.progress = this.modelTrainingData.progressPer;
          }
        }
      }
      this.scheduleSoc('5s');
    }, (error) => {
      this.notfyService.showToastrError('Alert', 'Failed to fetch data');
      this.router.navigate([this.activeBackUrl]);
      this.anmdTrResLoading = false;
    });
  }

  openDataPreviewDialog() {
    const dialogRef = this.dialog.open(DataPreviewComponent, {
      width: '90%',
      disableClose: true,
      height: '80%',
      panelClass: 'data-preview-modalbox',
      data: { dataSetName : this.modelTrainingData.dataSetName,
        fromTime : this.modelTrainingData.fromTime,
        toTime : this.modelTrainingData.toTime,
        pageNumber : 1,
        pageSize : 25
      }
    });
    dialogRef.afterClosed().subscribe(res => {
    });
  }
  executionJobtype(jobType) {
    if (jobType === 'ANOMALYTRAINING1') {
      return 'ANOMALYEXECUTION1';
    } else if (jobType === 'ANOMALYTRAINING2') {
      return 'ANOMALYEXECUTION2';
    } else if (jobType === 'ASCTRAINING') {
      return 'ASCEXECUTION';
    } else {
      return jobType;
    }
  }

  detectAnomaly() {
    if (this.anomalyService.AnomalySelectedTrainingModel && this.anomalyService.AnomalySelectedTrainingModel.uid) {
      const data = {
        dataRange: this.modelTrainingData.dataRange,
        dataSetName: this.modelTrainingData.dataSetName,
        jobStatus: 'SCHEDULED',
        // jobType: 'EXECUTION',
        jobType: this.executionJobtype(this.modelTrainingData.jobType),
        modelConfigName: this.modelTrainingData.modelConfigName,
        modelId: this.anomalyService.AnomalySelectedTrainingModel.uid,
        modelName: this.modelTrainingData.modelName,
        // modelType: this.modelTrainingData.modelType,
        scheduleName: this.modelTrainingData.scheduleName,
        threshold: this.modelTrainingData.threshold,
      };
      this.anomalyService.scheduleDetectAnomaly(data).subscribe((res: any) => {
        if (res.status === 'success') {
          this.disableDetectAnomalyBtn = true;
          this.notfyService.showToastrSuccess('Success', 'Detect Anomaly');
        } else {
          this.notfyService.showToastrWarning('Failed', 'Detect Anomaly');
        }
      }, (error) => {
        this.notfyService.showToastrError('Error', 'Detect Anomaly');
      });
    } else {
      this.notfyService.showToastrWarning('Failed', 'Invalid model');
    }
  }
  deleteModel() {
    const selectedTrainedModels = [this.modelTrainingData.uid];
    if (selectedTrainedModels.length > 0) {
      this.global.opendisplayModal('Do you wish to delete the trained models', 'Confirm', 'Delete Trained Model', true)
        .subscribe(result => {
          if (result === 'save') {
            // const delTrainedModel = selectedTrainedModels.map(it => {
            //   // tslint:disable-next-line:prefer-const
            //   let tempModelObj = Object.assign({}, it);
            //   delete tempModelObj.checkboxdata;
            //   return tempModelObj;
            // });
            const data = { trainedModels: selectedTrainedModels};
            this.anomalyService.deleteTrainedModels(data).subscribe((resp: any) => {
              if (resp && resp.status === 'success' && resp.data.deletedCount !== 0) {
                this.notfyService.showToastrSuccess('Success', 'Trained Model deleted successfully.');
                this.router.navigate([this.activeBackUrl]);
              } else {
                this.notfyService.showToastrWarning('Alert', 'Exception occured');
              }

            }, err => {
              this.notfyService.showToastrError('Alert', 'Server error occured');
            });
          }
        });
    } else {
      this.global.opendisplayModal('Please select atleast one trained model to proceed with the action', 'OK', 'Alert');
    }

  }

  createStopObject(dataObj) {
    const newObject = {
      // accuracy: dataObj.accuracy ? dataObj.accuracy : '',
      // cpuMemoryUsage: dataObj.cpuMemoryUsage ? dataObj.cpuMemoryUsage : '',
      // cpuUsage: dataObj.cpuUsage ? dataObj.cpuUsage : '',
      dataRange: dataObj.dataRange ? dataObj.dataRange : '',
      dataSetName: dataObj.dataSetName ? dataObj.dataSetName : '',
      // encoderName: dataObj.encoderName ? dataObj.encoderName : '',
      // featureImportance: dataObj.featureImportance ? dataObj.featureImportance : [],
      fromTime: dataObj.fromTime ? dataObj.fromTime : '',
      // gpuMemoryUsage: dataObj.gpuMemoryUsage ? dataObj.gpuMemoryUsage : '',
      // gpuUsage: dataObj.gpuUsage ? dataObj.gpuUsage : '',

      jobStatus: 'COMPLETED',
      // jobType: 'TRAINING',
      jobType: this.executionJobtype(dataObj.jobType),
      // loss: dataObj.loss ? dataObj.loss : [],
      // lossFunction: dataObj.lossFunction ? dataObj.lossFunction : '',
      modelConfigName: dataObj.modelConfigName ? dataObj.modelConfigName : '',
      // modelName: dataObj.modelName ? dataObj.modelName : '',
      // modelType: dataObj.modelType ? dataObj.modelType : '',
      // numberOfComponents: dataObj.numberOfComponents ? dataObj.numberOfComponents : [],
      // numberofObservation: dataObj.numberofObservation ? dataObj.numberofObservation : '',
      // progress: dataObj.progress ? dataObj.progress : '',
      // scalerName: dataObj.scalerName ? dataObj.scalerName : '',
      scheduleId: dataObj.scheduleId ? dataObj.scheduleId : '',
      scheduleName: dataObj.scheduleName ? dataObj.scheduleName : '',
      // startTime: dataObj.startTime ? dataObj.startTime : '',
      // timeUsed: dataObj.timeUsed ? dataObj.timeUsed : '',
       toTime: dataObj.toTime ? dataObj.toTime : '',
      uid: dataObj.uid ? dataObj.uid : '',
      // validationLoss: dataObj.validationLoss ? dataObj.validationLoss : [],
      // validatonAcurracy: dataObj.validatonAcurracy ? dataObj.validatonAcurracy : []
    };

    return Object.assign({}, newObject);
  }

  stopTraining() {
    if (this.modelTrainingData) {
      this.global.opendisplayModal('Do you wish to stop this training model', 'Confirm', 'Stop Training Model', true)
        .subscribe(result => {
          if (result === 'save') {
            const data = { trainedModels: this.createStopObject(this.modelTrainingData)};
            this.anomalyService.stopTrainedModels(data).subscribe((resp: any) => {
              if (resp && resp.status === 'success' && resp.data.deletedCount !== 0) {
                this.notfyService.showToastrSuccess('Success', 'Training Model stopped successfully.');
                this.router.navigate([this.activeBackUrl]);
              } else {
                this.notfyService.showToastrWarning('Alert', 'Exception occured');
              }

            }, err => {
              this.notfyService.showToastrError('Alert', 'Server error occured');
            });
          }
        });
    } else {
      this.global.opendisplayModal('Training model details are not available to proceed with the action', 'OK', 'Alert');
    }
  }

  createAccuracy(accuracy) {
    let accuracyDisp;
    if (accuracy && accuracy.length && accuracy.length > 0) {
      if (typeof (accuracy) == 'string') {
        accuracyDisp = accuracy ? (accuracy).toString() : 'NA';
      }
      else {
        if (!isNaN(Number(accuracy[accuracy.length - 1]))) {
          accuracyDisp = (accuracy[accuracy.length - 1]).toString();
        }
      }
    }

    else {
      accuracyDisp = 'NA';
    }

    return accuracyDisp;
  }

  scheduleSoc(value) {
    const id = this.appScheduler.getSessionId();
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ANMD_RESULT, this.triningModel.uid), message => {
          const payload = JSON.parse(message.body);
          that.updateLiveData(payload);
        });
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateLiveData(data) {
    if (data) {
      this.modelTrainingData = data;
      this.modelTrainingData.speedDisp = this.modelTrainingData.speed
        && !isNaN(this.modelTrainingData.speed) ? Math.round(this.modelTrainingData.speed * 1000) / 1000 : null;
      this.modelTrainingData.cpuUsageDisp = this.modelTrainingData.cpuUsage
        && !isNaN(this.modelTrainingData.cpuUsage) ? Math.round(this.modelTrainingData.cpuUsage * 100) / 100 : null;
      this.modelTrainingData.cpuMemoryUsageDisp = this.modelTrainingData.cpuMemoryUsage
        && !isNaN(this.modelTrainingData.cpuMemoryUsage) ? Math.round(this.modelTrainingData.cpuMemoryUsage * 100) / 100 : null;
      this.modelTrainingData.gpuUsageDisp = this.modelTrainingData.gpuUsage
        && !isNaN(this.modelTrainingData.gpuUsage) ? Math.round(this.modelTrainingData.gpuUsage * 100) / 100 : null;
      this.modelTrainingData.gpuMemoryUsageDisp = this.modelTrainingData.gpuMemoryUsage
        && !isNaN(this.modelTrainingData.gpuMemoryUsage) ? Math.round(this.modelTrainingData.gpuMemoryUsage * 100) / 100 : null;
      if (this.modelTrainingData.modelName && this.modelTrainingData.modelName.includes('.')) {
        const modList = this.modelTrainingData.modelName.split('.');
        this.modelTrainingData.modelNameDisp = modList[0];
      } else {
        this.modelTrainingData.modelNameDisp = this.modelTrainingData.modelName;
      }
      if (this.modelTrainingData.featureImportance) {
        this.modelTrainingData.featureImportance = Object.keys(data.featureImportance).map((x) => {
          return {
            key: x,
            value: data.featureImportance[x],
            color: +data.featureImportance[x] < 0 ? 'warn' : '',
            barVal: Math.abs(data.featureImportance[x]),
            displayValue: Math.round(data.featureImportance[x] * 1000) / 1000,
            count: 0
          };
        });
      }
      if (!this.modelTrainingData.threshold) {
        this.modelTrainingData.threshold = 0.001;
      }
      // if (this.modelTrainingData.accuracy && this.modelTrainingData.accuracy.length && this.modelTrainingData.accuracy.length > 0) {
      //   if (this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] &&
      //     !isNaN(Number(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1]))) {
      //     this.modelTrainingData.accuracyDisp =
      //       Math.round(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] * 1000) / 1000;
      //     if (this.modelTrainingData.accuracyDisp === 1) {
      //       this.modelTrainingData.accuracyDisp =
      //         Math.floor(this.modelTrainingData.accuracy[this.modelTrainingData.accuracy.length - 1] * 1000) / 1000;
      //     }
      //   } else {
      //     this.modelTrainingData.accuracyDisp = 'NA';
      //   }
      // }

      this.modelTrainingData.accuracyDisp = this.createAccuracy(this.modelTrainingData.accuracy);

      if (this.modelTrainingData.numberOfComponents &&
        this.modelTrainingData.numberOfComponents.length && this.modelTrainingData.numberOfComponents.length > 0) {
        this.modelTrainingData.numberOfComponentsDisp =
          !isNaN(Number(this.modelTrainingData.numberOfComponents[this.modelTrainingData.numberOfComponents.length - 1]))
            ?
            this.modelTrainingData.numberOfComponents[this.modelTrainingData.numberOfComponents.length - 1]
            :
            'NA';
      }
      if (this.modelTrainingData.progress) {
        if (this.modelTrainingData.progress.includes('/')) {
          if (this.modelTrainingData.progress.includes(':')) {
            this.modelTrainingData.progress = this.modelTrainingData.progress.split(':')[0];
          }
          const arr = this.modelTrainingData.progress.split('/');
          if (arr.length > 1) {
            this.modelTrainingData.progressPer = Math.round((+arr[0] / +arr[1]) * 100);
            this.modelTrainingData.progress = this.modelTrainingData.progressPer;
          }
        } else if (!isNaN(Number(this.modelTrainingData.progress))) {
          if (Number(this.modelTrainingData.progress) > 1) {
            this.modelTrainingData.progressPer = Math.round(+this.modelTrainingData.progress);
            this.modelTrainingData.progress = this.modelTrainingData.progressPer;
          } else if (Number(this.modelTrainingData.progress) <= 1) {
            this.modelTrainingData.progressPer = Math.round(+this.modelTrainingData.progress * 100);
            this.modelTrainingData.progress = this.modelTrainingData.progressPer;
          }
        } else {
          this.modelTrainingData.progressPer = 0;
          this.modelTrainingData.progress = this.modelTrainingData.progressPer;
        }
      }
    }
  }
  ngOnDestroy() {
    this.anomalyService.AnomalyTaskName = '';
    this.anomalyService.AnomalyModelTrainingName = '';
    this.anomalyService.AnomalyModelTraining = false;
    this.appScheduler.disconnectSocket();
  }




}
