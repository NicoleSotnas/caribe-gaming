import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrandTheftAutoV} from './grandtheftautov';

describe('GrandTheftAutoV', () => {
  let component: GrandTheftAutoV;
  let fixture: ComponentFixture<GrandTheftAutoV>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrandTheftAutoV],
    }).compileComponents();

    fixture = TestBed.createComponent(GrandTheftAutoV);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
