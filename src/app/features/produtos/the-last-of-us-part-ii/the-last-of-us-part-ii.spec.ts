import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheLastOfUsPartii } from './the-last-of-us-part-ii';

describe('TheLastOfUsPartIi', () => {
  let component: TheLastOfUsPartii;
  let fixture: ComponentFixture<TheLastOfUsPartii>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TheLastOfUsPartii],
    }).compileComponents();

    fixture = TestBed.createComponent(TheLastOfUsPartii);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
