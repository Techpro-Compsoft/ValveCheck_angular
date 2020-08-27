import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompanyhomePage } from './companyhome.page';

describe('CompanyhomePage', () => {
  let component: CompanyhomePage;
  let fixture: ComponentFixture<CompanyhomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyhomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyhomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
