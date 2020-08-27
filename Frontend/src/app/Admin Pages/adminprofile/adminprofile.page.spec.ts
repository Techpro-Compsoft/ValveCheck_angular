import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AdminprofilePage } from './adminprofile.page';

describe('AdminprofilePage', () => {
  let component: AdminprofilePage;
  let fixture: ComponentFixture<AdminprofilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminprofilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
