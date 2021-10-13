const customers = ['Vieri', 'Adhitya', 'Harviando'];

const activeCustomers = ['Vieri', 'Adhitya'];

// trying to find the inactive customers based on the overall customers and the active customers
// we will use lodash library
const inactiveCustomers = _.difference(customers, activeCustomers); // method from the lodash library

console.log(inactiveCustomers); // output: Harviando