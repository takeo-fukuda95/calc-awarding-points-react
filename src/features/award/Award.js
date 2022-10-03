import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import styles from './Award.module.css';

const Award = () => {
  const [open, setOpen] = useState(false);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  
  useEffect(() => {
    setIsLoadingCustomers(open);
  }, [open]);
  
  const getCustomerSuggestionsOnValue = (keyword) => {
  }

  const onChangeCustomer = (customerInfo) => {
    if (!customerInfo)
      return;
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
    </div>
  );
}

export default Award;