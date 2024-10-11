import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationdepartureComponent } from './locationdeparture.component';

describe('LocationdepartureComponent', () => {
  let component: LocationdepartureComponent;
  let fixture: ComponentFixture<LocationdepartureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationdepartureComponent]
    });
    fixture = TestBed.createComponent(LocationdepartureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
