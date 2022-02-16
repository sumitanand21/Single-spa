import { Component, DebugElement, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlphaNumericDirective } from './alpha-numeric.directive';
import { NumbersOnlyDirective } from './numbers-only.directive';

@Component({
  template: `<input type="text" [appNumbersOnly]="inputVal">`
})
class TestComponent {
  inputVal = false;
}

describe('NumbersOnlyDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputEl: DebugElement;
  let elementRef: ElementRef;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumbersOnlyDirective, TestComponent]
    });
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    elementRef = fixture.nativeElement;
    inputEl = fixture.debugElement.query(By.directive(NumbersOnlyDirective));
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    const directive = new NumbersOnlyDirective(elementRef);
    expect(directive).toBeTruthy();
  });

  // it('should allow numbers only', () => {
  //   component.inputVal = true;
  //   fixture.detectChanges();
  //   const event = new Event('input', {} as any);
  //   inputEl.nativeElement.value = '1a';
  //   inputEl.nativeElement.dispatchEvent(event);
  //   expect(inputEl.nativeElement.value).toBe('1');
  // });

});
