import React, { useState, useEffect } from 'react'
import { useStopwatch } from 'react-timer-hook';
import { PlayArrow, Pause } from '@mui/icons-material';
import FlexBetween from 'components/FlexBetween';
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

export default function TimerWidget({ duration }) {
  const [message, setMessage] = useState(duration);
  const { palette } = useTheme();
  const [started, setStarted] = useState(false);
  const mediumMain = palette.neutral.mediumMain;
  const medium = palette.neutral.medium;
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    reset,
  } = useStopwatch({ autoStart: false });
  useEffect(() => {
    if(seconds >= duration) {
      pause();
      setMessage("Times Up");
    } else {
      setMessage(duration-seconds);
    }
  }, [seconds]);

  function handlePlay() {
    if(isRunning) {
      pause();
      return;
    }
    start();
  }

  return (
    <>
      <Divider />
      <br />
      <FlexBetween gap="0.25rem" onClick={handlePlay}>
        <span>{message}</span>
        <Typography color={mediumMain} sx={{ "&:hover": { cursor: "pointer", color: medium } }}>
          {isRunning ? <Pause sx={{ color: mediumMain }} /> : <PlayArrow sx={{ color: mediumMain }} />}
        </Typography>
      </FlexBetween>

    </>
  )
}
