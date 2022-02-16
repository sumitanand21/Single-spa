import { Component, OnInit, Input } from '@angular/core';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-donut-chart',
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss']
})
export class DonutChartComponent implements OnInit {

  @Input()
  set grappData(value) {
    if (value) {
      this.setGraphData(value);
    }
  }
  selectedData;
  selectedPer;
  chartOptions = {
    cutoutPercentage: 80,
    legend: {
      display: false,
      aspectRatio: 2,
      responsive: true
    },
  };
  colors: Color[] = [
    {
      backgroundColor: [
        '#F78D85',
        '#DEDDDB'
      ]
    }
  ];
  public doughnutChartLabels = ['Abnormal Data', 'Normal Data'];
  public demodoughnutChartData;
  public doughnutChartType = 'doughnut';
  constructor() { }

  ngOnInit() {
  }
  // events
  public chartClicked(e: any): void {
  }

  setGraphData(val) {
    this.selectedData = this.doughnutChartLabels[0];
    this.selectedPer = (+val.numberOfAbnormalData * 100 / ((+val.numberOfAbnormalData) + ( + val.numberofNormalData))).toFixed(1) ;
    this.demodoughnutChartData = [+val.numberOfAbnormalData , +val.numberofNormalData];
  }
  public chartHovered(e: any): void {
  }
}
