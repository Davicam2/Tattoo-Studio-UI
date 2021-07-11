import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmPageComponent } from './booking-confirm-page.component';

describe('BookingConfirmPageComponent', () => {
  let component: BookingConfirmPageComponent;
  let fixture: ComponentFixture<BookingConfirmPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingConfirmPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingConfirmPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
