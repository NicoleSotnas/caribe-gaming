import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F1 } from './f1';

describe('F1', () => {
  let component: F1;
  let fixture: ComponentFixture<F1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [F1],
    }).compileComponents();

    fixture = TestBed.createComponent(F1);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
