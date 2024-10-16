import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceptionComponent } from './reception.component';

describe('ReceptionComponent', () => {
  let component: ReceptionComponent;
  let fixture: ComponentFixture<ReceptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReceptionComponent]
    });
    fixture = TestBed.createComponent(ReceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
