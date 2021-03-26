import { TestBed } from '@angular/core/testing';

import { BookingPageService } from './booking-page.service';

describe('BookingPageService', () => {
  let service: BookingPageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingPageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
