import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { customers, transactions } from '../../utils/tests.data';

const mock = new MockAdapter(axios, { delayResponse: 500 });

mock.onGet(/api\/customers\/?.*/).reply((config) => {
  if (config.params.hasOwnProperty('keyword')) {
    const keyword = config.params['keyword'];
    let filteredCustomers = [];
    if (keyword)
      filteredCustomers = customers.filter(each => each.name.startsWith(keyword));

    return [202, filteredCustomers];
  } else {
    return [202, []];
  }
});

mock.onGet(/api\/transactions\/?.*/).reply((config) => {
  if (config.params.hasOwnProperty('userId')) {
    const userId = config.params['userId'];
    let newTransactions = [...transactions];

    let filteredTransactions = {
      transLog: []
    };

    if (userId)
      filteredTransactions = newTransactions.find(each => each.userId === (userId % 5 === 0 ? 1 : userId % 5));

    filteredTransactions.transLog.sort((a, b) => {
      if (a.time < b.time)
        return -1;
  
      if (a.time > b.time)
        return 1;
  
      return 0;
    });

    return [202, filteredTransactions.transLog];
  } else {
    return [202, []];
  }
});

export function fetchCustomerList(keyword = '') {
  return new Promise((resolve) => {
      axios
        .get("/api/customers", { params: { keyword } })
        .then(function (response) {
          resolve(response)
        });
    }
  );
}

export function fetchTransactionList(userId = 0) {
  return new Promise((resolve) => {
      axios
        .get("/api/transactions", { params: { userId } })
        .then(function (response) {
          resolve(response)
        });
    }
  );
}
