import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheLastOfUs } from './the-last-of-us';

describe('TheLastOfUs', () => {
  let component: TheLastOfUs;
  let fixture: ComponentFixture<TheLastOfUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheLastOfUs],
    }).compileComponents();

    fixture = TestBed.createComponent(TheLastOfUs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
