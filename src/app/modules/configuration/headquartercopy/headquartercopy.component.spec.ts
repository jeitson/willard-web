import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadquartercopyComponent } from './headquartercopy.component';

describe('HeadquartercopyComponent', () => {
  let component: HeadquartercopyComponent;
  let fixture: ComponentFixture<HeadquartercopyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeadquartercopyComponent]
    });
    fixture = TestBed.createComponent(HeadquartercopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
