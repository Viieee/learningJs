import './ExpenseItem.css';
import Card from '../UI/Card';
import ExpenseDate from './ExpenseDate';
import { useState } from 'react';

function ExpenseItem(props) {
  const [title, settingTitle] = useState(props.title);

  // let title = props.title

  function clickHandler() {
    settingTitle('updated')
    console.log('clicked');
  }
  return (
    <Card className="expense-item">
      <ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2>{title}</h2>
        <div className="expense-item__price">${props.amount}</div>
      </div>
      <button onClick={clickHandler}>Change title</button>
    </Card>
  );
}

export default ExpenseItem;
