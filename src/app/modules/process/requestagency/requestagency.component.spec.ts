import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestagencyComponent } from './requestagency.component';

describe('RequestagencyComponent', () => {
  let component: RequestagencyComponent;
  let fixture: ComponentFixture<RequestagencyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RequestagencyComponent]
    });
    fixture = TestBed.createComponent(RequestagencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
