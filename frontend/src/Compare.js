import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import Button from "@mui/material/Button";
import {useContext, useEffect, useState} from "react";
import VideoContext from "./VideoContext";
import axios from "axios";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import * as React from 'react';
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";

const Compare = () => {
    const {videoUUID} = useContext(VideoContext);
     const auth = JSON.parse(sessionStorage.getItem('auth'));
    const [videos, setVideos] = useState([])
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);


    const ageRanges = {
        'u35': 'Under 35 years old',
        '35to60': '35-60 years old',
        'u60': '60 years old and above',
    };
    const gender = {
        'female': "Female",
        'male' : "Male"
    }

    const handleClose = () => {
    setOpen(false);
  };



    useEffect(() => {
        axios(`http://127.0.0.1:5000/compare?uuid=${videoUUID}&email=${auth?.email|| ''}`,
                {withCredentials: true,
            })
            .then(response =>{
                    setVideos(response.data);
                })
            .catch(error =>{
                console.error('Error:', error);
                if (error.response) {
                    setOpen(true);
                    setError(error.response.data.message || 'An error occurred during fetching data');
                } else if (error.request) {
                    setOpen(true);
                    setError('The request was made but no response was received');
                } else {
                    setOpen(true);
                    setError('Error setting up the request');
                }
    });
        }, [auth?.email, videoUUID]);

    return(
        <>
         <TableContainer component={Paper}>
           <Table sx={{ minWidth: 650 }} aria-label="simple table">
             <TableHead>
               <TableRow>
                   <TableCell align="left" sx={{fontSize:'22px'}}>Title</TableCell>
                 <TableCell align="left" sx={{fontSize:'22px'}}>Upload Time</TableCell>
                 <TableCell align="left" sx={{fontSize:'22px'}}>Personal Information</TableCell>
                 <TableCell align="left" sx={{fontSize:'22px'}}>Total Duration</TableCell>
               </TableRow>
             </TableHead>
             <TableBody>
                {videos.map((video, index) => (
                    <TableRow
                     key={video.id}
                     sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell align="left">{video.title}</TableCell>
                        <TableCell align="left">{video.upload_time}</TableCell>
                        <TableCell align="left">
                            <Typography> Gender: {gender[video.gender] || "Unknown gender"}</Typography>
                            <Typography>Age: {ageRanges[video.age] || 'Unknown age range'}</Typography>
                        </TableCell>
                        <TableCell align="left">{video.time_h} mins {video.time_m} s</TableCell>
                        <TableCell align="left">
                            <Button variant="contained"  onClick={() => navigate(`/compare_with?uuid=${videoUUID}&email=${auth?.email || ''}&compare=${video.id}`)}>Compare</Button>
                        </TableCell>
                    </TableRow>
                ))}
             </TableBody>
           </Table>
         </TableContainer>
              <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-description" sx={{'& .MuiDialog-paper': {
                  minWidth: '400px',
                      maxWidth: '600px',
                      minHeight: '200px',
                      maxHeight: '80vh',
                  },
              }}>
                              <DialogContent>
                                  <DialogContentText id="alert-dialog-description" sx={{fontSize:'25px', textAlign:'center', marginTop:'50px'}}>
                                      {error},<br/>Try to
                                      <Button href={'/login'} sx={{fontSize:'22px'}}>Login</Button> or
                                      <Button href={'/register'} sx={{fontSize:'22px'}}>Register</Button>
                                  </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={handleClose} autoFocus>Close</Button>
                              </DialogActions>
                          </Dialog>
        </>
    );
}
export default Compare;