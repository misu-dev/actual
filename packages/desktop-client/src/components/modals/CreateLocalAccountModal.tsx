// @ts-strict-ignore
import React, { type FormEvent, useState } from 'react';
import { Form } from 'react-aria-components';
import { useDispatch } from 'react-redux';

import { closeModal, createAccount } from 'loot-core/client/actions';
import { toRelaxedNumber } from 'loot-core/src/shared/util';

import { useNavigate } from '../../hooks/useNavigate';
import { theme } from '../../style';
import { Button } from '../common/Button2';
import { FormError } from '../common/FormError';
import { InitialFocus } from '../common/InitialFocus';
import { InlineField } from '../common/InlineField';
import { Input } from '../common/Input';
import { Link } from '../common/Link';
import {
  Modal,
  ModalButtons,
  ModalCloseButton,
  ModalHeader,
  ModalTitle,
} from '../common/Modal2';
import { Text } from '../common/Text';
import { View } from '../common/View';
import { Select } from '../common/Select';

export function CreateLocalAccountModal() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('0');
  const [accountType, setAccountType] = useState('brokerage_account');

  const [nameError, setNameError] = useState(false);
  const [accountTypeError, setAccountTypeError] = useState(false);
  const [balanceError, setBalanceError] = useState(false);

  const validateBalance = balance => !isNaN(parseFloat(balance));
  const validateAccountType = (accountType: string) => ['budget_account', 'off_budget_account', 'brokerage_account'].includes(accountType);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nameError = !name;
    setNameError(nameError);

    const accountTypeError = !validateAccountType(accountType);
    setAccountTypeError(accountTypeError);

    const balanceError = !validateBalance(balance);
    setBalanceError(balanceError);

    if (!nameError && !accountTypeError && !balanceError) {
      // dispatch(closeModal());
      const offbudget = accountType === 'off_budget_account' || accountType === 'brokerage_account';
      const broker = accountType === 'brokerage_account';
      const navigationUrl = accountType === 'off_budget_account' || accountType === 'budget_account' ? '/accounts' : '/brokers';

      const id = await dispatch(
        createAccount(name, toRelaxedNumber(balance), offbudget, broker)
      );

      navigate(`${navigationUrl}/${id}`);
    }
  };
  return (
    <Modal name="add-local-account">
      {({ state: { close } }) => (
        <>
          <ModalHeader
            title={<ModalTitle title="Create Local Account" shrinkOnOverflow />}
            rightContent={<ModalCloseButton onClick={close} />}
          />
          <View>
            <Form onSubmit={onSubmit}>
              <InlineField label="Name" width="100%">
                <InitialFocus>
                  <Input
                    name="name"
                    value={name}
                    onChange={event => setName(event.target.value)}
                    onBlur={event => {
                      const name = event.target.value.trim();
                      setName(name);
                      if (name && nameError) {
                        setNameError(false);
                      }
                    }}
                    style={{ flex: 1 }}
                  />
                </InitialFocus>
              </InlineField>
              {nameError && (
                <FormError style={{ marginLeft: 75 }}>
                  Name is required
                </FormError>
              )}

              <InlineField label="Type" width="100%">
                <Select
                  options={
                    [
                      ['budget_account', 'Budget Account'],
                      ['off_budget_account', 'Off-Budget Account'],
                      ['brokerage_account', 'Brokerage Account']
                    ]}
                  value={accountType}
                  onChange={type => setAccountType(type)}
                  buttonStyle={{ flex: 1 }}
                />
              </InlineField>
              {accountTypeError && (
                <FormError style={{ marginLeft: 75 }}>
                  Account Type is not valid
                </FormError>
              )}

              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                }}
              >
                <View style={{ flexDirection: 'column' }}>
                  <div
                    style={{
                      textAlign: 'right',
                      fontSize: '0.7em',
                      color: theme.pageTextLight,
                      marginTop: 3,
                    }}
                  >
                    <Text>
                      This cannot be changed later. <br /> {'\n'}
                      See{' '}
                      <Link
                        variant="external"
                        linkColor="muted"
                        to="https://actualbudget.org/docs/accounts/#off-budget-accounts"
                      >
                        Accounts Overview
                      </Link>{' '}
                      for more information.
                    </Text>
                  </div>
                </View>
              </View>

              <InlineField label="Balance" width="100%">
                <Input
                  name="balance"
                  inputMode="decimal"
                  value={balance}
                  onChange={event => setBalance(event.target.value)}
                  onBlur={event => {
                    const balance = event.target.value.trim();
                    setBalance(balance);
                    if (validateBalance(balance) && balanceError) {
                      setBalanceError(false);
                    }
                  }}
                  style={{ flex: 1 }}
                />
              </InlineField>
              {balanceError && (
                <FormError style={{ marginLeft: 75 }}>
                  Balance must be a number
                </FormError>
              )}

              <ModalButtons>
                <Button onPress={close}>Back</Button>
                <Button
                  type="submit"
                  variant="primary"
                  style={{ marginLeft: 10 }}
                >
                  Create
                </Button>
              </ModalButtons>
            </Form>
          </View>
        </>
      )}
    </Modal>
  );
}
