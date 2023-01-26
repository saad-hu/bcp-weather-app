import { AppBar, Toolbar, IconButton, Typography, Stack, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const Navbar = ({ isUser, userName }) => {
    return (
        <AppBar position="static" color='grey' sx={{ marginBottom: 4 }}>
            <Toolbar sx={{ paddingBlock: 1 }}>

                {/* header for larger screens */}
                <Typography variant='h2' component="div" color="success.dark" sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>Weather App</Typography>
                {/* header for smaller screens */}
                <Typography variant='h6' component="div" color="success.dark" sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>Weather App</Typography>


                {isUser && (

                    <Box>
                        {/* menu for smaller screens */}
                        <Stack direction="row" alignItems='center' spacing={4} sx={{ display: { xs: 'flex', md: 'none' } }}>

                            <Typography variant="body1" color='success.main'>{userName}</Typography>

                            <RouterLink to='/' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="small">Logout</Button>
                            </RouterLink>

                        </Stack>

                        {/* menu for larger screens */}
                        <Stack direction="row" alignItems='center' spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>

                            <Typography variant="h5" color='success.main'>{userName}</Typography>


                            <RouterLink to='/' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="large">Logout</Button>
                            </RouterLink>

                        </Stack>
                    </Box>


                )}

                {!isUser && (

                    <Box>
                        {/*  smaller screens */}
                        <Stack direction="row" spacing={2} sx={{ display: { xs: 'flex', md: 'none' } }}>

                            <RouterLink to='/login' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="small">Login</Button>
                            </RouterLink>

                            <RouterLink to='/signup' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="small">Signup</Button>
                            </RouterLink>
                        </Stack>

                        {/* larger screens */}
                        <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>

                            <RouterLink to='/login' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="large">Login</Button>
                            </RouterLink>

                            <RouterLink to='/signup' style={{ textDecoration: 'none', color: 'black' }}>
                                <Button color='inherit' variant="contained" size="large">Signup</Button>
                            </RouterLink>
                        </Stack>
                    </Box>

                )}
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;