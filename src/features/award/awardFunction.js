const getSum = (total, num) => {
  let points = 0;
  if (num >= 50)
    points += (num > 100 ? 100 : num) - 50;

  if (num >= 100)
    points += 2 * (num - 100);

  return total + points;
}

export function calcTotalPoints(transactions = []) {
  const transactionAmounts = transactions.map(each => each.amount);

  return transactionAmounts.reduce(getSum, 0);
}

// Accepts the array and key
const groupBy = (array, key) => {
  // Return the end result
  return array.reduce((result, currentValue) => {
    // If an array already present for key, push it to the array. Else create an array and push the object
    (result[parseInt(new Date(currentValue[key]).getMonth() + 1)] = result[parseInt(new Date(currentValue[key]).getMonth() + 1)] || []).push(
      currentValue
    );
    // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
    return result;
  }, {}); // empty object is the initial value for result object
};

export function calcMonthlyPoints(transactions = []) {
  let newTransactions = [...transactions];

  newTransactions.sort((a, b) => {
    if (a.time < b.time)
      return -1;

    if (a.time > b.time)
      return 1;

    return 0;
  });

  const monthlyTransactions = groupBy(newTransactions, 'time');

  let montlyPoints = {};
  for (const key in monthlyTransactions) {
    const transactionAmounts = monthlyTransactions[key];
    montlyPoints[key] = calcTotalPoints(transactionAmounts);
  }
  
  return montlyPoints;
}