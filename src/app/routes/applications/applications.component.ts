import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject } from 'rxjs';

import { NewOrganizationComponent } from './new-organization/new-organization.component';
import { ListType } from '../../shared/constants/shared-constants';
import { IamService } from '../../shared/services/iam.service';
import { UrlParamService } from '../../shared/services/url-param.service';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { Store } from '@ngrx/store';
import {
  ApplicationActions,
  OrganizationActions,
  OrganizationSelectors,
  RoleActions,
} from '@state';
import { OrganizationListComponent } from './organization-list/organization-list.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { RoleListComponent } from './role-list/role-list.component';
import { MatTabChangeEvent } from '@angular/material/tabs/tab-group';
import { EnvService } from '../../shared/services/env/env.service';
import { RouterConst } from '../router-const';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss'],
})
export class ApplicationsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('governanceTabGroup') governanceTabGroup: MatTabGroup;
  @ViewChild('listOrg') listOrg: OrganizationListComponent;
  @ViewChild('listApp') listApp: ApplicationListComponent;
  @ViewChild('listRole') listRole: RoleListComponent;

  hierarchyLength$ = this.store.select(
    OrganizationSelectors.getHierarchyLength
  );
  isSelectedOrgNotOwnedByUser$ = this.store.select(
    OrganizationSelectors.isSelectedOrgNotOwnedByUser
  );

  isAppShown = false;
  isRoleShown = false;
  isFilterShown = false;
  isIamEwcOwner = false;

  showFilter = {
    org: false,
    app: false,
    role: false,
  };
  defaultFilterOptions = {
    app: undefined,
    role: undefined,
  };

  ListType = ListType;

  private subscription$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private iamService: IamService,
    private urlParamService: UrlParamService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private store: Store,
    private envService: EnvService
  ) {}

  ngAfterViewInit(): void {
    this.activatedRoute.queryParams
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((params: any) => {
        if (params && params.selectedTab) {
          this.governanceTabGroup.selectedIndex = params.selectedTab;
        }
      })
      .unsubscribe();
  }

  ngOnDestroy(): void {
    this.subscription$.next();
    this.subscription$.complete();
    this.cleanFilters();
  }

  openNewOrgComponent(): void {
    if (!this.isIamEwcOwner) {
      const namespace =
        'orgcreator.apps.testorg.' + this.envService.rootNamespace;
      const roleName = 'org';
      this.router.navigate([RouterConst.Enrol], {
        queryParams: { roleName, app: namespace, stayLoggedIn: true },
      });
      return;
    }

    const dialogRef = this.dialog.open(NewOrganizationComponent, {
      width: '600px',
      data: {},
      maxWidth: '100%',
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.subscription$))
      .subscribe((result) => {
        // console.log('The dialog was closed');

        if (result) {
          this.listOrg.getList(true);
        }
      });
  }

  createSubOrg() {
    this.store.dispatch(OrganizationActions.createSubForParent());
  }

  async ngOnInit() {
    this.isIamEwcOwner = await this.iamService.domainsService.isOwner({
      domain: this.envService.rootNamespace,
    });
  }

  showMe(i: MatTabChangeEvent) {
    // Preserve Selected Tab
    this.urlParamService.updateQueryParams(this.router, this.activatedRoute, {
      selectedTab: i.index,
    });

    if (i.index === 1) {
      // console.log('Showing App List');
      if (this.isAppShown) {
        this.listApp.getList();
      } else {
        this.isAppShown = true;
      }
    } else if (i.index === 2) {
      // console.log('Showing Role List');
      if (this.isRoleShown) {
        this.listRole.getList();
      } else {
        this.isRoleShown = true;
      }
    } else if (i.index === 0) {
      // console.log('Showing Org List');
      this.listOrg.getList();
    }
  }

  toggleFilter(listType: string) {
    switch (listType) {
      case ListType.ORG:
        this.showFilter.org = !this.showFilter.org;
        break;
      case ListType.APP:
        this.store.dispatch(ApplicationActions.toggleFilters());
        break;
      case ListType.ROLE:
        this.store.dispatch(RoleActions.toggleFilters());
        break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateFilter(filterOptions: any) {
    let tabIdx = 0;
    switch (filterOptions.listType) {
      case ListType.APP:
        tabIdx = 1;
        this.store.dispatch(
          ApplicationActions.updateFilters({
            filters: filterOptions,
            namespace: this.envService.rootNamespace,
          })
        );
        this.store.dispatch(ApplicationActions.showFilters());
        break;
      case ListType.ROLE:
        tabIdx = 2;
        this.store.dispatch(
          RoleActions.updateFilters({
            filters: filterOptions,
            namespace: this.envService.rootNamespace,
          })
        );
        this.store.dispatch(RoleActions.showFilters());
        break;
    }

    this.governanceTabGroup.selectedIndex = tabIdx;
  }

  private cleanFilters(): void {
    this.store.dispatch(RoleActions.cleanUpFilters());
    this.store.dispatch(ApplicationActions.cleanUpFilters());
  }
}
