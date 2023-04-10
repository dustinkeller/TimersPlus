import { useStopwatch } from 'react-timer-hook';
import { useState, useEffect } from 'react';

export default function useTimer(timerName = "", timerDuration = 999) {
    const {
        seconds,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });
    
    const [name, setName] = useState(timerName);
    const [duration, setDuration] = useState(timerDuration);

    const [timeLeft, setTimeLeft] = useState(duration);
    const [isDone, setIsDone] = useState(false);
    
    useEffect(() => {
        setTimeLeft(duration-seconds);
        if(timeLeft <= 0) {
            pause();
            setIsDone(true);
        }
    }, [seconds]);
    
    const play = () => {
        if(!isDone) {
            start();
        }
    };
    
    const resetTimer = (timerName, timerDuration) => {
        setName(timerName);
        setDuration(timerDuration);
        setIsDone(false);
        reset(0,false)
    }

    return {
        name,
        duration,
        timeLeft,
        isRunning,
        isDone,
        play,
        pause,
        resetTimer,
    };

}