import { Typography, Button, Grid, Stack, Box, Card, CardMedia, CardContent, CardActions, IconButton } from '@mui/material';
// import LoadingButton from '@mui/lab/LoadingButton';

// icons
import DeleteIcon from '@mui/icons-material/Delete';
import LoopIcon from '@mui/icons-material/Loop';

// images
import FeelsLikeImg from './images/feels-like-128x128.png';
import HumidityImg from './images/humidity-128x128.png';
import MaxTempImg from './images/max-temp-128x128.png';
import MinTempImg from './images/min-temp-128x128.png';

let metricUnit = ' °C';
let imperialUnit = ' °F';

const DisplayWeatherCards = ({ weatherDataState, updateTime, tempUnit, changeUnits, deleteCity, isLoading }) => {
    return (
        <Box mx={3} mb={3}>

            {/* loading message */}
            {isLoading && (

                <Box mt={8} sx={{ display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', color: 'black' }}>
                    <LoopIcon className='rotate-center' sx={{ fontSize: { xs: 50, md: 80 } }} />
                    {/* smaller screens */}
                    <Typography variant='h4' sx={{ display: { xs:'flex', md: 'none' } }}>Loading ...</Typography>
                    {/* larger screens */}
                    <Typography variant='h3' sx={{ display: { xs:'none', md: 'flex' } }}>Loading ...</Typography>
                </Box>
            )}


            {!isLoading && (
                <Box>
                    {/* temperature unit change button */}
                    <Box m={1} sx={{ display: 'flex', justifyContent: 'end' }}>
                        {tempUnit && (
                            <Button variant='contained' size='large' color='grey' onClick={changeUnits}>Switch to:   {tempUnit == metricUnit ? imperialUnit : metricUnit}</Button>
                        )}
                    </Box>

                    {/* update time container */}
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {updateTime &&
                            <Typography variant='h4' mb={2}>Updated At: {updateTime}</Typography>
                        }
                    </Box>

                    <Grid container spacing={3}>

                        {weatherDataState && weatherDataState.map((data, index) => (
                            <Grid item xs={12} sm={6} md={4} xl={3} key={index}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        height="90"
                                        image={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`}
                                        sx={{ objectFit: "contain", backgroundColor: "text.disabled" }}
                                    />

                                    <CardContent sx={{ backgroundColor: "text.disabled", color: "white" }}>
                                        <Stack direction="row" justifyContent="space-around" alignItems="center">

                                            <Box>
                                                <Typography variant="h4" color="black">{data.name}</Typography>
                                                <Typography variant="h6" gutterBottom>{data.sys.country}</Typography>
                                                <Typography variant="h5" gutterBottom>{data.main.temp}{tempUnit}</Typography>
                                                <Typography variant="h6">{data.weather[0].description}</Typography>
                                            </Box>

                                            <Stack gap={2}>
                                                <Stack direction='row' alignItems='center' gap={1}>
                                                    <img src={FeelsLikeImg} alt="Feels Like image" className='extra-info-image' />
                                                    <Typography variant="body2">Feels Like: {data.main.feels_like}{tempUnit}</Typography>
                                                </Stack>
                                                <Stack direction='row' alignItems='center' gap={1}>
                                                    <img src={HumidityImg} alt="Humidity image" className='extra-info-image' />
                                                    <Typography variant="body2">Humidity: {data.main.humidity}{tempUnit}</Typography>
                                                </Stack>
                                                <Stack direction='row' alignItems='center' gap={1}>
                                                    <img src={MaxTempImg} alt="Max temp image" className='extra-info-image' />
                                                    <Typography variant="body2">Max Temp: {data.main.temp_max}{tempUnit}</Typography>
                                                </Stack>
                                                <Stack direction='row' alignItems='center' gap={1}>
                                                    <img src={MinTempImg} alt="Min temp image" className='extra-info-image' />
                                                    <Typography variant="body2">Min Temp: {data.main.temp_min}{tempUnit}</Typography>
                                                </Stack>
                                            </Stack>

                                        </Stack>
                                    </CardContent>

                                    {deleteCity && (
                                        <CardActions sx={{ display: 'flex', justifyContent: 'end' }}>
                                            <IconButton
                                                onClick={() => deleteCity(data.name)}
                                                size="medium"
                                                color='error'
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </CardActions>
                                    )}

                                </Card>
                            </Grid>
                        ))}

                    </Grid>
                </Box>
            )}

        </Box>
    );
}

export default DisplayWeatherCards;