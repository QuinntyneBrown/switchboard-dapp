import { Claim, PreconditionType } from 'iam-client-lib';
import { RolePreconditionType } from '../models/role-precondition-type.enum';

export interface EnrolmentPrecondition {
  type: string;
  conditions: string[];
}

export interface PreconditionCheck {
  namespace: string;
  status: RolePreconditionType;
}

export const preconditionCheck = (
  preconditionList: EnrolmentPrecondition[],
  roleClaimList: Claim[]
): [boolean, PreconditionCheck[]] => {
  let retVal = true;
  let rolePreconditionList: PreconditionCheck[];
  if (preconditionList && preconditionList.length) {
    for (const precondition of preconditionList) {
      switch (precondition.type) {
        case PreconditionType.Role:
          // Check for Role Conditions
          rolePreconditionList = [];

          // eslint-disable-next-line no-case-declarations
          const conditions = precondition.conditions;
          if (conditions) {
            for (const roleCondition of conditions) {
              const status = getRoleConditionStatus(
                roleCondition,
                roleClaimList
              );
              rolePreconditionList.push({
                namespace: roleCondition,
                status,
              });

              if (status !== RolePreconditionType.SYNCED) {
                retVal = false;
              }
            }
          }
          break;
      }
    }
  }

  return [retVal, rolePreconditionList];
};

const getRoleConditionStatus = (namespace: string, roleList) => {
  let status = RolePreconditionType.PENDING;
  // Check if namespace exists in synced DID Doc Roles
  for (const roleObj of roleList) {
    if (roleObj.claimType === namespace) {
      if (roleObj.isAccepted) {
        if (roleObj.isSynced) {
          status = RolePreconditionType.SYNCED;
        } else {
          status = RolePreconditionType.APPROVED;
        }
      }
      break;
    }
  }

  return status;
};
