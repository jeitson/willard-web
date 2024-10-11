import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestplannerComponent } from './requestplanner.component';

describe('RequestplannerComponent', () => {
  let component: RequestplannerComponent;
  let fixture: ComponentFixture<RequestplannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestplannerComponent]
    });
    fixture = TestBed.createComponent(RequestplannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
