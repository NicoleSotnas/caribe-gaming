import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APlagueTale } from './a-plague-tale';

describe('APlagueTale', () => {
  let component: APlagueTale;
  let fixture: ComponentFixture<APlagueTale>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [APlagueTale],
    }).compileComponents();

    fixture = TestBed.createComponent(APlagueTale);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
