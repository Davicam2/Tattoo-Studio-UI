import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageSliderModalComponent } from './image-slider-modal.component';

describe('ImageSliderModalComponent', () => {
  let component: ImageSliderModalComponent;
  let fixture: ComponentFixture<ImageSliderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageSliderModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageSliderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
