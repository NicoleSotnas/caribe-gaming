import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LifeIsStrange } from './life-is-strange';

describe('LifeIsStrange', () => {
  let component: LifeIsStrange;
  let fixture: ComponentFixture<LifeIsStrange>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LifeIsStrange],
    }).compileComponents();

    fixture = TestBed.createComponent(LifeIsStrange);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
