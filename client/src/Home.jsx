import React from 'react'
import { Link } from 'react-router-dom'
import { Grid, Typography, Button,Box } from '@mui/material';
import backgroundImg from './media/stock.jpg'

export default function Home() {
    return (
        <Grid container
            alignItems="center"
            justifyContent="center"
            sx={{
                height: '100vh',
                backgroundImage: `url(${backgroundImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundColor: 'rgba(255, 255, 255, 0.7)', // adjust the opacity by changing the alpha value
            }}
        >
            <Grid item lg={12} sx={{ background: "rgba(0,0,0,0.5)", width: "100vw", height: "100vh", display:"flex", alignItems:"center",justifyContent:"center" }}>
                <Box >
                    <Typography  variant="h2" sx={{ color: 'white',mb:"25px" }}>
                        Make Prediction Of Your Favourite Stock
                    </Typography>
                   
                    <Link to="/prediction">
                        <Button sx={{boxShadow:"2px 2px 4px #ddd"}} color='primary' variant='contained'> Make Predeiction</Button>
                    </Link>
                </Box>


            </Grid>
        </Grid>
    )
}




