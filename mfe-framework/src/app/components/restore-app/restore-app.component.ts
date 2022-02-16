import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContainerToasterService } from 'src/app/services/container-toaster.service';
import { CrudService } from 'src/app/services/crud.service';
import { RouteConfigService } from 'src/app/services/route-config.service';

@Component({
  selector: 'app-restore-app',
  templateUrl: './restore-app.component.html',
  styleUrls: ['./restore-app.component.css']
})
export class RestoreAppComponent implements OnInit {
  selectedConfiguration: any = null;
  listData: any[] = [];
  constructor(
    private router: Router, private crudServices: CrudService,
    private containerToaster: ContainerToasterService,
    private routeConService: RouteConfigService) { }

  ngOnInit(): void {
    this.routeConService.routeSubject.next(undefined);
    this.listData = [];
    this.getMicroappList();
  }
  getMicroappList(){
    this.crudServices.getInActiveMicroappList().subscribe((res: any) => {
      if (res.success){
        this.listData = res.post;
      } else {
        this.containerToaster.showInfo('Info: No apps in inactive state.');
      }
    }, err => {
      this.containerToaster.showError(err.message);
    });
  }
  restore(data): void {
    this.crudServices.restoreApp(data._id).subscribe((res: any) => {
      if (res.success) {
        this.containerToaster.showSuccess('Success: ' + data.label + ' App restored please check in container.');
        this.getMicroappList();
      } else {
        this.containerToaster.showSuccess('Warning: ' + data.label + ' App failed to restored .');
      }
    });
  }
}
