import {useNavigate, useRoutes} from 'react-router-dom';
import router from 'src/router';

import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'

import {CssBaseline} from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import {useEffect, useState} from "react";

function App() {
    const content = useRoutes(router);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);
    return (
                <ThemeProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <CssBaseline/>
                        {content}
                    </LocalizationProvider>
                </ThemeProvider>
    );
}

export default App;
