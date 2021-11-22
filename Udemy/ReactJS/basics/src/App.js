import Expenses from "./components/Expenses/Expenses";
import NewExpense from "./components/NewExpense/NewExpense";
import {useState} from 'react'

function App() {
  const defaultExpenses = [
    {
      id: 'e1',
      date: new Date(2021, 0, 31),
      title: 'lulw',
      amount: 296.67,
    },
    {
      id: 'e2',
      date: new Date(2021, 3, 2),
      title: 'omegalul',
      amount: 69.69,
    },
    {
      id: 'e3',
      date: new Date(2021, 7, 31),
      title: 'lmao',
      amount: 90,
    },
  ];

  const [expenses, setExpenses] = useState(defaultExpenses)

  function onAddExpenseHandler(expense){
    setExpenses((previousExpenses)=>{
      return [expense, ...previousExpenses]
    })
  }
  return (
    <div>
      <NewExpense onAddExpense={onAddExpenseHandler}/>
      <Expenses expenses={expenses}/>
    </div>
  );
}

export default App;
