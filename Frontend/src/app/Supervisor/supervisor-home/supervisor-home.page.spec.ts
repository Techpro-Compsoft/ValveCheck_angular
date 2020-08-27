import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupervisorHomePage } from './supervisor-home.page';

describe('SupervisorHomePage', () => {
  let component: SupervisorHomePage;
  let fixture: ComponentFixture<SupervisorHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisorHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
