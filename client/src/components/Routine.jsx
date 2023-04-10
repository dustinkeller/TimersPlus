import React, { useState, useEffect } from 'react';

function Routine(props) {
  const [timers, setTimers] = useState([]);
  const [currentTimer, setCurrentTimer] = useState(0);

  useEffect(() => {
    // Start the first timer when the component mounts
    if (timers.length > 0) {
      startTimer(0);
    }

    // Stop the current timer when the component unmounts
    return () => {
      if (currentTimer) {
        clearTimeout(currentTimer);
      }
    };
  }, []);

  function addTimer(duration) {
    // Add a new timer to the list
    setTimers([...timers, duration]);
  }

  function startTimer(index) {
    // Start the timer at the given index
    setCurrentTimer(
      setTimeout(() => {
        playAlarm();
        if (index < timers.length - 1) {
          startTimer(index + 1);
        } else {
          // Reset the timers when the last timer finishes
          setTimers([]);
          setCurrentTimer(0);
        }
      }, timers[index] * 1000)
    );
  }

  function stopTimer() {
    // Stop the current timer and reset the timers
    clearTimeout(currentTimer);
    setTimers([]);
    setCurrentTimer(0);
  }

  function playAlarm() {
    // Play the alarm sound
    const audio = new Audio('audio/alarm.wav');
    audio.play();
  }

  return (
    <div>
      <h2>Routine</h2>
      {timers.length === 0 ? (
        <div>
          <button onClick={() => addTimer(30)}>Add 30-second timer</button>
          <button onClick={() => addTimer(60)}>Add 1-minute timer</button>
        </div>
      ) : (
        <div>
          <p>Timer {currentTimer + 1} of {timers.length}</p>
          <button onClick={stopTimer}>Stop routine</button>
        </div>
      )}
    </div>
  );
}

export default Routine;