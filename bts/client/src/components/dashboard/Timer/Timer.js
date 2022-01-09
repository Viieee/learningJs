import { useTimer } from 'reactjs-countdown-hook';

export default function Timer(props) {
  let totalSeconds = props.timeDeficit;
  if (totalSeconds <= 0) {
    totalSeconds = 0;
  }
  const { seconds, minutes, hours, days } = useTimer(
    totalSeconds,
    handleTimerFinish
  );

  function handleTimerFinish() {
    // alert('times up!');
  }

  let dayText;
  if(days>0){
    dayText = `${days} day(s), ` 
  }else{
    dayText=''
  }

  return (
    <div>
      <div>{`${dayText}${hours} : ${minutes} : ${seconds}`}</div>
    </div>
  );
}
