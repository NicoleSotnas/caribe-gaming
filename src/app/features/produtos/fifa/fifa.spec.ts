import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fifa } from './fifa';

describe('Fifa', () => {
  let component: Fifa;
  let fixture: ComponentFixture<Fifa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fifa],
    }).compileComponents();

    fixture = TestBed.createComponent(Fifa);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
