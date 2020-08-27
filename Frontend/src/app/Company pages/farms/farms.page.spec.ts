import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FarmsPage } from './farms.page';

describe('FarmsPage', () => {
  let component: FarmsPage;
  let fixture: ComponentFixture<FarmsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FarmsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
