import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestlogisticsComponent } from './requestlogistics.component';

describe('RequestlogisticsComponent', () => {
  let component: RequestlogisticsComponent;
  let fixture: ComponentFixture<RequestlogisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestlogisticsComponent]
    });
    fixture = TestBed.createComponent(RequestlogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
