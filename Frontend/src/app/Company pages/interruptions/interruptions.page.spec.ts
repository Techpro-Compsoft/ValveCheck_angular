import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InterruptionsPage } from './interruptions.page';

describe('InterruptionsPage', () => {
  let component: InterruptionsPage;
  let fixture: ComponentFixture<InterruptionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterruptionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InterruptionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
