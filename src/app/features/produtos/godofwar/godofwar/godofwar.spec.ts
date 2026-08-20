import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Godofwar } from './godofwar';

describe('Godofwar', () => {
  let component: Godofwar;
  let fixture: ComponentFixture<Godofwar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Godofwar],
    }).compileComponents();

    fixture = TestBed.createComponent(Godofwar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
