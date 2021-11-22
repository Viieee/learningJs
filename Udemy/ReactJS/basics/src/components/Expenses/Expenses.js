import './Expenses.css';

import ExpenseItem from './ExpenseItem';
import Card from '../UI/Card';
import ExpenseFilter from './ExpenseFilter';

import {useState} from 'react'


function Expenses(props) {
  const expenses = props.expenses;
  const [filteredYear, setFilteredYear] = useState('2021')
  
  function filterChangeHandler(selectedYear) {
    setFilteredYear(selectedYear)
  }
  return (
    <Card className="expenses">
      <ExpenseFilter selectedYear={filteredYear} onFilterChange={filterChangeHandler}/>
      {expenses.map((expense)=>(
        <ExpenseItem title={expense.title} amount={expense.amount} date={expense.date}/>
      ))}
    </Card>
  );
}

export default Expenses;
