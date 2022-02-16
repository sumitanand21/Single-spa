import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/services/global.service';
import { NotificationService } from 'src/app/services/notification.service';
import { DataManagementService } from '../../services/data-management.service';

@Component({
  selector: 'datainsight-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.scss']
})
export class ServerConfigurationComponent implements OnInit {

  prefixUrl = this.global.prefixUrl;
  auth: boolean = false;
  data = {
    auth: '',
    email_interval: 0,
    max_events: 0,
    smtp_port: '',
    smtp_server: '',
    username: '',
    password: ''
  }

  constructor(public global: GlobalService, private dataManagementService: DataManagementService, private notify: NotificationService) { }

  ngOnInit() {
    this.dataManagementService.showNotificationsMgt = true;
    this.getData();
  }

  ngOnDestroy() {
    this.dataManagementService.showNotificationsMgt = false;
  }

  getData() {
    this.dataManagementService.getServerConfiguration().subscribe((res: any) => {
      if (res.status == "success") {
        res.data.auth == 'false' || res.data.auth == '' ? this.auth = false : this.auth = true;
        this.data.email_interval = res.data.email_interval;
        this.data.max_events = res.data.max_events;
        this.data.smtp_port = res.data.smtp_port;
        this.data.smtp_server = res.data.smtp_server;
        this.data.username = res.data.username;
        this.data.password = res.data.password;
      }
    })
  }

  onCheckboxSelected() {
    if (!this.auth) {
      this.data.username = '';
      this.data.password = '';
    }
  }

  saveData() {
    if (!this.data.smtp_port || !this.data.smtp_server || !this.data.max_events || !this.data.email_interval) {
      this.global.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
    }

    else {
      if (this.auth) {
        if (!this.data.username || !this.data.password)
          this.global.opendisplayModal('Please enter details for all the fields', 'OK', 'Alert');
        else {
          this.data.auth = "true";
        }
      }
      else {
        this.data.auth = "false";
      }
      
      this.dataManagementService.updateServerConfiguration(this.data).subscribe((res: any) => {
        if (res.status === "success") {
          this.notify.showToastrSuccess('Success', 'Server configuration details updated successfully');
          this.getData();
        }

        else {
          this.notify.showToastrError('Failed', 'Updating server configuration details failed');
        }
      })
    }
  }

}
