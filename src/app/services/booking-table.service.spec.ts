import { TestBed } from '@angular/core/testing';

import { BookingTableService } from './booking-table.service';

describe('BookingTableService', () => {
  let service: BookingTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
