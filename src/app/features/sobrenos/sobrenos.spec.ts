import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Sobrenos } from './sobrenos';

describe('Sobrenos', () => {
  let component: Sobrenos;
  let fixture: ComponentFixture<Sobrenos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sobrenos],
    }).compileComponents();

    fixture = TestBed.createComponent(Sobrenos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
