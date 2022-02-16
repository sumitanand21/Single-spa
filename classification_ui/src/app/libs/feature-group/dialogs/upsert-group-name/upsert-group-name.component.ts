import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalService } from 'src/app/services/global.service';
@Component({
  selector: 'app-upsert-group-name',
  templateUrl: './upsert-group-name.component.html',
  styleUrls: ['./upsert-group-name.component.scss']
})
export class UpsertGroupNameComponent implements OnInit {


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<UpsertGroupNameComponent>,
              public global: GlobalService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }
  headerText = '';
  buttonText = '';
  dispCancel = false;
  groupName = '';
  showCreate = false;
  showErr = '';
  leastOneAlpha: any = new RegExp(/.*[a-zA-Z]+.*/);
  ngOnInit() {
    this.showCreate = this.data.groupName ? false : true;
    this.headerText = this.data.header ? this.data.header : '';
    this.buttonText = this.data.buttonText ? this.data.buttonText : '';
    this.groupName = this.data.groupName ? this.data.groupName : '';
    this.dispCancel = this.data.dispCancel ? this.data.dispCancel : false;
  }

  returnvalue(btntext) {
    if (btntext === 'Create') {
      if (!this.groupName) {
        this.showErr = 'Please provide feature group name';
      } else if (this.groupName.length < 3) {
        this.showErr = 'Feature group name provided should be atleast 3 characters long';
      } else if (!this.leastOneAlpha.test(this.groupName)) {
        this.showErr = 'Feature group name provided should have atleast 1 character(A-Z)';
      } else {
        this.dialogRef.close({ action: 'create', groupName: this.groupName });
      }

    } else {

      this.dialogRef.close({ action: 'save' });
    }


  }


}
