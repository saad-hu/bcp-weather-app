// importing socket io client
import io from 'socket.io-client';

import { useState, useEffect } from 'react';
import { Box } from '@mui/material'

// components
import Navbar from './Navbar';
import DisplayWeatherCards from './DisplayWeatherCards';

// creating socket connect to server 
let socket = io.connect('http://localhost:4000/');

let metricUnit = ' °C';
let imperialUnit = ' °F';

const Guest = () => {

    let [weatherDataState, setWeatherDataState] = useState(null);
    let [updateTime, setUpdateTime] = useState(null);
    let [tempUnit, setTempUnit] = useState(null);
    let [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        socket.emit('join_guest_room', { units: 'metric' })
    }, [])

    useEffect(() => {
        socket.on('weather_update', dataObj => {
            setIsLoading(false);
            setWeatherDataState(dataObj.weatherData);
            setUpdateTime(dataObj.updateTime);
            if (dataObj.units === 'metric') setTempUnit(metricUnit);
            else setTempUnit(imperialUnit);
        })
    }, [socket])

    function changeUnits() {
        setIsLoading(true);

        socket.disconnect();
        socket.connect();
        let newUnit = tempUnit == ' °C' ? 'imperial' : 'metric';
        socket.emit('join_guest_room', { units: newUnit })
    }


    return (
        <Box>
            <Navbar isUser={false} ></Navbar>

            <DisplayWeatherCards weatherDataState={weatherDataState} updateTime={updateTime} tempUnit={tempUnit} changeUnits={changeUnits} deleteCity={null} isLoading={isLoading} />
        </Box>
    );
}

export default Guest;