import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatMenuTrigger, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { DisplaypopupComponent } from 'src/app/dialogs/displaypopup/displaypopup.component';
import { SummaryService } from 'src/app/pages/summary/services/summary.service';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DASHBOARD_VALUES } from 'src/config/dashboard.config';
import { AddOrEditDashboardModalComponent } from '../../dialogs/add-or-edit-dashboard-modal/add-or-edit-dashboard-modal.component';

@Component({
  selector: 'summary-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})

export class DashboardListComponent implements OnInit {
  isLoading = false;
  searchFilter = '';
  @Output() emitOut = new EventEmitter<any>();
  @ViewChild('clickMenuTrigger', { static: false }) trigger: MatMenuTrigger;
  pages: any[] = [];
  startPageIndex: any = 0;
  endPageIndex: any = 5;
  dashbaordData: any[] = [];
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
  private pageSize = 10;
  chartDataGraph: boolean;
  featureToggleData = DASHBOARD_VALUES;
  // trigger: any;
  constructor(private menu: MenuController,
    private platform: Platform,
    // tslint:disable-next-line:variable-name
    private _formBuilder: FormBuilder,
    private router: Router,
    public globalService: GlobalService,
    public dialog: MatDialog,
    public summaryService: SummaryService,
    public notify: NotificationService) {
  }

  ngOnInit() {
    this.getDashboardListData();
  }

  getDashboardListData() {
    this.isLoading = true;
    this.dashbaordData = [];
    this.summaryService.getIframeList().subscribe((res: any) => {
      this.isLoading = false;
      if (res && res.status === 'success') {
        this.dashbaordData = res.data && res.data.data ? res.data.data : [];
      } else {
        this.dashbaordData = [];
        this.notify.showToastrWarning('Alert', 'API failed to fetch correlated groups details');
      }
    }, err => {
      this.dashbaordData = [];
      this.isLoading = false;
      this.notify.showToastrWarning('Alert', 'API failed to fetch correlated groups details');
    });
  }

  summaryNavigation(navigationpath) {
    this.router.navigate(['/' + this.globalService.prefixUrl + navigationpath]);
  }

  someMethod() {
    this.trigger.closeMenu();
  }

  onsearchChange(searchVal) {
    this.inputCurrentpage = this.defaultCurrentPage;
    this.config.currentPage = this.defaultCurrentPage;
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
  goto(page) {
    this.router.navigate([page.icon]);
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd() {
    this.menu.open('end');
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  openAddNewDashboardModal() {
    const dialogRef = this.dialog.open(AddOrEditDashboardModalComponent, {
      width: '50vw',
      disableClose: true,
      panelClass: 'add-new-dashboard-modal',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'save') {
        this.getDashboardListData();
      }
    });
  }

  openEditDashboardModal(id) {
    const dialogRef = this.dialog.open(AddOrEditDashboardModalComponent, {
      data: this.dashbaordData.find(x => x._id === id),
      width: '50vw',
      disableClose: true,
      panelClass: 'add-new-dashboard-modal',
    });

    dialogRef.afterClosed().subscribe((res: any) => {
      if (res === 'save') {
        this.getDashboardListData();
      }
    });
  }

  deleteDashboard(dashboardId) {
    const data = {
      header: 'Delete',
      buttonText: 'Confirm',
      message: 'Do you really want to delete this Dashboard?',
      dispCancel: true
    };
    const dialogRef = this.dialog.open(DisplaypopupComponent, {
      data,
      width: '50vw',
      disableClose: true,
      panelClass: 'add-new-dashboard-modal',
    });

    dialogRef.afterClosed().subscribe((resclose: any) => {
      if (resclose === 'save') {
        this.summaryService.deleteIframedata(dashboardId).subscribe((res: any) => {
          if (res.status === 'success') {
            if (res.data.responseType === 'ERR') {
              this.notify.showToastrError('Warning', res.data.message);
            }
            else {
              this.notify.showToastrSuccess('Success', 'Dashboard data deleted successfully');
              this.getDashboardListData();
            }
          } else {
            this.notify.showToastrError('Alert', 'Deleting Dashboard data failed');
          }
        });
      }
    });
  }
}
