import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { hostUrl } from 'src/single-spa/asset-url';
@Component({
  selector: 'app-displaypopup',
  templateUrl: './displaypopup.component.html',
  styleUrls: ['./displaypopup.component.scss']
})
export class DisplaypopupComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<DisplaypopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
  headerText = '';
  buttonText = '';
  textmsg = '';
  dispCancel = false;
  ngOnInit() {
    this.headerText = this.data.header ? this.data.header : '';
    this.buttonText = this.data.buttonText ? this.data.buttonText : '';
    this.textmsg = this.data.message ? this.data.message : '';
    this.dispCancel = this.data.dispCancel ? this.data.dispCancel : false;
  }

  createSvgUrl(icon) {
    const iconUrl = 'assets/svg/' + icon;
    return hostUrl(iconUrl);
  }

  returnvalue() {
    this.dialogRef.close('save');
  }


}
