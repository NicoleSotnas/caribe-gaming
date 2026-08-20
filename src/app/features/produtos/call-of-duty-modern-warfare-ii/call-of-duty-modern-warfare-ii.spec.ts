import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallOfDutyModernWarfareIi } from './call-of-duty-modern-warfare-ii';

describe('CallOfDutyModernWarfareIi', () => {
  let component: CallOfDutyModernWarfareIi;
  let fixture: ComponentFixture<CallOfDutyModernWarfareIi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CallOfDutyModernWarfareIi],
    }).compileComponents();

    fixture = TestBed.createComponent(CallOfDutyModernWarfareIi);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
