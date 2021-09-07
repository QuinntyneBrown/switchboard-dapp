import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrganizationState, USER_FEATURE_KEY } from './organization.reducer';

export const getOrganizationState = createFeatureSelector<OrganizationState>(USER_FEATURE_KEY);

export const getList = createSelector(
  getOrganizationState,
  (state) => state.history
);

export const getHierarchy = createSelector(
  getOrganizationState,
  (state) => state.hierarchy
);
