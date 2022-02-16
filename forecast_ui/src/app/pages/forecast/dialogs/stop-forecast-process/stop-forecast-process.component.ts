import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ForecastService } from '../../services/forecast.service';
import { ForecastProcessingComponent } from '../../components/forecast-processing/forecast-processing.component';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-stop-forecast-process',
  templateUrl: './stop-forecast-process.component.html',
  styleUrls: ['./stop-forecast-process.component.scss']
})
export class StopForecastProcessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ForecastProcessingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public forecastService: ForecastService,
    private notify: NotificationService) {
  }
  ngOnInit() {
  }

  stopForecastProcess() {
    // this.data.dataSet.jobStatus = 'STOPPED';
    this.forecastService.handleForecastProcessing(this.data.dataSet).subscribe((res: any) => {
      if (res.status === 'success') {
        this.notify.showToastrSuccess(this.data.dataSet.dataId, 'Forecast processing stopped');
        this.dialogRef.close(true);
      } else {
        this.notify.showToastrWarning(this.data.dataSet.dataId, 'Failed to stop Forecast processing ');
      }
    }, (error) => {
      this.notify.showToastrError('Alert', 'Stop Forecast processing Failed !');
    });
  }
}
