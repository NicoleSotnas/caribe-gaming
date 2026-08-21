import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HollowKnight } from './hollow-knight';

describe('HollowKnight', () => {
  let component: HollowKnight;
  let fixture: ComponentFixture<HollowKnight>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HollowKnight],
    }).compileComponents();

    fixture = TestBed.createComponent(HollowKnight);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
