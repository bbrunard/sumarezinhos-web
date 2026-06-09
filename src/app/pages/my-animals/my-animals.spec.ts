import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnimals } from './my-animals';

describe('MyAnimals', () => {
  let component: MyAnimals;
  let fixture: ComponentFixture<MyAnimals>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAnimals],
    }).compileComponents();

    fixture = TestBed.createComponent(MyAnimals);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
