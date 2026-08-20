import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssassinsCreedBlackFlag } from './assassins-creed-black-flag';

describe('AssassinsCreedBlackFlag', () => {
  let component: AssassinsCreedBlackFlag;
  let fixture: ComponentFixture<AssassinsCreedBlackFlag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssassinsCreedBlackFlag],
    }).compileComponents();

    fixture = TestBed.createComponent(AssassinsCreedBlackFlag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
