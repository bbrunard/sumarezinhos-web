import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdoptions } from './my-adoptions';

describe('MyAdoptions', () => {
  let component: MyAdoptions;
  let fixture: ComponentFixture<MyAdoptions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAdoptions],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAdoptions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
