import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailrequestComponent } from './detailrequest.component';

describe('DetailrequestComponent', () => {
  let component: DetailrequestComponent;
  let fixture: ComponentFixture<DetailrequestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailrequestComponent]
    });
    fixture = TestBed.createComponent(DetailrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
