import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { DisplaypopupComponent } from 'src/app/dialogs/displaypopup/displaypopup.component';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AddOrEditEmailRulesModalComponent } from '../../dialogs/add-or-edit-email-rules-modal/add-or-edit-email-rules-modal.component';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'datainsight-system-notification',
  templateUrl: './system-notification.component.html',
  styleUrls: ['./system-notification.component.scss']
})
export class SystemNotificationComponent implements OnInit {

  searchFilter = '';
  isLoading = false;
  pages: any[] = [];
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  notificationsGroupData: any[] = [];
  defaultCurrentPage = 1;
  defauultItempg = 5;
  itemPerPage = this.defauultItempg;
  inputCurrentpage = this.defaultCurrentPage;
  pageArr = [5, 10, 25, 50, 100];
  config = {
    id: 'paginate1',
    itemsPerPage: this.defauultItempg,
    currentPage: this.defaultCurrentPage,
    totalItems: 0
  };
  key = 'name';
  reverse = false;
  p = 1;
  constructor(public router: Router, public global: GlobalService, public dialog: MatDialog, public dataManagementService: DataManagementService, public notify: NotificationService) { }

  ngOnInit() {
    this.dataManagementService.showSystemNotification = true;
    this.getNotificationGroupData();
  }

  getNotificationGroupData() {
    this.isLoading = true;
    this.notificationsGroupData = [];
    this.dataManagementService.getNotificationsGroupData({}).subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success') {
        this.notificationsGroupData = res && res.data.data ? res.data.data : [];
      } else {
        this.notificationsGroupData = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch groups details');
      }
    }, err => {
      this.notificationsGroupData = [];
      this.isLoading = false;
      this.notify.showToastrWarning('Alert', 'API failed to fetch groups details');
    });
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    this.dataManagementService.showSystemNotification = false;
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
  }

  openAddNotificationsGroupModal() {
    const dialogRef = this.dialog.open(AddOrEditEmailRulesModalComponent, {
      width: '50vw',
      disableClose: true,
      panelClass: 'add-or-edit-email-rules-modal',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'save') {
        this.getNotificationGroupData();
      }
    });
  }

  openEditNotificationsGroupModal(id) {
    const dialogRef = this.dialog.open(AddOrEditEmailRulesModalComponent, {
      data: this.notificationsGroupData.find(x => x._id === id),
      width: '50vw',
      disableClose: true,
      panelClass: 'add-or-edit-email-rules-modal',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'save') {
        this.getNotificationGroupData();
      }
    });
  }

  deleteNotificationsData(groupId) {
    const data = {
      header: 'Delete',
      buttonText: 'Delete',
      message: 'Do you really want to delete this Group details?',
      dispCancel: true
    };
    const dialogRef = this.dialog.open(DisplaypopupComponent, {
      // tslint:disable-next-line:object-literal-shorthand
      data: data,
      width: '50vw',
      disableClose: true,
      panelClass: 'add-or-edit-email-rules-modal',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'save') {
        // tslint:disable-next-line:no-shadowed-variable
        this.dataManagementService.deleteNotificationsGroupData(groupId).subscribe((res: any) => {
          if (res.status === 'success') {
            if (res.data.responseType === 'ERR') {
              this.notify.showToastrError('Warning', res.data.message);
            }
            else {
              this.notify.showToastrSuccess('Success', 'Deleted data successfully');
              this.getNotificationGroupData();
            }
          } else {
            this.notify.showToastrError('Alert', 'Deleting data failed');
          }
        });
      }
    });
  }

  changepageinp(inputVal, lastpage) {
    if (inputVal < 1 || inputVal > lastpage) {
      this.inputCurrentpage = this.config.currentPage;
    } else {
      this.config.currentPage = inputVal;
    }
  }

  // onpage change
  changepage(evt) {
    this.config.currentPage = evt;
    this.inputCurrentpage = evt;
  }
  // set new page size for pagination
  setNewPageSize(pageSize) {
    this.config.itemsPerPage = pageSize;
    this.config.currentPage = this.defaultCurrentPage;
    this.inputCurrentpage = this.defaultCurrentPage;
  }
  /*************************************Sumit Code End********* */
  sort(key) {
    // this.key = key;
    // this.reverse = !this.reverse;
    if (key === this.key) {
      this.reverse = !this.reverse;
    } else {
      this.key = key;
      this.reverse = true;
    }
  }

  goToServerConfigurationPage() {
    this.router.navigate(['/' + this.global.prefixUrl + '/datamanagement/serverconfiguration']);
  }
}
