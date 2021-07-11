import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingActionModalComponent } from './booking-action-modal.component';

describe('BookingActionModalComponent', () => {
  let component: BookingActionModalComponent;
  let fixture: ComponentFixture<BookingActionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingActionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
