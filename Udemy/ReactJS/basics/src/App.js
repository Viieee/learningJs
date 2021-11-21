import Expenses from "./components/Expenses/Expenses";

function App() {
  const expenses = [
    {
      date: new Date(2021, 0, 31),
      title: 'lulw',
      amount: 296.67,
    },
    {
      date: new Date(2021, 3, 2),
      title: 'omegalul',
      amount: 69.69,
    },
    {
      date: new Date(2021, 7, 31),
      title: 'lmao',
      amount: 90,
    },
  ];
  console.log(expenses.length)
  return (
    <div>
      <h2>Let's get started!</h2>
      <Expenses expenses={expenses}/>
    </div>
  );
}

export default App;
