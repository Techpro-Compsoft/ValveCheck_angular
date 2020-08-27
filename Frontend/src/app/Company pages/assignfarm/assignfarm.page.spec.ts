import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AssignfarmPage } from './assignfarm.page';

describe('AssignfarmPage', () => {
  let component: AssignfarmPage;
  let fixture: ComponentFixture<AssignfarmPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignfarmPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AssignfarmPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
