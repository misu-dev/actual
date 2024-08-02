import { useMemo } from 'react';

import { useAccounts } from './useAccounts';

export function useBrokerAccounts() {
  const accounts = useAccounts();
  return useMemo(
    () =>
      accounts.filter(
        account => account.closed === 0 && account.offbudget === 1 && account.broker === 1
      ),
    [accounts],
  );
}
