import { Component, OnInit } from '@angular/core';
import { ContainerToasterService } from 'src/app/services/container-toaster.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {
public messages: any;
constructor(private containerToaster: ContainerToasterService) {}

ngOnInit() {
  this.messages = this.containerToaster.getMessages();
}

public dismiss(index: number) {
  this.containerToaster.dismissMessage(index);
}
}
