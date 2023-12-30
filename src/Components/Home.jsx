import axios from 'axios'
import { useEffect, useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';

const bull = (
    <Box
      component="span"
      sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
      •
    </Box>
  );

export default function Home() {
    let [latLng, setLatLng] = useState({})
    let [hospitals, setHospitals] = useState([])
    let navigate=useNavigate()
    let createCoords = () => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                let latlng = { lat: position.coords.latitude, lng: position.coords.longitude }
                setLatLng(latlng)
                // console.log(latLng)
            })
        }
    }
    useEffect(() => {
        createCoords()
    }, [])
    useEffect(() => {
        console.log(latLng)
        axios.get(`https://api.geoapify.com/v2/places?categories=healthcare.hospital&filter=circle:${latLng.lng},${latLng.lat},5000&bias=proximity:78.44202,17.3707564&limit=20&apiKey=789ac54c8c2b44d2acbe792d2b7cf785
  `).then((response) => {
            console.log(response.data.features)
            let features = response.data.features
            let tempArr = []
            features.map((feature) => {
                tempArr.push(feature.properties)
            })
            // console.log(tempArr)
            setHospitals(tempArr)
            // console.log('hospitals',hospitals)

        })
    }, [latLng])
    let handleCta = ({name,hospitalLat,hospitalLng,city,state,website})=> {
        navigate('/hospitalDetails',{state:{
            user:{
                lat:latLng.lat,lng:latLng.lng
            },
            hospital:{
                name:name, 
                hospitalLat:hospitalLat,
                hospitalLng:hospitalLng,
                city:city,
                state:state,
                web:website
            }
        }})

    }
    return (
        <div style={{padding:'3rem'}}> 
            
            <div style={{display:'flex',flexWrap:'wrap',justifyContent:'center'}}>
               {
                hospitals.map((hospital,index)=>{
                    return (
                        <Card onClick={()=>{
                            handleCta({

                                name:hospital.name
                                ,hospitalLat:hospital.lat
                                ,hospitalLng:hospital.lon
                                ,city:hospital.city
                                ,state:hospital.state,
                                website:`http://www.${hospital.name}.org`

                            })
                        }} sx={{ width:'25rem',margin:'0.5rem' }} key={index}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                           {hospital.name}
                        </Typography>
                        <hr/>
                        <Typography variant="body2">
                            {hospital.address_line2}
                        </Typography>
                        <Typography variant="body2" sx={{margin:'0.5rem 0'}}>
                          {hospital.city} {hospital.state_district} ,{hospital.street}, {hospital.state}
                        </Typography>
                        <Typography variant="body2" >
                          {hospital.datasource.raw.website}
                        </Typography>
                    </CardContent>
                    
                </Card>
                    )
                })
               }
            </div>
        </div>
    )
}