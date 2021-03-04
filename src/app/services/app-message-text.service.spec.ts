import { TestBed } from '@angular/core/testing';

import { AppMessageTextService } from './app-message-text.service';

describe('AppMessageTextService', () => {
  let service: AppMessageTextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppMessageTextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
