import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutestatusComponent } from './routestatus.component';

describe('RoutestatusComponent', () => {
  let component: RoutestatusComponent;
  let fixture: ComponentFixture<RoutestatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoutestatusComponent]
    });
    fixture = TestBed.createComponent(RoutestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
