
import { InputAdornment, Stack, TextField, Typography, Box, Button, Alert, AlertTitle } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import Navbar from "./Navbar";

// importing icons
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


const Login = () => {

    let navigate = useNavigate();

    let [passwordVisibile, setPasswordVisibility] = useState(false);
    function handleVisiblity() {
        setPasswordVisibility(!passwordVisibile);
    }

    // form controlled inputs
    let [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    let [isError, setIsError] = useState(null);

    function submitLoginForm(event) {
        event.preventDefault();

        axios.post('http://localhost:4000/login', formData)
            .then((response) => {
                navigate(`/${response.data._id}/${response.data.name}`);
            })
            .catch((error) => {
                setIsError(error.response.data.error);
            });

    }

    return (

        <Box>

            <Navbar isUser={false} ></Navbar>

            <Typography textAlign='center' variant="h4" my={4}>Login</Typography>

            {isError && (
                <Box mb={4}>
                    <Alert severity="error">
                        {isError}
                    </Alert>
                </Box>

            )}

            <form onSubmit={submitLoginForm}>
                <Stack spacing={3} alignItems="center">

                    {/* email */}
                    <TextField type="email" label="Email" variant="outlined" sx={{ width: 280 }} required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                    {/* password */}
                    <TextField type={passwordVisibile ? "text" : "password"} label="Password" required InputProps={{
                        endAdornment:
                            <InputAdornment position="end" onClick={handleVisiblity} sx={{ cursor: "pointer" }}>
                                {passwordVisibile ? <VisibilityIcon /> : <VisibilityOffIcon />}
                            </InputAdornment>
                    }} sx={{ width: 280 }} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />

                    <Button type="submit" variant="contained" size="large">Submit</Button>

                </Stack>

            </form>

        </Box>


    );
}

export default Login;