
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
// import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';


export default function HospitalDetails() {


    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    let location = useLocation()
    let { user, hospital } = location.state
    let { lat, lng } = user
    let { city, hospitalLat, hospitalLng, state, name, web } = hospital
    let [userFormattedAddress, setUserFormattedAddress] = useState('')
    let [hospitalFormattedAddress, setHospitalFormattedAddress] = useState('')
    let [instructions, setInstructions] = useState([])
    useEffect(() => {
        axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=789ac54c8c2b44d2acbe792d2b7cf785`).then((response) => {
            // console.log(response.data.results[0].formatted)
            setUserFormattedAddress(response.data.results[0].formatted)
        })
        axios.get(`https://api.geoapify.com/v1/geocode/reverse?lat=${hospitalLat}&lon=${hospitalLng}&format=json&apiKey=789ac54c8c2b44d2acbe792d2b7cf785`).then((response2) => {
            setHospitalFormattedAddress(response2.data.results[0].formatted)
        })

    }, [])
    useEffect(() => {
        axios.get(`https://api.geoapify.com/v1/routing?waypoints=${lat},${lng}|${hospitalLat},${hospitalLng}&mode=drive&lang=en&traffic=approximated&details=instruction_details,route_details,elevation&apiKey=789ac54c8c2b44d2acbe792d2b7cf785`).then((response) => {
            console.log(response.data.features[0].properties.legs[0].steps)
            let steps = response.data.features[0].properties.legs[0].steps
            let tempArr = []
            steps.map((step) => {
                if (step.instruction) {
                    tempArr.push(step.instruction)
                }
            })
            console.log(tempArr)
            let tempInstructions = []
            tempArr.map((value) => {
                tempInstructions.push(value.text + ' ' +  (value.post_transition_instruction ?value.post_transition_instruction:"" ) )
            })
            console.log(tempInstructions)
            setInstructions(tempInstructions)
        })
    }, [hospitalFormattedAddress])
    return (
        <div style={{ padding: '2rem' }}>
            <div >

                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid xs={6}>
                        <Item>
                            <Card sx={{ width: '35rem', margin: '0.5rem', boxShadow: 'none', width: '100%', textAlign: 'left' }} >
                                <CardContent>
                                    <Typography variant="h3" component="div" sx={{color:'#0873bb'}}>
                                        {name}
                                    </Typography>
                                    <hr />
                                    <Typography variant="body2">
                                        <h3>User Latitude : {lat}</h3>
                                        <h3>User Longitude : {lng}</h3>
                                        <h3>User Formatted Address : {userFormattedAddress}</h3>
                                    </Typography>
                                    <hr />
                                    <Typography variant="body2" sx={{ margin: '0.5rem 0' }}>
                                        <h3>Hospital Latitude : {hospitalLat}</h3>
                                        <h3>Hospital Longitude : {hospitalLng}</h3>
                                        <h3>Hospital Formatted Address : {hospitalFormattedAddress} </h3>
                                    </Typography>
                                    <hr />
                                    <Typography variant="body2" sx={{ margin: '0.5rem 0' }}>
                                        <h3>Hospital Website : {web}</h3>
                                        <h3>State : {state}</h3>
                                        <h3>City : {city} </h3>
                                    </Typography>

                                </CardContent>

                            </Card>
                        </Item>
                    </Grid>
                    <Grid xs={6}>
                        <Item style={{padding:'3rem'}}>
                            <h3 style={{textAlign:'left',color:'black',fontSize:'2rem'}}>Directions to hospital :</h3>
                            <Timeline position="alternate">
                                
                                {
                                    instructions.map((instruction) => {
                                        return (
                                            <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot color='primary' />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>{instruction}</TimelineContent>
                                        </TimelineItem>
                                        )
                                    })
                                }
                                
                            </Timeline>
                        </Item>
                    </Grid>

                </Grid>


            </div>

        </div>
    )
}