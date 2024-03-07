import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Profile = () => {
  const [videos, setVideos] = useState([]);
  const auth = JSON.parse(sessionStorage.getItem('auth'));

  useEffect(() => {
    axios(`http://127.0.0.1:5000/profile?email=${auth?.email|| ''}`,
                {withCredentials: true,
            })
            .then(response =>{
                    setVideos(response.data);
                })
      .catch(error => console.error("There was an error retrieving the video list: ", error));
  }, []);

  const deleteVideo = videoId => {
  if (window.confirm("Are you sure you want to delete this video?")) {
    axios.post(`/profile/delete`, {
        videoId: videoId,
      email: auth?.email  })
      .then(response => {
        alert(response.data.message);
        setVideos(videos.filter(video => video.id !== videoId));
      })
      .catch(error => console.error("There was an error deleting the video: ", error));
  }
};

   const ageRanges = {
        'u35': 'Under 35 years old',
        '35to60': '35-60 years old',
        'u60': '60 years old and above',
    };
    const gender = {
        'female': "Female",
        'male' : "Male"
    }

  // 渲染视频列表
  return (
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
                            <Button variant="contained" type="button" onClick={() => deleteVideo(video.id)}>Delete</Button>
                        </TableCell>
                    </TableRow>
                ))}
             </TableBody>
           </Table>
         </TableContainer>
  );
}

export default Profile