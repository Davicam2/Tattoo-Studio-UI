import { TestBed } from '@angular/core/testing';

import { AppHttpInterceptService } from './app-http-intercept.service';

describe('AppHttpInterceptService', () => {
  let service: AppHttpInterceptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppHttpInterceptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
