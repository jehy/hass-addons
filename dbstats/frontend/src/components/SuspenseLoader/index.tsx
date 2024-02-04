import type {FC} from 'react';
import { useEffect} from 'react';
import NProgress from 'nprogress';
import {Box, CircularProgress, IconButton} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export enum LoaderState {
  Off,
  On,
  Success,
}

interface LoaderProps {
    success: boolean,
}
export const SuspenseLoader: FC<LoaderProps> = ({
                                             success=false,
                                               }) => {
  useEffect(() => {
    NProgress.start();

    return () => {
      NProgress.done();
    };
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%'
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
        {success? <IconButton style={{fontSize: 64}}><CheckIcon color='success' fontSize='inherit' /></IconButton> : <CircularProgress size={64} disableShrink thickness={3} /> }
    </Box>
  );
}


export const SuspenseLoaderInline: FC<LoaderProps> = ({
                                             success=false,
                                         }) => {
    useEffect(() => {
        NProgress.start();

        return () => {
            NProgress.done();
        };
    }, []);

    return (
        <>
            {success? <IconButton style={{fontSize: 64}}><CheckIcon color='success' fontSize='inherit' /></IconButton> : <CircularProgress size={64} disableShrink thickness={3} /> }
        </>
    );
}
