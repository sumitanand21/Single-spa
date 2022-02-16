
import { Component, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import { AnomalyService } from '../../services/anomaly.service';
import { GlobalService } from 'src/app/services/global.service';
import { MatDialog } from '@angular/material/dialog';
import { UpsertTasksComponent } from '../../dialogs/upsert-tasks/upsert-tasks.component';
import { NotificationService } from 'src/app/services/notification.service';
import { AppSchedulerService } from 'src/app/services/app-scheduler.service';
import { PATHS, SUBSCRIPTIONS } from 'src/app/constants/app.constants';

@Component({
  selector: 'app-all-tasks',
  templateUrl: './all-tasks.component.html',
  styleUrls: ['./all-tasks.component.scss']
})
export class AllTasksComponent implements OnInit, AfterViewChecked, OnDestroy {
  tableLoader = false;
  isRefreshLoading = false;
  scheduleLoader = false;
  selectedJobType = [];
  statusLoader = false;
  modelLoader = false;
  selectedModelType = '';
  jobTypeArr = ['ANOMALYTRAINING1', 'ANOMALYTRAINING2', 'ASCTRAINING'];
  datasetArr = [];
  selectedStatus = [];
  statusArr = ['ACTIVE', 'SCHEDULED', 'PAUSED', 'COMPLETED'];
  edittemplate: any;
  input: any;
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  isShown = true;
  datasetView = '';
  dyn: any;
  selectedRow = 0;
  selectedRowTask = 0;
  defaultCurrentPage = 1;
  defauultItempg = 25;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  searchFilter = '';
  testdata: any;
  selectedTask;
  taskScheDetails;
  disableSocketDrop = true;
  trainingStatusDetails: any = [];
  refreshmatdata = 'off';
  refreshDataset = [
    '5s',
    '10s',
    '15s',
    '30s',
    '1m',
    '5m',
    '10m',
    '15m',
    '30m',
    '1h'
  ];
  pageArr = [25, 50, 100];
  config = {
    id: 'trainedModelPaginate',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  key = 'modelNameDisp';
  reverse = false;
  keyTask = 'schedule_status';
  reverseTask = false;

  trainedModels = [];
  alltasksData: any[] = [];
  itemPerPageTask = this.defauultItempg;
  searchFilterTask = '';
  inputCurrentpageTask = this.defaultCurrentPage;
  configTask = {
    id: 'taskPaginate',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  AlltasksFilter = {
    schedule_name: this.searchFilterTask, schedule_status: { $or: [this.selectedStatus] }
  };
  socket;
  selectedConfiguration: any = null;
  constructor(
    public global: GlobalService,
    public anomalyService: AnomalyService,
    private router: Router,
    public dialog: MatDialog,
    private appScheduler: AppSchedulerService,
    private notfyService: NotificationService) { }

  ngOnInit() {
    this.anomalyService.AnomalyAllTask = true;
    this.getdatatableAPI(true);
  }

  ngAfterViewChecked() {
    if (this.tableLoader || this.scheduleLoader ||
      this.statusLoader || this.modelLoader) {
      this.anomalyService.disableheader = true;
    } else {
      this.anomalyService.disableheader = false;
    }
  }
  click(selected: boolean) {
    console.log(selected);
    this.dyn = selected;
  }
  checkboxTypeChange(event, value) {
    this.selectedStatus = [...value];
    if (this.selectedStatus.length === 0) {
      this.AlltasksFilter.schedule_status.$or = [this.selectedStatus];
    } else {
      this.AlltasksFilter.schedule_status.$or = this.selectedStatus;
    }
    this.clearSelection();
  }
  datasetChange() {
    this.clearSelection();
    // this.AlltasksFilter.dataSetName = this.datasetView;
  }
  modelTypeChange() {
    this.clearSelection();
    // this.AlltasksFilter.modelType = this.selectedModelType;
  }
  onsearchChange(searchVal, paginationId) {
    if (paginationId === 'taskPaginate') {
      this.inputCurrentpageTask = this.defaultCurrentPage;
      this.configTask.currentPage = this.defaultCurrentPage;
      this.AlltasksFilter.schedule_name = searchVal;
      this.clearSelection();
    } else if (paginationId === 'trainedModelPaginate') {
      this.inputCurrentpage = this.defaultCurrentPage;
      this.config.currentPage = this.defaultCurrentPage;
    }
  }
  // change page on input
  changepageinp(inputVal, lastpage, paginationId) {
    if (inputVal < 1 || inputVal > lastpage) {
      if (paginationId === 'taskPaginate') {
        this.inputCurrentpageTask = this.configTask.currentPage;
      } else if (paginationId === 'trainedModelPaginate') {
        this.inputCurrentpage = this.config.currentPage;
      }
    } else {
      if (paginationId === 'taskPaginate') {
        this.configTask.currentPage = inputVal;
        this.clearSelection();
      } else if (paginationId === 'trainedModelPaginate') {
        this.config.currentPage = inputVal;
      }
    }
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  // onpage change
  changepage(evt, paginationId) {
    if (paginationId === 'taskPaginate') {
      this.configTask.currentPage = evt;
      this.inputCurrentpageTask = evt;
      this.clearSelection();
    } else if (paginationId === 'trainedModelPaginate') {
      this.config.currentPage = evt;
      this.inputCurrentpage = evt;
    }

  }

  // set new page size for pagination
  setNewPageSize(pageSize, paginationId) {
    if (paginationId === 'taskPaginate') {
      this.configTask.itemsPerPage = pageSize;
      this.configTask.currentPage = this.defaultCurrentPage;
      this.inputCurrentpageTask = this.defaultCurrentPage;
      this.clearSelection();
    } else if (paginationId === 'trainedModelPaginate') {
      this.config.itemsPerPage = pageSize;
      this.config.currentPage = this.defaultCurrentPage;
      this.inputCurrentpage = this.defaultCurrentPage;
    }


  }

  setTask(trainedModel) {
    this.anomalyService.AnomalyTaskName = this.selectedTask.schedule_name;
    this.anomalyService.AnomalyModelTrainingName = trainedModel.modelName ? trainedModel.modelName : '';
    if (this.anomalyService.AnomalyModelTrainingName.includes('.')) {
      const modList = this.anomalyService.AnomalyModelTrainingName.split('.');
      this.anomalyService.AnomalyModelTrainingNameDisp = modList[0];
    } else {
      this.anomalyService.AnomalyModelTrainingNameDisp = this.anomalyService.AnomalyModelTrainingName;
    }
    this.anomalyService.AnomalySelectedTrainingModel = trainedModel;
    this.router.navigate(['/' + this.global.prefixUrl + '/schedule/alltask/modeltraining']);

  }
  openUpsertTaskDialog(action, task?): void {
    const details = { action, task: task ? task : null };
    const dialogRef = this.dialog.open(UpsertTasksComponent, {
      width: '800px',
      disableClose: true,
      data: details,
      panelClass: 'create-task-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getdatatableAPI(true);
      }
    });
  }

  ngOnDestroy() {
    this.anomalyService.AnomalyAllTask = false;
    this.appScheduler.disconnectSocket();
  }
  uniquearrayValue(selectedArray, key) {
    // tslint:disable-next-line:prefer-const
    let tempData = [];
    selectedArray.forEach((val, index, self) => {
      const newVal = val && val[key] ? val[key] : '';
      const selIndex = newVal ? self.findIndex(it => it[key] === newVal) : -1;
      if (newVal && selIndex === index) {
        tempData.push(newVal);
      }
    });
    return tempData;
  }
  // Toast Messages Code Ends here
  getdatatableAPI(enableLoader, refresh?) {
    // let userData = { dataSetName: this.selecteddata };
    if (enableLoader) {
      this.tableLoader = true;
    } else if (refresh) {
      this.isRefreshLoading = true;
    }
    this.anomalyService.getalltasksData().subscribe((res: any) => {
      this.tableLoader = false;
      this.isRefreshLoading = false;
      console.log('this.alltasksData...', res);
      if (res.status === 'success') {
        //const taskstableData =
        this.alltasksData = res && res.data ? res.data : [];
        // this.alltasksData = this.alltasksData.filter((el) => el.jobType !== 'ANOMALY' && el.jobType !== 'FORECAST');
        if (this.alltasksData.length && this.alltasksData.length > 0) {
          this.alltasksData = this.alltasksData.sort((a, b) => {
            if (a[this.keyTask] > b[this.keyTask]) {
              return 1;
            }
            if (a[this.keyTask] < b[this.keyTask]) {
              return -1;
            }
            return 0;
          });
        }
        const selectedTask = this.alltasksData.length > 0 ?
          this.alltasksData[0] : null;
        // set the 1st item from table , to display respective details in right panel
        if (refresh) {
          this.clearSelection();
        } else {
          this.getTaskDetails(selectedTask, 0, enableLoader);

        }
        this.datasetArr = this.uniquearrayValue(this.alltasksData, 'dataSetName');
        // this.scheduleSoc('5s');
      } else {
        this.alltasksData = [];
        this.clearSelection();
        // this.getTaskDetails(null, 0, enableLoader);
        this.notfyService.showToastrWarning('Alert', 'Exception occured');
        this.tableLoader = false;
        this.isRefreshLoading = false;
      }
    }, err => {
      this.alltasksData = [];
      // this.getTaskDetails(null, 0, enableLoader);
      this.clearSelection();
      this.notfyService.showToastrError('Alert', 'Server error occured');
      this.tableLoader = false;
      this.isRefreshLoading = false;
    });

  }


  getTaskDetails(selectedItem, selRow, enableLoader) {
    if (enableLoader) {
      this.trainedModels = [];
      this.trainingStatusDetails = [];
      this.taskScheDetails = {};
    }
    if (selectedItem) {
      // this.selectedRowTask = selRow;
      this.selectedConfiguration = Object.assign({}, selectedItem);
      this.selectedTask = selectedItem;
      this.scheduleDetails(enableLoader);
      this.getTrainedModels(enableLoader);
      this.getTrainingStatus(enableLoader);
    } else {
      this.selectedTask = null;
    }

  }

  scheduleDetails(enableLoader) {
    if (enableLoader) {
      this.scheduleLoader = true;
    }
    const scheduleId = this.selectedTask.schedule_id;
    this.anomalyService.getScheduleDetails(scheduleId).subscribe((result: any) => {
      this.scheduleLoader = false;
      if (result.status === 'success') {
        this.taskScheDetails.task = result.data;
        this.taskScheDetails.next_run_time = (result.data.next_run) ? result.data.next_run : null;
        this.taskScheDetails.modelConfigName = (result.data.data.modelConfigName) ? result.data.data.modelConfigName : '-';
        this.taskScheDetails.data_range =
          (result.data.data.frequency) ? result.data.data.dataRange + ' ' + result.data.data.frequency : '-';
        this.taskScheDetails.jobType = (result.data.data.jobType) ? result.data.data.jobType : '';
        this.taskScheDetails.frequency = result.data.recur_on.toLowerCase() === 'weekly' ?
          result.data.recur_on + ' ( ' + result.data.schedule_day + ' )' : result.data.recur_on;
        this.taskScheDetails.schedule_start_time = (result.data.schedule_from) ? result.data.schedule_from : '-';
        this.taskScheDetails.schedule_end_time = (result.data.schedule_to) ? result.data.schedule_to : '-';
        this.taskScheDetails.job_status = (result.data.job_status) ? result.data.job_status : null;

      } else {
        this.taskScheDetails = {};
        this.notfyService.showToastrWarning('Alert', 'API failed to fetch schedule details');
        this.scheduleLoader = false;
        this.taskScheDetails.job_status = null;
      }
    }, (error) => {
      this.taskScheDetails = {};
      this.notfyService.showToastrError('Alert', 'Exception while fetching schedule details');
      this.scheduleLoader = false;
      this.taskScheDetails.job_status = null;
    });
  }


  getTrainedModels(enableLoader) {
    if (enableLoader) {
      this.modelLoader = true;
    }
    this.itemPerPage = this.defauultItempg;
    this.inputCurrentpage = this.defaultCurrentPage;
    this.searchFilter = '';
    this.config.currentPage = this.defaultCurrentPage;
    this.config.itemsPerPage = this.defauultItempg;
    const data = { schedule_name: this.selectedTask.schedule_name };
    this.anomalyService.getTrainedModelDetails(data).subscribe((res: any) => {
      this.modelLoader = false;
      if (res && res.status === 'success') {
        const tempModel = res.data && res.data.length > 0 ? res.data : [];
        this.trainedModels = tempModel.map(it => {
          if (it.modelName && it.modelName.includes('.')) {
            const modList = it.modelName.split('.');
            it.modelNameDisp = modList[0];
          } else {
            it.modelNameDisp = it.modelName;
          }

          //Changed
          // if (it.accuracy && it.accuracy.length && it.accuracy.length > 0) {
          //   if (it.accuracy[it.accuracy.length - 1] && !isNaN(Number(it.accuracy[it.accuracy.length - 1]))) {
          //     it.accuracyDisp = Math.round(it.accuracy[it.accuracy.length - 1] * 1000) / 1000;
          //     if (it.accuracyDisp === 1) {
          //       it.accuracyDisp = Math.floor(it.accuracy[it.accuracy.length - 1] * 1000) / 1000;
          //     }
          //   } else {
          //     it.accuracyDisp = 'NA';
          //   }
          // }

          it.accuracyDisp = this.createAccuracy(it.accuracy);
          it.checkboxdata = false;
          return it;
        }
        );
      } else {
        this.trainedModels = [];
        this.notfyService.showToastrWarning('Alert', 'API failed in fetching trained models');
        this.modelLoader = false;
      }
    }, (error) => {
      this.trainedModels = [];
      this.modelLoader = false;
      this.notfyService.showToastrError('Alert', 'Exception while fetching trained models');
    });
  }

  getTrainingStatus(enableLoader) {
    if (enableLoader) {
      this.statusLoader = true;
    }
    // debugger;
    const data = { jobType: this.selectedTask.job_type, schedule_name: this.selectedTask.schedule_name };
    this.anomalyService.getTrainingStatusDetails(data).subscribe((res: any) => {
      console.log('data...', res);
      this.statusLoader = false;
      if (res && res.status === 'success') {
        this.trainingStatusDetails = res.data && res.data.length > 0 ? res.data : [];
        if (this.trainingStatusDetails) {
          this.trainingStatusDetails = this.trainingStatusDetails.map((x) => {
            // if (
            //   x.jobStatus.toLowerCase() === 'training'
            // || x.jobStatus.toLowerCase() === 'running'
            // || x.jobStatus.toLowerCase() === 'active'
            // ) {
            //   const taskTemp = this.alltasksData.find((el) => el.schedule_id === this.selectedTask.schedule_id);
            //   taskTemp.schedule_status = 'ACTIVE';
            // }

            //Changed
            // if (x.accuracy && x.accuracy.length && x.accuracy.length > 0) {
            //   if (x.accuracy[x.accuracy.length - 1] && !isNaN(Number(x.accuracy[x.accuracy.length - 1]))) {
            //     x.accuracyDisp = Math.round(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
            //     if (x.accuracyDisp === 1) {
            //       x.accuracyDisp = Math.floor(x.accuracy[x.accuracy.length - 1] * 1000) / 1000;
            //     }
            //   } else {
            //     x.accuracyDisp = 'NA';
            //   }
            // }

            x.accuracyDisp = this.createAccuracy(x.accuracy);

            if (x.progress) {
              if (x.progress.includes('/')) {
                if (x.progress.includes(':')) {
                  x.progress = x.progress.split(':')[0];
                }
                const arr = x.progress.split('/');
                if (arr.length > 1) {
                  x.progressPer = Math.round((+arr[0] / +arr[1]) * 100);
                  x.progress = x.progressPer;
                }
              } else if (!isNaN(Number(x.progress))) {
                if (Number(x.progress) > 1) {
                  x.progressPer = Math.round(+x.progress);
                  x.progress = x.progressPer;
                } else if (Number(x.progress) <= 1) {
                  x.progressPer = Math.round(+x.progress * 100);
                  x.progress = x.progressPer;
                }
              } else {
                x.progressPer = 0;
                x.progress = x.progressPer;
              }
            }
            return x;
          });
        }
        this.scheduleSoc('5s');
      } else {
        this.trainingStatusDetails = [];
        this.notfyService.showToastrWarning('Alert', 'API failed in fetching training status');
        this.statusLoader = false;
      }
    }, (error) => {
      this.trainingStatusDetails = [];
      this.statusLoader = false;
      this.notfyService.showToastrError('Alert', 'Exception while fetching training status');
    });
  }

  deleteTrainedModels() {
    const selectedTrainedModels = this.trainedModels.filter(it => it.checkboxdata === true);
    if (selectedTrainedModels.length > 0) {
      this.global.opendisplayModal('Do you wish to delete the selected trained models', 'Confirm', 'Delete Trained Models', true)
        .subscribe(result => {
          if (result === 'save') {
            const delTrainedModel = selectedTrainedModels.map(it => {
              return it.uid;
            });
            const data = { trainedModels: delTrainedModel };
            this.anomalyService.deleteTrainedModels(data).subscribe((resp: any) => {
              if (resp && resp.status === 'success' && resp.data.deletedCount !== 0) {
                this.notfyService.showToastrSuccess('Success', 'Trained Models deleted successfully.');
                this.removeTrainedModelFromList(selectedTrainedModels);

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

  removeTrainedModelFromList(selectedTrainedModels) {
    selectedTrainedModels.forEach(it => {
      const index = this.trainedModels.findIndex(item => item.id === it.id);
      this.trainedModels.splice(index, 1);
    });
    this.notfyService.showToastrSuccess('Success', 'Trained Models deleted successfully.');
  }
  deleteTask(actionType) {
    // tslint:disable-next-line:prefer-const
    let selectedTaskIds = [];
    const taskName = this.selectedTask.schedule_name;
    const confirmationMsg1 = 'Delete Task, ' + taskName + ' will permanently remove the schedule.';
    const confirmationMsg2 = 'You may use "Pause" to stop any up-coming schedules and re-use the schedule for future activities .';
    this.global.opendisplayModal(confirmationMsg1 + confirmationMsg2, 'Confirm', 'Task Deletion', true).subscribe(res => {
      if (res === 'save') {
        selectedTaskIds.push(this.selectedTask.schedule_id);
        const data = {
          id: JSON.stringify(selectedTaskIds),
          actionType
        };
        console.log('delete...Data', data);
        this.anomalyService.actionOnTask(data).subscribe((result: any) => {
          if (result.status === 'success') {
            console.log('inside delete if', result);
            this.removeTaskFromList(this.selectedTask.schedule_id);
            // this.getTaskDetails(this.alltasksData[0], 0, true);
            this.notfyService.showToastrSuccess('Success', 'Successfully Deleted');

          } else {
            console.log('inside delete else', result);
            this.notfyService.showToastrSuccess('Failed', 'API Failed to trigger');
          }
        }, (error) => {
          this.notfyService.showToastrError('Failed', 'Failed in reaching server ');

        });
      }
    });

  }

  pauseTask(actionType) {
    // tslint:disable-next-line:prefer-const
    let selectedScheduleId = [];
    const pauseMsg1 = 'Pause schedule, ' + this.selectedTask.schedule_name + ' will stop any upcoming scheduled trainings.';
    const pauseMsg2 = 'You may reactivate it later.';
    this.global.opendisplayModal(pauseMsg1 + pauseMsg2, 'Pause', 'Pause Schedule', true).subscribe(res => {
      if (res === 'save') {
        selectedScheduleId.push(this.selectedTask.schedule_id);
        const data = {
          id: JSON.stringify(selectedScheduleId),
          actionType
        };
        console.log('da..', data);
        this.anomalyService.actionOnTask(data).subscribe((result: any) => {
          if (result.status === 'success') {
            console.log('inside pause if', result);
            this.notfyService.showToastrSuccess('Success', 'Suspended Successfully');
            this.updateJobStatusInTaskTable(this.selectedTask.schedule_id, 'SUSPENDED');
            this.taskScheDetails.job_status = 'SUSPENDED';
          } else {
            console.log('inside pause else...', result);
            console.log('ifail');
            this.notfyService.showToastrSuccess('Failed', 'API Failed to trigger');
          }
        }, (error) => {
          this.notfyService.showToastrError('Failed', 'Failed in reaching server ');
        });
      }
    });
  }

  activateTask(actionType) {
    // tslint:disable-next-line:prefer-const
    let selectedScheduleId = [];
    this.global.opendisplayModal('Do you wish to Activate this task ?', 'Activate', 'Activate Schedule', true).subscribe(res => {
      if (res === 'save') {
        selectedScheduleId.push(this.selectedTask.schedule_id);
        const data = {
          id: JSON.stringify(selectedScheduleId),
          actionType
        };

        this.anomalyService.actionOnTask(data).subscribe((result: any) => {
          if (result.status === 'success') {
            this.notfyService.showToastrSuccess('Success', 'Acitvated Successfully');
            this.updateJobStatusInTaskTable(this.selectedTask.schedule_id, 'ACTIVE');
            this.taskScheDetails.job_status = 'ACTIVE';
          } else {
            this.notfyService.showToastrWarning('Failed', 'API Failed to trigger');
          }
        }, (error) => {
          this.notfyService.showToastrError('Failed', 'Failed in reaching server ');
        });
      }
    });
  }

  removeTaskFromList(deletedTaskId) {
    const tasks = this.alltasksData.filter(item => item.schedule_id !== deletedTaskId);
    this.alltasksData = tasks;
    this.clearSelection();
  }
  updateJobStatusInTaskTable(scId, status) {
    const index = this.alltasksData.findIndex((ele) => ele.schedule_id === scId);
    this.alltasksData[index].schedule_status = status;
    // this.alltasksData[index].job_status = status;
  }
  refreshData() {
    this.getdatatableAPI(false, true);
    //   const currentRoute = this.router.url;
    //   this.tableLoader = true;
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/' + currentRoute]); // navigate to same route
    //     this.tableLoader = false;
    // });
  }

  resetTableAction() {
    this.keyTask = 'name';
    this.reverseTask = false;
    this.searchFilterTask = ''; // reset search and other tabs
    this.inputCurrentpageTask = this.defaultCurrentPage;
    this.configTask.currentPage = this.defaultCurrentPage;
  }

  scheduleSoc(value) {
    if (value !== 'off') {
      this.socket = this.appScheduler.connectSocket();
      const that = this;
      this.socket.connect({}, () => {
        if (this.trainingStatusDetails && this.trainingStatusDetails.length && this.trainingStatusDetails.length > 0) {
          this.trainingStatusDetails.forEach(element => {
            this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ALL_TASK_TRAINING_STATUS,
              element.uid), message => {
                const payload = JSON.parse(message.body);
                this.updateLiveTrainingStatus(payload);
              });
          });
        }
        if (this.selectedTask && this.selectedTask.schedule_name) {
          this.socket.subscribe(this.appScheduler.getTopic(SUBSCRIPTIONS.ANMD_ALL_TASK_TRAINED_MODELS,
            this.selectedTask.schedule_name), message => {
              const payload = JSON.parse(message.body);
              this.updateLiveTrainedModel(payload);
            });
        }
      });
    } else {
      this.appScheduler.disconnectSocket();
    }
  }
  updateLiveTableData(data) {
    if (data && data.length && data.length > 0) {
      const taskstableData =
        this.alltasksData = data ? data : [];
      // this.alltasksData = this.alltasksData.filter((el) => el.modelType !== 'ANOMALY' && el.modelType !== 'FORECAST');
      if (this.alltasksData.length && this.alltasksData.length > 0) {
        this.alltasksData = this.alltasksData.sort((a, b) => {
          if (a[this.keyTask] > b[this.keyTask]) {
            return 1;
          }
          if (a[this.keyTask] < b[this.keyTask]) {
            return -1;
          }
          return 0;
        });
      }
      this.datasetArr = this.uniquearrayValue(this.alltasksData, 'dataSetName');
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

  updateLiveTrainingStatus(data) {
    if (data) {
      const index = this.trainingStatusDetails.findIndex(x => x.uid === data.uid);
      if (index > -1) {
        this.trainingStatusDetails[index] = data.map((it: any) => {
          it.accuracyDisp = this.createAccuracy(it.accuracy);
          return { ...it }
        });
      }
    }
  }
  updateLiveTrainedModel(data) {
    if (data) {
      const tempModel = data && data.length > 0 ? data : [];
      this.trainedModels = tempModel.map(it => {
        if (it.modelName && it.modelName.includes('.')) {
          const modList = it.modelName.split('.');
          it.modelNameDisp = modList[0];
        } else {
          it.modelNameDisp = it.modelName;
        }
        // if (it.accuracy && it.accuracy.length && it.accuracy.length > 0) {
        //   if (it.accuracy[it.accuracy.length - 1] && !isNaN(Number(it.accuracy[it.accuracy.length - 1]))) {
        //     it.accuracyDisp = Math.round(it.accuracy[it.accuracy.length - 1] * 1000) / 1000;
        //     if (it.accuracyDisp === 1) {
        //       it.accuracyDisp = Math.floor(it.accuracy[it.accuracy.length - 1] * 1000) / 1000;
        //     }
        //   } else {
        //     it.accuracyDisp = 'NA';
        //   }
        // }

        it.accuracyDisp = this.createAccuracy(it.accuracy);
        it.checkboxdata = false;
        return it;
      }
      );
    }
  }
  clearSelection() {
    this.selectedTask = undefined;
    this.taskScheDetails = undefined;
    this.trainingStatusDetails = [];
    this.trainedModels = [];
    this.appScheduler.disconnectSocket();
  }
  sortTask(key) {
    // this.keyTask = key;
    //this.reverseTask = !this.reverseTask;
    if (key === this.keyTask) {
      this.reverseTask = !this.reverseTask;
    } else {
      this.keyTask = key;
      this.reverseTask = true;
    }
    this.clearSelection();
  }
  sortModel(key) {
    // this.keyTask = key;
    // this.reverseTask = !this.reverseTask;
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
  }
}
