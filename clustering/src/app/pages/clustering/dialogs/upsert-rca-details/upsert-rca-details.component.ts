import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NotificationService } from 'src/app/services/notification.service';
import { ClusteringService } from '../../services/clustering.service';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-upsert-rca-details',
  templateUrl: './upsert-rca-details.component.html',
  styleUrls: ['./upsert-rca-details.component.scss']
})
export class UpsertRcaDetailsComponent implements OnInit {
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  detailLoader = false;
  clusterName = '';
  showErr = '';
  resolution = [];
  resolutionStr = '';
  filteredOptions = [];
  valueSubject = new BehaviorSubject<any>(null);
  constructor(public clusteringService: ClusteringService,
              public dialogRef: MatDialogRef<UpsertRcaDetailsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notify: NotificationService) { }


  ngOnInit() {
    if (this.data.action === 'clustername') {
      this.clusterName = this.data.selectedModel.RCAObj.clusterName;
    } else {
      this.getMasterResolution();
      this.resolution = [...this.data.selectedModel.resolution];
      this.resolutionStr = this.resolution.length ? this.resolution[0].dispResolution : '';
      // this.getModelConfigDetails(this.data);
    }

    this.valueSubject.pipe(debounceTime(1000)).subscribe(value => {
      if (value) {
        this.getResolutionOnSearch(value);
      }
    });

  }

  getMasterResolution() {
    this.clusteringService.getResourceAutoCompleteMaster().subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.filteredOptions = res.data && res.data.length ? [...res.data] : [];
      } else {
        this.filteredOptions = [];
      }

    }, err => {
      this.filteredOptions = [];
    });

  }

  addResolution() {
    this.resolution.push({ dispResolution: '' });
  }

  removeResolution(index) {
    this.resolution.splice(index, 1);
  }

  onSearchResolution(serTxt, i) {
    this.filteredOptions = [];
    const tempval = {
      searchText : serTxt ? serTxt : '',
    index: i};
    this.valueSubject.next(tempval);
  }

  checkifSelected(option, value) {
    if (this.resolution.some(it => it.dispResolution === option)) {
      return (option === value) ? false : true;
    } else {
      return false;
    }
  }

  getResolutionOnSearch(value) {
    const data = { searchText : value.searchText ? value.searchText : '' };
    this.clusteringService.getResourceAutoComplete(data).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.filteredOptions = res.data && res.data.length ? res.data.filter(it => {
          if (this.resolution.some((item, index) => item.dispResolution === it && index !== value.index)) {
              return false;
          } else {
            return true;
          }
        }) : [];
      } else {
        this.filteredOptions = [];
      }

    }, err => {
      this.filteredOptions = [];
    });
  }

  saveDetails() {
    if (this.data.action === 'clustername') {
      if (!this.clusterName) {
        this.notify.showToastrWarning('Alert', 'Please provide cluster name');
      } else if (this.clusterName.length < 3) {
        this.notify.showToastrWarning('Alert', 'Cluster name provided should be atleast 3 characters long');
      } else if (!this.leastOneAlpha.test(this.clusterName)) {
        this.notify.showToastrWarning('Alert', 'Cluster name provided should have atleast 1 character(A-Z)');
      } else {
        this.saveClusterName();
        // this.dialogRef.close({ action: 'create', groupName: this.groupName });
      }
    } else {
      // if (!this.resolution.length) {
      //   this.notify.showToastrWarning('Alert', 'Please provide atleast one clustering resolution details');
      // } else if (this.resolution.some(it => !it.dispResolution)) {
      //   this.notify.showToastrWarning('Alert', 'Please provide all the clustering resolution details');
      // }
      if (!this.resolutionStr) {
        this.notify.showToastrWarning('Alert', 'Please provide resolution details');
      } else {
        this.saveResolution();
      }

    }
  }

  saveClusterName() {
    this.detailLoader = true;
    const data = {
      clusterId: this.data.selectedModel.RCAObj.clusterId,
      modelName: this.data.selectedModel.RCAObj.modelName,
      clusterName: this.clusterName
    };
    this.clusteringService.editClusterName(data).subscribe((res: any) => {
      this.detailLoader = false;
      if (res && res.status === 'success' && res.data === 200) {
        this.notify.showToastrSuccess('Success', 'Cluster name changed successfully');
        this.dialogRef.close({ action: this.data.action, clusterName: this.clusterName });
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to change cluster name');
      }

    }, err => {
      this.detailLoader = false;
      this.notify.showToastrError('Alert', 'API failed to change cluster name');
    });

  }

  saveResolution() {
    this.detailLoader = true;
    const data = {
      dataSetName:  this.data.selectedModel.dataSetName ?  this.data.selectedModel.dataSetName : '',
      clusterId: this.data.selectedModel.RCAObj.clusterId,
      modelName: this.data.selectedModel.RCAObj.modelName,
      resolution: [this.resolutionStr] // this.resolution.map(it => it.dispResolution)
    };
    this.clusteringService.editResolution(data).subscribe((res: any) => {
      this.detailLoader = false;
      if (res && res.status === 'success' && res.data === 200) {
        this.notify.showToastrSuccess('Success', 'Resolution details updated successfully');
        this.dialogRef.close({ action: this.data.action, resolution: [{dispResolution : this.resolutionStr}] });
      } else {
        this.notify.showToastrWarning('Alert', 'API failed to update resolution details');
      }

    }, err => {
      this.detailLoader = false;
      this.notify.showToastrError('Alert', 'API failed to update resolution details');
    });

  }



}
