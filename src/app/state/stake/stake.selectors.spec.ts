import * as stakeSelectors from './stake.selectors';
import { isWithdrawDisabled } from './stake.selectors';
import { StakeStatus } from 'iam-client-lib';

describe('Stake Selectors', () => {

  describe('getBalance', () => {
    it('should return undefined when passing empty state object', () => {
      expect(stakeSelectors.getBalance.projector({})).toBeUndefined();
    });
  });

  describe('isStakingDisabled', () => {
    it('should return false when status is nonstaking', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.NONSTAKING})).toBe(false);
    });

    it('should return true when status is staking', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.STAKING})).toBe(true);
    });

    it('should return true when status is withdrawing', () => {
      expect(stakeSelectors.isStakingDisabled.projector({status: StakeStatus.WITHDRAWING})).toBe(true);
    });
  });

  describe('isWithdrawDisabled', () => {
    it('should return false when status is staking', () => {
      expect(stakeSelectors.isWithdrawDisabled.projector({status: StakeStatus.STAKING})).toBe(false);
    });

    it('should return true when status is nonstaking', () => {
      expect(stakeSelectors.isWithdrawDisabled.projector({status: StakeStatus.NONSTAKING})).toBe(true);
    });

  });

});
