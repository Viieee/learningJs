import { useTimer } from 'reactjs-countdown-hook';

export default function Timer(props) {
  let totalSeconds = props.timeDeficit;
  if (totalSeconds <= 0) {
    totalSeconds = 0;
  }
  const { seconds, minutes, hours } = useTimer(
    totalSeconds,
    handleTimerFinish
  );

  function handleTimerFinish() {
    // alert('times up!');
  }

  return (
    <div>
      <div>{`${hours} : ${minutes} : ${seconds}`}</div>
    </div>
  );
}
