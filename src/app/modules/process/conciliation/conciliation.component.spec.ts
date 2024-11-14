import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciliationComponent } from './conciliation.component';

describe('ConciliationComponent', () => {
  let component: ConciliationComponent;
  let fixture: ComponentFixture<ConciliationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConciliationComponent]
    });
    fixture = TestBed.createComponent(ConciliationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
