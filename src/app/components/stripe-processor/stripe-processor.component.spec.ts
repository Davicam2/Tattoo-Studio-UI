import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeProcessorComponent } from './stripe-processor.component';

describe('StripeProcessorComponent', () => {
  let component: StripeProcessorComponent;
  let fixture: ComponentFixture<StripeProcessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StripeProcessorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeProcessorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
