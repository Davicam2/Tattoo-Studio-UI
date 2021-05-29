import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterCarePageComponent } from './after-care-page.component';

describe('AfterCarePageComponent', () => {
  let component: AfterCarePageComponent;
  let fixture: ComponentFixture<AfterCarePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterCarePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterCarePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
