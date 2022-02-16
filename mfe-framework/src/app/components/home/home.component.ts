import { Component, OnDestroy, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ContainerToasterService } from 'src/app/services/container-toaster.service';
import { RouteConfigService } from 'src/app/services/route-config.service';
import { CrudService } from '../../services/crud.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  selectedConfiguration: any = null;
  listData: any[] = [];
  subscriptions: Subscription[] = [];
  constructor(
    private router: Router, private crudServices: CrudService,
    private titleService: Title,
    private containerToaster: ContainerToasterService,
    private routeConService: RouteConfigService) {
      this.titleService.setTitle('UI Container');
     }

  ngOnInit(): void {
    this.crudServices.defaultHomePath = true;
    this.routeConService.routeSubject.next(undefined);
    this.listData = [];
    this.getMicroappList();
  }
  getMicroappList() {
    const subMicroAppList = this.crudServices.getMicroappList().subscribe((res: any) => {
      if (res && res.length && res.length > 0) {
        this.listData = res;
      } else {
        this.containerToaster.showInfo('Info: No apps in active state.');
      }
    }, err => {
      this.containerToaster.showError(err.message);
    });
    this.subscriptions.push(subMicroAppList);
  }
  loadApp(app) {
    this.routeConService.routeSubject.next(app);
  }
  remove(data): void {
    const subRemoveApp = this.crudServices.removeApp(data._id).subscribe((res: any) => {
      if (res.success) {
        this.containerToaster
          .showSuccess('Success: ' + data.label + ' App moved to inactive container, please check in restore container.');
        this.getMicroappList();
      } else {
        this.containerToaster.showSuccess('Warning: ' + data.label + ' App failed to inactivate .');
      }
    }, err => {
      this.containerToaster.showError(err.message);
    });
    this.subscriptions.push(subRemoveApp);
  }
  ngOnDestroy() {
    this.crudServices.defaultHomePath = false;
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
  }
}
