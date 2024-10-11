import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrucktypeComponent } from './trucktype.component';

describe('TrucktypeComponent', () => {
  let component: TrucktypeComponent;
  let fixture: ComponentFixture<TrucktypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrucktypeComponent]
    });
    fixture = TestBed.createComponent(TrucktypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
