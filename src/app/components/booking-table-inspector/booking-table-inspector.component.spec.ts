import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTableInspectorComponent } from './booking-table-inspector.component';

describe('BookingTableInspectorComponent', () => {
  let component: BookingTableInspectorComponent;
  let fixture: ComponentFixture<BookingTableInspectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingTableInspectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingTableInspectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
