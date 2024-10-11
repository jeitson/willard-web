import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialReasonComponent } from './special-reason.component';

describe('SpecialReasonComponent', () => {
  let component: SpecialReasonComponent;
  let fixture: ComponentFixture<SpecialReasonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecialReasonComponent]
    });
    fixture = TestBed.createComponent(SpecialReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
