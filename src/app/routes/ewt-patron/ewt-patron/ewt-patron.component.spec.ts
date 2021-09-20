import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EwtPatronComponent } from './ewt-patron.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StakeState } from '../../../state/stake/stake.reducer';
import * as poolSelectors from '../../../state/pool/pool.selectors';
import { LastDigitsPipe } from '../pipes/last-digits.pipe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import * as PoolActions from '../../../state/pool/pool.actions';
import { IamService } from '../../../shared/services/iam.service';
import * as AuthActions from '../../../state/auth/auth.actions';

describe('EwtPatronComponent', () => {
  let component: EwtPatronComponent;
  let fixture: ComponentFixture<EwtPatronComponent>;
  let store: MockStore<StakeState>;
  const iamServiceSpy = jasmine.createSpyObj('IamService', ['isSessionActive']);
  const mockActivatedRoute = {queryParams: of({org: 'org'})};
  const setUp = (options?: {
    balance?: string;
    reward?: number;
    performance?: number;
  }) => {
    const opt = {
      balance: '0',
      reward: 10,
      performance: 100,
      ...options
    };
    store.overrideSelector(poolSelectors.getBalance, opt.balance);
    store.overrideSelector(poolSelectors.getAnnualReward, opt.reward);
    store.overrideSelector(poolSelectors.getPerformance, opt.performance);
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [EwtPatronComponent, LastDigitsPipe],
      providers: [
        {provide: IamService, useValue: iamServiceSpy},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        provideMockStore()
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
    store = TestBed.inject(MockStore);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EwtPatronComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    setUp();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set an organization', () => {
    setUp();
    const dispatchSpy = spyOn(store, 'dispatch');
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalledWith(PoolActions.setOrganization({organization: 'org'}));
  });

  it('should dispatch action to reinitialize login', () => {
    setUp();
    const dispatchSpy = spyOn(store, 'dispatch');
    iamServiceSpy.isSessionActive.and.returnValue(true);
    fixture.detectChanges();

    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.reinitializeAuthForPatron());
  });

  it('should dispatch action to open login dialog', () => {
    setUp();
    const dispatchSpy = spyOn(store, 'dispatch');
    iamServiceSpy.isSessionActive.and.returnValue(false);
    fixture.detectChanges();

    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(AuthActions.openLoginDialog());
  });
});
