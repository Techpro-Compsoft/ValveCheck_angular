import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SupervisorProfilePage } from './supervisor-profile.page';

describe('SupervisorProfilePage', () => {
  let component: SupervisorProfilePage;
  let fixture: ComponentFixture<SupervisorProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SupervisorProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
