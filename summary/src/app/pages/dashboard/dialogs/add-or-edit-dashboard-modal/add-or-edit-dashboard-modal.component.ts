import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { SummaryService } from '../../../summary/services/summary.service';

@Component({
  selector: 'summary-add-new-dashboard-modal',
  templateUrl: './add-or-edit-dashboard-modal.component.html',
  styleUrls: ['./add-or-edit-dashboard-modal.component.scss']
})
export class AddOrEditDashboardModalComponent implements OnInit {

  modalEditRef: BsModalRef;
  closeforecastEdit: any;
  isEdit = false;

  data: any = {
    dashBoardName: '',
    jobType: '',
    dataSetName: '',
    dashBoardType: '',
    dashBoardUrl: ''
  };

  datasetDropdown = [];
  jobTypesDropdown = [];

  dashboardTypes = [
    'Iframe',
    'Static Dashboard'
  ];

  constructor(public notify: NotificationService,
    public globalService: GlobalService,
    public summaryService: SummaryService,
    public dialogRef: MatDialogRef<AddOrEditDashboardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit() {
    this.getJobTypesDropDownData();
    if (this.editData) {
      this.setEditData();
    }
  }

  getJobTypesDropDownData() {
    this.summaryService.getJobTypesList().subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.jobTypesDropdown = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length

      } else {
        this.jobTypesDropdown = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }

    }, err => {
      this.jobTypesDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  getDataSetDropDownData() {
    this.datasetDropdown = [];
    const JobType = { jobType: this.data.jobType };
    this.summaryService.dataSetName(JobType).subscribe((res: any) => {
      if (res && res.status === 'success') {
        this.datasetDropdown = res.data && res.data.data && res.data.data.length > 0 ? [...res.data.data] : [];
        // tslint:disable-next-line:max-line-length

      } else {
        this.datasetDropdown = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch data set');
      }

    }, err => {
      this.datasetDropdown = [];
      this.notify.showToastrError('Alert', 'API failed to fetch data set');
    });
  }

  setEditData() {
    this.isEdit = true;
    this.data.dashBoardName = this.editData.dashBoardName;
    this.data.dashBoardType = this.editData.dashBoardType;
    this.data.dataSetName = this.editData.dataSetName;
    this.data.jobType = this.editData.jobType;
    this.data.dashBoardUrl = this.editData.dashBoardUrl;
    this.getDataSetDropDownData();
  }

  saveData() {
    var dashBoardValidation = /^(?=[^A-Za-z]*[A-Za-z])[ -~]*$/
    if (this.data.dashBoardType === 'Static Dashboard') {
      this.data.dashBoardUrl = 'NA';
    }
    if (!this.data.dashBoardName || !this.data.dashBoardType || !this.data.dashBoardType || !this.data.dashBoardUrl) {
      this.globalService.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
    }

    else if (!dashBoardValidation.test(this.data.dashBoardName)) {
      this.globalService.opendisplayModal('Dashboard name should contain atleast 1 character', 'OK', 'Alert');
    }

    else {
      this.summaryService.postIframeData(this.data).subscribe((res: any) => {
        if (res.status === 'success') {
          if (res.data.responseType === 'ERR') {
            this.notify.showToastrError('Warning', res.data.message);
          }

          else {
            this.notify.showToastrSuccess('Success', 'Dashboard details added successfully');
            this.dialogRef.close('save');
          }
        } else {
          this.notify.showToastrError('Failed', 'Adding Dashboard details failed');
        }
      });
    }
  }

  saveEditedData() {
    var dashBoardValidation = /^(?=[^A-Za-z]*[A-Za-z])[ -~]*$/
    if (this.data.dashBoardType === 'Static Dashboard') {
      this.data.dashBoardUrl = 'NA';
    }
    if (!this.data.dashBoardName || !this.data.dashBoardType || !this.data.dashBoardType || !this.data.dashBoardUrl) {
      this.globalService.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
    }

    else if (!dashBoardValidation.test(this.data.dashBoardName)) {
      this.globalService.opendisplayModal('Dashboard name should contain atleast 1 character', 'OK', 'Alert');
    }

    else {
      this.data._id = this.editData._id;
      this.summaryService.updateIframedata(this.data).subscribe((res: any) => {
        if (res.status === 'success') {
          if (res.data.responseType === 'ERR') {
            this.notify.showToastrError('Warning', res.data.message);
          }
          else {
            this.notify.showToastrSuccess('Success', 'Dashboard details updated successfully');
            this.dialogRef.close('save');
          }
        } else {
          this.notify.showToastrError('Failed', 'Updating Dashboard details failed');
        }
      });
    }
  }

  checkDashboardType() {
    if (this.data.dashBoardType === 'Iframe') {
      this.data.dashBoardUrl = '';
    }
  }

  checkmodelparam() {

  }
}
