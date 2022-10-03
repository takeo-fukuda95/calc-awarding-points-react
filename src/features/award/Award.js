import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import debounce from 'lodash/debounce';
import {
  fetchCustomers,
  fetchTransactions,
  currentCustomers,
  currentTransactions,
  currentCustomersStatus
} from './awardSlice';
import { calcTotalPoints, calcMonthlyPoints } from './awardFunction';
import styles from './Award.module.css';

const DEBOUNCE_DELAY = 1500;

const Award = () => {
  const customerSuggestions = useSelector(currentCustomers);
  const transactions = useSelector(currentTransactions);
  const fetchCustomersStatus = useSelector(currentCustomersStatus);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const fetchCustomerQuery = useCallback(
    val => {
      setIsLoadingCustomers(true);
      dispatch(fetchCustomers(val));
    },
    [dispatch]
  );

  const fetchTransactionQuery = useCallback(
    val => {
      setIsLoadingCustomers(true);
      dispatch(fetchTransactions(val));
    },
    [dispatch]
  );

  const delayedCustomerQuery = useMemo(
    () => 
      debounce(val => {
        fetchCustomerQuery(val);
      }, DEBOUNCE_DELAY),
    [fetchCustomerQuery]
  );
  
  useEffect(() => {
    setIsLoadingCustomers((open) || fetchCustomersStatus === 'loading');
    
    return () => {
      delayedCustomerQuery.cancel();
    };
  }, [open, customerSuggestions, fetchCustomersStatus, delayedCustomerQuery]);
  
  const getCustomerSuggestionsOnValue = (keyword) => {
    delayedCustomerQuery(keyword);
  }

  const resetCustomerSuggestionsOnValue = () => {
    fetchTransactionQuery(0);
  }

  const onChangeCustomer = (customerInfo) => {
    if (!customerInfo)
      return;

    fetchTransactionQuery(customerInfo.id);
  }

  return (
    <div className={styles.awardContainer}>
      <Autocomplete
        id="customer_select"
        sx={{ width: 340 }}
        filterOptions={(x) => x}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={customerSuggestions}
        loading={isLoadingCustomers}
        onInputChange={(event, value, reason) => {
          if (reason === 'input') {
            getCustomerSuggestionsOnValue(value);
          } else if (reason === 'clear') {
            resetCustomerSuggestionsOnValue();
          }
        }}
        onChange={(event, value, reason, details) => onChangeCustomer(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Customer"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoadingCustomers ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
      {transactions.length > 0 && (
        <div className={styles.infoContainer}>
          <div className={styles.transactionsContainer}>
            <div className={styles.transactionsContainerHeader}>
              <span>Amount</span>
              <span>Trasaction Date</span>
            </div>
            <div className={styles.transactionsContainerBody}>
              {transactions.map((each, index) => {
                const eachDateTime = new Date(each.time);
                return (
                  <div key={index}>
                    <span>${each.amount}</span>
                    <span>{`${eachDateTime.getMonth() + 1}/${eachDateTime.getDate()} ${eachDateTime.getFullYear()}`}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className={styles.pointsContainer}>
            <div className={styles.totalPointsContainer}>
              Total Points: {calcTotalPoints(transactions)}
            </div>
            <div className={styles.monthlyPointsContainer}>
              <div className={styles.monthlyPointsContainerHeader}>
                <div className={styles.monthlyPointsContainerHeaderTitle}>Montly Points:</div>
                <div className={styles.monthlyPointsContainerHeaderCaption}>
                  <span>Month</span>
                  <span>Awarding Points</span>
                </div>
              </div>
              <div className={styles.monthlyPointsContainerBody}>
                {Object.entries(calcMonthlyPoints(transactions)).map(([key, value], i) => {
                    return (
                      <div key={i} className={styles.eachMonthPointsContainer}>
                        <span>{key}</span>
                        <span>{value} points</span>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Award;