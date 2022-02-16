import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  @Input('appAlphaNumeric') inputType: string;
  regexNumber = new RegExp(/[^0-9]*/, 'g');
  regexNoFirstSpace = new RegExp(/^\s+/g, 'g');
  regexNoFirstChar = new RegExp(/^[\s,.]+/g, 'g');
  regexPosFloat = new RegExp(/[^0-9.]/g, 'g');
  regexDeciPosFloat = new RegExp(/[^0-1.]/g, 'g');
  // regexMaskPosFloat = new RegExp(/^(?:[2-9]|\d\d\d*)$/, 'g');
  regexMaskPosFloat = new RegExp(/[^0-9,.]/g, 'g');
  regexMaskNumber = new RegExp(/[^0-9,]/g, 'g');
  constructor(private el: ElementRef) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {

    const initalValue = this.el.nativeElement.value;
    let tempInp = initalValue;
    tempInp = this.valueReturn(tempInp);
    this.el.nativeElement.value = tempInp ? tempInp : '';
    if (initalValue !== this.el.nativeElement.value) {
      this.el.nativeElement.dispatchEvent(new Event('input'));
      event.stopPropagation();
    }

  }

  valueReturn(newVal) {
    switch (this.inputType) {

      case 'text': {
        newVal = this.textCheck(newVal);
        break;
      }

      case 'num': {
        newVal = this.numCheck(newVal);
        break;
      }

      case 'maskNum': {
        newVal = this.maskNumCheck(newVal);
        break;
      }
      case 'maskNumDecimal': {
        newVal = this.maskNumDecimalCheck(newVal);
        break;
      }
      case 'positivefloat': {
        newVal = this.positivefloatCheck(newVal);
        break;
      }

    }

    return newVal;
  }

  textCheck(tempInp) {
    return tempInp ? tempInp.replace(this.regexNoFirstSpace, '') : '';
  }

  numCheck(tempInp) {
    return tempInp ? tempInp.replace(this.regexNumber, '') : '';
  }

  maskNumCheck(tempInp) {
    let index = 0;
    tempInp = tempInp ? tempInp.replace(this.regexNoFirstChar, '') : '';
    tempInp = tempInp ? tempInp.replace(this.regexMaskNumber, '') : '';
    tempInp = tempInp.replace(/\,/g, (item) => (!index++ ? item : ''));
    const splitVal = tempInp.split(',');
    if (splitVal.length > 1) {
      if (splitVal[1]) {
        tempInp = splitVal[0] + ', ' + splitVal[1];
      }
    }

    return tempInp;
  }

  // maskNumDecimalCheck(tempInp) {
  //   let index = 0;
  //   tempInp = tempInp ? tempInp.replace(this.regexNoFirstChar, '') : '';
  //   tempInp = tempInp ? tempInp.replace(this.regexMaskPosFloat, '') : '';
  //   tempInp = tempInp.replace(/\,/g, (item) => (!index++ ? item : ''));
  //   let splitVal = tempInp.split(',');
  //   if (splitVal.length > 1) {
  //     if (splitVal[1]) {
  //       splitVal[0] = splitVal[0] ? splitVal[0].replace(this.regexNoFirstChar, '') : '';
  //       splitVal[1] = splitVal[1] ? splitVal[1].replace(this.regexNoFirstChar, '') : '';
  //       splitVal[0] = splitVal[0] ? splitVal[0].replace(this.regexMaskPosFloat, '') : '';
  //       splitVal[1] = splitVal[1] ? splitVal[1].replace(this.regexMaskPosFloat, '') : '';
  //       // const x = splitVal[0].replace(/\./g, (item) => (!index++ ? item : ''));
  //       // const y = splitVal[1].replace(/\./g, (item) => (!index++ ? item : ''));
  //       // tempInp = x + ',' + y;
  //       tempInp = splitVal[0] + ',' + splitVal[1];
  //     }
  //   } else {
  //     tempInp = tempInp.replace(/\./g, (item) => (!index++ ? item : ''));
  //   }
  //   return tempInp;
  // }

  maskNumDecimalCheck(tempInp) {
    let index = 0;
    tempInp = tempInp ? tempInp.replace(this.regexNoFirstChar, '') : '';
    tempInp = tempInp ? tempInp.replace(this.regexMaskPosFloat, '') : '';
    tempInp = tempInp.replace(/\,/g, item => (!index++ ? item : ''));
    const splitVal = tempInp.split(',');
    if (splitVal.length > 1) {
      if (splitVal[1]) {
        const firstVal = this.getOnlyOneDecimal(splitVal[0]);
        const secondVal = this.getOnlyOneDecimal(splitVal[1]);
        tempInp = firstVal + ', ' + secondVal;
      }
    } else {
      tempInp = this.getOnlyOneDecimal(tempInp);
    }

    return tempInp;
  }

  getOnlyOneDecimal(value) {
    let index = 0;
    value = value.replace(this.regexNoFirstChar, '');
    if (value) {
      return value.replace(/\./g, item => (!index++ ? item : ''));
    } else {
      return '';
    }
  }

  positivefloatCheck(tempInp) {
    let index = 0;
    tempInp = tempInp.replace(this.regexNoFirstChar, '');
    tempInp = tempInp ? tempInp.replace(this.regexPosFloat, '') : '';
    return tempInp.replace(/\./g, (item) => (!index++ ? item : ''));
  }



}
