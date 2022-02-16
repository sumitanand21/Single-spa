import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContainerToasterService {
   MessageArray: Message[];
  constructor() {
    this.MessageArray = [];
  }

   getMessages(): Message[] {
    return this.MessageArray;
  }
  showInfo(content) {
    const message = new Message(content, 'info');
    this.MessageArray.push(message);
    this.dismissAfterSomeTime();
  }
   showWarning(content) {
    const message = new Message(content, 'warning');
    this.MessageArray.push(message);
    this.dismissAfterSomeTime();
  }
   showSuccess(content) {
    const message = new Message(content, 'success');
    this.MessageArray.push(message);
    this.dismissAfterSomeTime();
  }
  showError(content) {
    const message = new Message(content, 'error');
    this.MessageArray.push(message);
    this.dismissAfterSomeTime();
  }
   dismissAllMessage() {
    this.MessageArray.forEach(() => {
      this.dismissMessage(0);
    });
  }
  dismissAfterSomeTime() {
    setTimeout(() => {
      this.dismissMessage(0);
    }, 4 * 1000);
  }
  dismissMessage(index: number) {
    this.MessageArray.splice(index, 1);
  }

}

export class Message {
  content: string;
  style: string;
  dismissed = false;

  constructor(content, style?) {
    this.content = content;
    this.style = style || 'info';
  }
}
