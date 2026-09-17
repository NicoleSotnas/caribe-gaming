import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EldenRing } from './elden-ring';

describe('EldenRing', () => {
  let component: EldenRing;
  let fixture: ComponentFixture<EldenRing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EldenRing],
    }).compileComponents();

    fixture = TestBed.createComponent(EldenRing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
