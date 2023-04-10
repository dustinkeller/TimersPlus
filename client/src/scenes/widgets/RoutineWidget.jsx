import React, { useState, useRef, useEffect } from 'react';
import { useStopwatch } from 'react-timer-hook';
import FlexBetween from 'components/FlexBetween';
import {
    Pause,
    PlayArrow,
    RestartAlt
} from "@mui/icons-material"
import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
} from "@mui/material";

export default function RoutineWidget({ routine }) {

    const {
        seconds,
        isRunning,
        start,
        pause,
        reset,
    } = useStopwatch({ autoStart: false });


    const { palette } = useTheme();
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const [routines, setRoutines] = useState([]);
    const name = useRef("");
    const duration = useRef(0);
    const [currDuration, setCurrDuration] = useState(0)
    const [size, setSize] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const path = "client/src/audio/timer.mp3"
    const audio = new Audio(path)

    function playAlarm(){
        audio.play().then(() => { console.log('Playing')})
    }
    
    function handleRoutine() {
        setRoutines((oldArray) => [...oldArray, { name: name.current.value, duration: duration.current.value }]);
        setSize((siz) => siz + 1);
        
        if(size === 0){
            setCurrDuration(duration.current.value)
            setCurrentIndex(0);
            reset(0, false)
        }
    }

    function handlePlay() {
        if(isRunning){
            pause();
            return;
        }
        start();
    }

    function handleReset() {
        setCurrentIndex(0);
        pause();
        reset(0, false);
    }

    useEffect(() => {
        
        if (seconds >= currDuration && size > 0){
            playAlarm();
            setCurrentIndex((idx) => idx + 1);
            reset(0, true)
        }
        
    },[seconds])

    useEffect(() => {
        if(currentIndex > -1 && currentIndex < size){
            setCurrDuration(routines.at(currentIndex)['duration'])
        }
    }, [currentIndex])

    return (
        <>
            <h2>{routine}</h2>
            <form>
                <label>Name: </label>
                <input type="text" id="name" ref={name} />
                <label>Duration: </label>
                <input type="text" id="duration" ref={duration} />
            </form>
            <Button
                onClick={handleRoutine}
                sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                }}
            >
                ADD TIMER
            </Button>

            <FlexBetween gap="0.25rem" onClick={handlePlay}>
                <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                    {isRunning ? <Pause sx={{ color: mediumMain }} /> : <PlayArrow sx={{ color: mediumMain }} />}
                </Typography>
            </FlexBetween>

            <FlexBetween gap="0.25rem" onClick={handleReset}>
                <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
                    <RestartAlt sx={{ color: mediumMain }} />
                </Typography>
            </FlexBetween>

            {routines.map(({name, duration}, idx) => (
                <div key={name+idx}>
                    <Divider />
                    <br />
                    <FlexBetween gap="0.25rem">
                        {
                        idx === currentIndex ? 
                                <div>
                                    <b>{name}</b>
                                    <span>: {duration-seconds > 0 ? duration-seconds : "Times UP"} CURRENT</span> 
                                </div>
                            : 
                                <div>
                                    <b>{name}</b>
                                    <span>: { idx > currentIndex ? duration : "Times UP"}</span>
                                </div>
                        }
                    </FlexBetween>
                </div>
            ))}
        </>
    )
}
