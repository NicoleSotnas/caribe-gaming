import { ComponentFixture, TestBed } from '@angular/core/testing';

import {GodOfWarRagnarok} from './god-of-war-ragnarok';

describe('Ragnarok', () => {
  let component: GodOfWarRagnarok;
  let fixture: ComponentFixture<GodOfWarRagnarok>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GodOfWarRagnarok],
    }).compileComponents();

    fixture = TestBed.createComponent(GodOfWarRagnarok);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
