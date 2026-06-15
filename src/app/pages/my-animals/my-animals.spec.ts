import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnimalsComponent } from './my-animals';

describe('MyAnimalsComponent', () => {
  let component: MyAnimalsComponent;
  let fixture: ComponentFixture<MyAnimalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAnimalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAnimalsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
