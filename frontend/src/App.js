import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Box } from '@mui/material';

// components
import Guest from './Guest';
import SignUp from './SignUp';
import User from './User';
import Login from './Login';



function App() {



  return (
    <Box className="App">



      <BrowserRouter>

        <Box>
          <Routes>

            <Route path='/' element={<Guest />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} exact/>
            <Route path='/:userId/:userName' element={<User />} />

          </Routes>
        </Box>

      </BrowserRouter>


    </Box >
  );
}

export default App;
