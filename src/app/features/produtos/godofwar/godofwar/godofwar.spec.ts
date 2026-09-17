import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodOfWar } from './godofwar';

describe('Godofwar', () => {
  let component: GodOfWar;
  let fixture: ComponentFixture<GodOfWar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GodOfWar],
    }).compileComponents();

    fixture = TestBed.createComponent(GodOfWar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
