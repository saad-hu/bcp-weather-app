let express = require('express');
let http = require('http');
let cors = require('cors');
let axios = require('axios');
let moment = require('moment');
let mongoose = require('mongoose');
let { Server } = require("socket.io");
let UserModel = require('./models/userModel');
let postController = require('./controllers/postController');
require('dotenv').config();


const INTERVAL_TIME = 10000;
const guestCities = ['karachi', 'islamabad', 'lahore', 'quetta', 'peshawar'];

let app = express();
app.use(cors());
app.use(express.json());

let server = http.createServer(app);


mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        server.listen(4000, () => console.log("Server started at port 4000"))
    })
    .catch(err => console.log('can not connect to db: ', err));


let io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
})



// socket connection starts here
io.on('connection', socket => {

    socket.on('disconnect', () => {
        // console.log('disconnected: ', socket.id);
    })

    // event and logic for guest users
    socket.on('join_guest_room', async (data) => {

        // if data in metric is required, join the metric room
        if (data.units === 'metric') {
            socket.join("guest_room_metric");

            guestMetricInterval('stop');
            await getAndEmitGuestMetricData();
            guestMetricInterval('start');
        }
        // if units are imperial, join the imperial guest room
        else if (data.units === 'imperial') {
            socket.join("guest_room_imperial");

            guestImperialInterval('stop');
            await getAndEmitGuestImperialData();
            guestImperialInterval('start');
        }
    })


    socket.on('join_user', (data) => {
        getUserAndEmitWeatherData(socket.id, data.userId, data.units);
    })

    // on receiving delete event from user
    socket.on('add_new_city', async (data) => {
        let newCity = data.city.toLowerCase();

        let isInvalid = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${process.env.API_KEY}&units=${data.units}`)
            .then(response => false)
            .catch(err => {
                socket.emit('custom_error', { errMessage: 'City not found' })
                return true;
            });


        if (isInvalid === false) {
            // getting the current user data from database
            let UserCurDBData = await UserModel.findById(data.userId);

            // if the new city already exists in user's cities, the code below this if condition will not be executed as we are returning in the end
            if (UserCurDBData.userCities.includes(newCity)) {
                socket.emit('custom_error', { errMessage: 'City already exists in your collection' })
                return;
            }

            // all the validation checks are done now.  
            // updating cities array locally
            UserCurDBData.userCities.push(newCity);
            // pushing the new cities array to the database
            await UserModel.findByIdAndUpdate(data.userId, { userCities: UserCurDBData.userCities })

            getUserAndEmitWeatherData(socket.id, data.userId, data.units);
        }
    })


    // on receiving delete city event from user
    socket.on('delete_city', async (data) => {
        let cityToDelete = data.city.toLowerCase();
        let user = await UserModel.findById(data.userId);
        let citiesArrayCopy = user.userCities;
        citiesArrayCopy.splice(user.userCities.findIndex(curCity => curCity == cityToDelete), 1);
        await UserModel.findByIdAndUpdate(data.userId, { userCities: citiesArrayCopy });
    
        getUserAndEmitWeatherData(socket.id, data.userId, data.units);
    })
})



// utility functions
// getDataOfCities(arr) takes an array of cities name, and returns an array of all the cities weather data
async function getDataOfCities(arr, units) {

    let citiesPromiseArray = arr.map(city => {
        return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=${units}`)
    })


    // responseArray is the array of axios.get() weather api call
    let responseArray = await Promise.all(citiesPromiseArray);
    let citiesDataArray = responseArray.map(cityData => {
        return cityData.data;
    })

    return citiesDataArray.reverse();
}


// function that gets and emits data to a specific user using socket id
async function getUserAndEmitWeatherData(socketId, userId, units) {

    // checking if the userId has a valid pattern
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        io.to(socketId).emit('custom_error', { errMessage: 'no such user' });
        return;
    }

    let userDbData = await UserModel.findById(userId);
    if(!userDbData) {
        io.to(socketId).emit('custom_error', { errMessage: 'no such user' });
        return;
    }
    let userWeatherData = await getDataOfCities(userDbData.userCities, units);
    io.to(socketId).emit('weather_update', { updateTime: moment().format('MMMM Do YYYY, h:mm:ss a'), weatherData: userWeatherData, units: units });
}

// this function gets and emits data to the guest metric room
async function getAndEmitGuestMetricData() {
    let guestCitiesData = await getDataOfCities(guestCities, 'metric');
    // all sockets that are in the guest_room_metric get the updated weather data
    io.to("guest_room_metric").emit('weather_update', { updateTime: moment().format('MMMM Do YYYY, h:mm:ss a'), weatherData: guestCitiesData, units: "metric" });
}

// interval function for guest metric room
let guestMetricIntervalId = null;
function guestMetricInterval(action) {
    if (action === 'start') {
        guestMetricIntervalId = setInterval(getAndEmitGuestMetricData, INTERVAL_TIME);
    }
    else if (action === 'stop' && guestMetricIntervalId !== null) {
        clearInterval(guestMetricIntervalId);
    }
}

// this function gets and emits data to the guest imperial room
async function getAndEmitGuestImperialData() {
    let guestCitiesData = await getDataOfCities(guestCities, 'imperial');
    // all sockets that are in the guest_room_imperial get the updated weather data
    io.to("guest_room_imperial").emit('weather_update', { updateTime: moment().format('MMMM Do YYYY, h:mm:ss a'), weatherData: guestCitiesData, units: 'imperial' });
}

// interval function for guest imperial room
let guestImperialIntervalId = null;
function guestImperialInterval(action) {
    if (action === 'start') {
        guestImperialIntervalId = setInterval(getAndEmitGuestImperialData, INTERVAL_TIME);
    }
    else if (action === 'stop' && guestImperialIntervalId !== null) {
        clearInterval(guestImperialIntervalId);
    }
}


// http express requests
// this post request creates a user in mongodb if the user does not already exists
app.post('/signup', postController.signUp);

// login page post request
app.post('/login', postController.login);