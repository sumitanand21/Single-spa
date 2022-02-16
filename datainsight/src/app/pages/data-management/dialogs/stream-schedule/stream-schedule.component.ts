import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataManagementService } from '../../services/data-management.service';
@Component({
  selector: 'app-stream-schedule',
  templateUrl: './stream-schedule.component.html',
  styleUrls: ['./stream-schedule.component.scss']
})
export class StreamScheduleComponent implements OnInit {

  constructor(public dialog: MatDialog, public dataManagementService: DataManagementService,
              public dialogRef: MatDialogRef<StreamScheduleComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }
  headerText = '';
  buttonText = '';
  dispCancel = false;
  showErr = false;
  selectedJobType = '';
  jobTypeList = [];
  streamAction = '';
  ngOnInit() {
    this.headerText = this.data.header ? this.data.header : '';
    this.buttonText = this.data.buttonText ? this.data.buttonText : '';
    this.streamAction = this.data.streamAction ? this.data.streamAction : '';
    this.jobTypeList = this.data.jobTypeList ? this.data.jobTypeList : [];
    this.dispCancel = this.data.dispCancel ? this.data.dispCancel : false;
  }

  returnvalue(btntext) {
      if (!this.selectedJobType) {
        this.showErr = true;
      } else {
        this.dialogRef.close({ action: 'save', jobType: this.selectedJobType, streamAction : this.streamAction });
      }
  }


}

