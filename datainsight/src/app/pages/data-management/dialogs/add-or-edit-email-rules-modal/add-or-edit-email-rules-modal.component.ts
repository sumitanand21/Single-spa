import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'datainsight-add-or-edit-email-rules-modal',
  templateUrl: './add-or-edit-email-rules-modal.component.html',
  styleUrls: ['./add-or-edit-email-rules-modal.component.scss']
})
export class AddOrEditEmailRulesModalComponent implements OnInit {

  data = {
    groupName: '',
    emailId: '',
    jobType: ''
  };

  jobTypesDropdown: any = [];

  isEdit = false;

  disableSubmitButton: boolean = false;

  constructor(public notify: NotificationService, public globalService: GlobalService,
    public dataManagementService: DataManagementService, public dialogRef: MatDialogRef<AddOrEditEmailRulesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any) { }

  ngOnInit() {
    this.getJobTypesDropDownData();
    if (this.editData) {
      this.setEditData();
    }
  }

  getJobTypesDropDownData() {
    this.dataManagementService.getJobType({}).subscribe((res: any) => {
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

  setEditData() {
    this.isEdit = true;
    this.data.emailId = this.editData.emailId.toString();
    this.data.groupName = this.editData.groupName;
    this.data.jobType = this.editData.jobType;
  }

  validateEmails(emailsArray) {
    var valid = false;
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    for (var i = 0; i < emailsArray.length; i++) {
      if (emailsArray[i] == "" || !regex.test(emailsArray[i])) {
        valid = true;
      }
    }
    return valid;
  }

  saveData() {
    var emailsList = [];
    emailsList = this.data.emailId ? this.data.emailId.split(",").map((item: string) => item.trim()) : [];

    if (!this.data.groupName || emailsList.length == 0 || !this.data.jobType) {
      this.globalService.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
    }

    else if (this.validateEmails(emailsList)) {
      this.globalService.opendisplayModal('Please enter valid Email data', 'OK', 'Alert');
    }

    else {
      this.disableSubmitButton = true;
      const data = { groupName: this.data.groupName, emailId: emailsList, jobType: this.data.jobType };
      this.dataManagementService.postNotificationsGroupData(data).subscribe((res: any) => {
        if (res.status === 'success') {
          if (res.data.responseType === 'ERR') {
            this.disableSubmitButton = false;
            this.notify.showToastrError('Warning', res.data.message);
          }
          else {
            this.notify.showToastrSuccess('Success', 'Group details added successfully');
            this.dialogRef.close('save');
          }
        }
        else {
          this.disableSubmitButton = false;
          this.notify.showToastrError('Failed', 'Adding Group details failed');
        }
      },
        err => {
          this.disableSubmitButton = false;
          this.notify.showToastrError('Failed', 'Updating Group details failed');
        });
    }
  }

  saveEditedData() {
    var emailsList = [];
    emailsList = this.data.emailId ? this.data.emailId.split(",").map((item: string) => item.trim()) : [];

    if (!this.data.groupName || emailsList.length == 0 || !this.data.jobType) {
      this.globalService.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
    }

    else if (this.validateEmails(emailsList)) {
      this.globalService.opendisplayModal('Please enter valid Email data', 'OK', 'Alert');
    }
    else {
      this.disableSubmitButton = true;
      const data = { _id: this.editData._id, groupName: this.data.groupName, emailId: emailsList, jobType: this.data.jobType };
      this.dataManagementService.editNotificationsGroupData(data).subscribe((res: any) => {
        if (res.status === 'success') {
          if (res.data.responseType === 'ERR') {
            this.notify.showToastrError('Warning', res.data.message);
          }

          else {
            this.notify.showToastrSuccess('Success', 'Group details updated successfully');
            this.dialogRef.close('save');
          }
        } else {
          this.disableSubmitButton = false;
          this.notify.showToastrError('Failed', 'Updating Group details failed');
        }
      },
        err => {
          this.disableSubmitButton = false;
          this.notify.showToastrError('Failed', 'Updating Group details failed');
        });
    }
  }
}
