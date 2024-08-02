import React, { PureComponent, createRef, useMemo } from 'react';
import { Account } from '../accounts/Account';
import { View } from '../common/View';

export function Broker() {

  return (
    <View style={{
      flex: 1,
    }}>
      
      <Account />
      <div style={{height: 100}}>Hello</div>
      {/* TODO: Add Buy/Sell */}
      {/* TODO: Add Stocks */}
    </View>
  );
}