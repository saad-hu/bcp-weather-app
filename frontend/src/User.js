// importing socket io client
import io from 'socket.io-client';

import { useState, useEffect } from 'react';
import { Button, Box, TextField, Alert, IconButton } from '@mui/material';
import { useParams } from 'react-router-dom';

// components
import Navbar from './Navbar';
import DisplayWeatherCards from './DisplayWeatherCards';

import CloseIcon from '@mui/icons-material/Close';

// creating socket connect to server 
let socket = io.connect('http://localhost:4000/');

let metricUnit = ' °C';
let imperialUnit = ' °F';

const User = () => {

    let { userId, userName } = useParams();
    let [weatherDataState, setWeatherDataState] = useState(null);
    let [updateTime, setUpdateTime] = useState(null);
    let [tempUnit, setTempUnit] = useState(null);

    let [searchCityValue, setSearchCityValue] = useState('');
    let [alertMessage, setAlertMessage] = useState(null);
    let [isLoading, setIsLoading] = useState(true);


    // first render
    useEffect(() => {
        socket.emit('join_user', { userId, units: 'metric' });
    }, [])

    // useEffect for receiving socket emits
    useEffect(() => {
        socket.on('weather_update', dataObj => {
            setIsLoading(false);

            setWeatherDataState(dataObj.weatherData);
            setUpdateTime(dataObj.updateTime);
            if (dataObj.units === 'metric') setTempUnit(metricUnit);
            else setTempUnit(imperialUnit);
        })

        socket.on('custom_error', (errData) => {
            setIsLoading(false);
            setAlertMessage(errData.errMessage);
        })

    }, [socket]);


    function changeUnits() {
        setIsLoading(true);
        socket.disconnect();
        socket.connect();
        let newUnit = tempUnit == ' °C' ? 'imperial' : 'metric';
        socket.emit('join_user', { userId, units: newUnit })
    }

    function addCitySubmit(event) {
        event.preventDefault();
        setIsLoading(true);

        let currentUnit = tempUnit == ' °C' ? 'metric' : 'imperial';

        socket.emit('add_new_city', { city: searchCityValue, userId, units: currentUnit })
        setSearchCityValue('');
    }

    function deleteCity(city) {
        setIsLoading(true);
        let currentUnit = tempUnit == ' °C' ? 'metric' : 'imperial';
        socket.emit('delete_city', { userId, city, units: currentUnit });
    }

    return (

        <Box>

            {/* navbar */}
            <Navbar isUser={true} userName={userName} ></Navbar>


            {/* alert message container */}
            {alertMessage && (
                <Box mb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Alert variant="filled" severity="error" action={
                        <IconButton size="small" onClick={() => setAlertMessage(null)}>
                            <CloseIcon />
                        </IconButton>
                    }>
                        {alertMessage}
                    </Alert>
                </Box>

            )}


            {/* add new city container */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <form onSubmit={addCitySubmit}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField label="Add City" color='success' variant="outlined"  required value={searchCityValue} onChange={e => setSearchCityValue(e.target.value)} />
                        <Button type='submit' size='medium' variant='outlined' color='success'>Add</Button>
                    </Box>
                </form>
            </Box>

            <DisplayWeatherCards  weatherDataState={weatherDataState} updateTime={updateTime} tempUnit={tempUnit} isLoading={isLoading} changeUnits={changeUnits} deleteCity={deleteCity} />

        </Box>
    );
}

export default User;