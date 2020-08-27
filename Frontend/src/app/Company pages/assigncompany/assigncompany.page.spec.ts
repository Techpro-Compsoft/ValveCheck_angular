import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssigncompanyPage } from './assigncompany.page';

describe('AssigncompanyPage', () => {
  let component: AssigncompanyPage;
  let fixture: ComponentFixture<AssigncompanyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssigncompanyPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssigncompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
