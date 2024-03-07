import {Divider, Grid} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import VideoContext from "./VideoContext";
import {useLocation} from "react-router";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";


const CompareWith = () => {
     const {videoUUID} = useContext(VideoContext);
     const auth = JSON.parse(sessionStorage.getItem('auth'));
     const searchParams = new URLSearchParams(useLocation().search);
     const compare = searchParams.get('compare');
     const [videoData, setVideoData] = useState('');

     const ageRanges = {
        'u35': 'Under 35 years old',
        '35to60': '35-60 years old',
        'u60': 'Above 60 years old',
    };
    const gender = {
        'female': "Female",
        'male' : "Male",
    }

    const [openPitchLeft, setOpenPitchLeft] = useState(false);
    const [openIntensityLeft, setOpenIntensityLeft] = useState(false);
    const [openWordLeft, setOpenWordLeft] = useState(false);
    const [openSpeedLeft, setOpenSpeedLeft] = useState(false);

    const [openPitchRight, setOpenPitchRight] = useState(false);
    const [openIntensityRight, setOpenIntensityRight] = useState(false);
    const [openWordRight, setOpenWordRight] = useState(false);
    const [openSpeedRight, setOpenSpeedRight] = useState(false);



   function CustomDialog({ open, onClose, children, align = 'center' }) {
  if (!open) return null;

  let justifyContent = 'center', alignItems = 'center';

  if (align === 'left') {
    justifyContent = 'flex-start';
    alignItems = 'flex-start';

  } else if (align === 'right') {
    justifyContent = 'flex-end';
    alignItems = 'flex-end';
  }

   const topPosition = align === 'left' ? '30%' : '30%';


  return (
    <Box sx={{
      position: 'fixed',
      top: topPosition,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: justifyContent,
      alignItems: alignItems,
      transform: 'translateY(-50%)',
      zIndex: 1300,
    }}>
      <Box sx={{
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        maxWidth: '45%',
          maxHeight: '60vh',
        overflow: 'auto',
      }}>
        {children}
        <Button onClick={onClose}>Close</Button>
      </Box>
    </Box>
  );
}




     useEffect(() => {
        axios(`http://127.0.0.1:5000/compare_with?uuid=${videoUUID}&email=${auth?.email|| ''}&compare=${compare}`,
                {withCredentials: true,
            })
            .then(response =>{
                    setVideoData(response.data);
                })
            .catch(error => console.error('Error:', error));
        }, []);

   const simpleArray = typeof videoData.simple_video === 'string' ?
    videoData.simple_video.split(" ") :
    Array.isArray(videoData.simple_video) ?
    videoData.simple_video : [];

   const simpleCompareArray = typeof videoData.simple_compare === 'string' ?
    videoData.simple_compare.split(" ") :
    Array.isArray(videoData.simple_compare) ?
    videoData.simple_compare : [];

   const diffArray = typeof videoData.diff_video === 'string' ?
    videoData.diff_video.split(" ") :
    Array.isArray(videoData.diff_video) ?
    videoData.diff_video : [];

   const diffCompareArray = typeof videoData.diff_compare === 'string' ?
    videoData.diff_compare.split(" ") :
    Array.isArray(videoData.diff_compare) ?
    videoData.diff_compare : [];



    return(
       <Grid container spacing={2} sx ={{marginTop:'20px', px: 2}}>
         <Grid item xs={6} style={{ display: 'flex' }}>
           <div style={{ flexGrow: 1, padding: 20, border: '3px solid black'}}>
               <div>
                   <Typography variant={'h4'} sx ={{margin: 'auto', textAlign:'center',  color: '#b9ae9e'}}>{videoData.video_title}</Typography>
                   <Divider style={{ margin: '10px 10px' }} />
                   <Typography sx={{fontSize: '15px',  display: 'inline'}}>
                       Upload time:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey", display: 'inline'}}>
                       &nbsp;{videoData.upload_time_video}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Gender:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{gender[videoData.gender_video] || 'Unknown'}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Age:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{ageRanges[videoData.age_video] || 'Unknown'}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Duration:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{videoData.time_h_video} mins {videoData.time_m_video} s
                   </Typography>
                   <Accordion defaultExpanded>
                       <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                           <Typography sx ={{fontSize:'25px', color:'#373733'}}>Voice (Score: {videoData.score_video})</Typography>
                       </AccordionSummary>
                       <AccordionDetails>
                           <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: '#373733'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Pitch:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Pitch: {videoData.avg_p_video} Hz</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenPitchLeft(true)}>See Pitch plot</Button>
                              </Box>
                              <CustomDialog open={openPitchLeft} onClose={() => setOpenPitchLeft(false)} align="left">
                                  <p>Pitch Plot</p>
                                  {videoData.p_video_plot && <img src={`data:image/png;base64,${videoData.p_video_plot}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>

                          <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: 'gray' }} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Intensity:
                               </Typography>
                           </Box>

                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Intensity: {videoData.avg_i_video} dB</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenIntensityLeft(true)}>See Intensity plot</Button>
                              </Box>
                              <CustomDialog open={openIntensityLeft} onClose={() => setOpenIntensityLeft(false)} align="left">
                                  <p>Intensity Plot</p>
                                  {videoData.i_video_plot && <img src={`data:image/png;base64,${videoData.i_video_plot}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                       </AccordionDetails>
                   </Accordion>

                   <Accordion defaultExpanded>
                       <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                           <Typography sx ={{fontSize:'25px', color:'#373733'}}>Text</Typography>
                       </AccordionSummary>
                       <AccordionDetails>
                           <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: '#373733'}} />
                            <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Count:
                               </Typography>
                           </Box>
                           <Box sx={{textAlign:'center', marginBottom: 2}}>
                               <Typography sx={{ fontSize: '20px', display: 'inline' }}>Counts: {videoData.total_length_video}</Typography>&nbsp;&nbsp;
                               <Typography sx={{ fontSize: '18px', display: 'inline' }}>Words</Typography>
                           </Box>
                           <Box sx={{textAlign:'center'}}>
                               <Typography sx={{ fontSize: '20px', display: 'inline' }}>Sentence Length: {videoData.count_video}</Typography>
                               &nbsp;&nbsp;
                               <Typography sx={{ fontSize: '18px', display: 'inline' }}>Words/Sentence</Typography>
                           </Box>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Transcript:
                               </Typography>
                           </Box>
                           <Typography component="div" sx={{fontSize:'18px'}}>{videoData.transcript_video}</Typography>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Word Usage:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                               <Box sx={{textAlign:'center', marginBottom: 2}}>
                                   <Typography sx={{ fontSize: '20px', display: 'inline' }}>Proportion of Frequent words: {videoData.simple_p_video}</Typography>&nbsp;&nbsp;
                                   <Typography sx={{ fontSize: '18px', display: 'inline' }}>%</Typography>
                               </Box>
                               <Box sx={{textAlign:'center'}}>
                                   <Typography sx={{ fontSize: '20px', display: 'inline' }}>Proportion of Rare words: {videoData.diff_p_video}</Typography>
                                   &nbsp;&nbsp;
                                   <Typography sx={{ fontSize: '18px', display: 'inline' }}>%</Typography>
                               </Box>

                               <Box sx={{ position: 'absolute', right: 0, top: '80px'}}>
                                   <Button sx = {{fontSize:'16px'}} onClick={() => setOpenWordLeft(true)}>See All Words</Button>
                               </Box>
                                <CustomDialog open={openWordLeft} onClose={() => setOpenWordLeft(false)} align="left">
                                   <p style={{fontSize: '22px'}}><strong>Frequent Word:</strong></p>
                                      <div className="word-grid">
                                          {simpleArray.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                                      <p style={{fontSize: '22px'}}><strong>Rare Word:</strong></p>
                                      <div className="word-grid">
                                          {diffArray.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                              </CustomDialog>
                           </Box>
                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Speed:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Speed: {videoData.avg_speed_video} words/mins</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenSpeedLeft(true)}>See Speed plot</Button>
                              </Box>
                              <CustomDialog open={openSpeedLeft} onClose={() => setOpenSpeedLeft(false)} align="left">
                                  <p>Speed Plot</p>
                                  {videoData.speed_plot_video && <img src={`data:image/png;base64,${videoData.speed_plot_video}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>
                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                       </AccordionDetails>
                   </Accordion>
               </div>
           </div>
         </Grid>

           <Grid item xs={6} style={{ display: 'flex' }}>
                <div style={{ flexGrow: 1, padding: 20, border: '3px solid black'}}>
               <div>
                   <Typography variant={'h4'} sx ={{margin: 'auto', textAlign:'center',  color: '#b9ae9e'}}>{videoData.compare_title}</Typography>
                   <Divider style={{ margin: '10px 10px' }} />
                   <Typography sx={{fontSize: '15px',  display: 'inline'}}>
                       Upload time:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey", display: 'inline'}}>
                       &nbsp;{videoData.upload_time_compare}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Gender:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{gender[videoData.gender_compare] || 'Unknown'}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Age:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{ageRanges[videoData.age_compare] || 'Unknown'}&nbsp;&nbsp;
                   </Typography>

                   <Typography sx={{fontSize: '15px', display: 'inline'}}>
                       Duration:
                   </Typography>
                   <Typography sx={{fontSize: '14px', color: "grey",display: 'inline'}}>
                       &nbsp;{videoData.time_h_compare} mins {videoData.time_m_compare} s
                   </Typography>
                   <Accordion defaultExpanded>
                       <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                           <Typography sx ={{fontSize:'25px', color:'#373733'}}>Voice (Score: {videoData.score_compare})</Typography>
                       </AccordionSummary>
                       <AccordionDetails>
                           <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: '#373733'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Pitch:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Pitch: {videoData.avg_p_compare} Hz</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenPitchRight(true)}>See Pitch plot</Button>
                              </Box>
                              <CustomDialog open={openPitchRight} onClose={() => setOpenPitchRight(false)} align="right">
                                  <p>Pitch Plot</p>
                                  {videoData.p_compare_plot && <img src={`data:image/png;base64,${videoData.p_compare_plot}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>

                          <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: 'gray' }} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Intensity:
                               </Typography>
                           </Box>

                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Intensity: {videoData.avg_i_compare} dB</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenIntensityRight(true)}>See Intensity plot</Button>
                              </Box>
                              <CustomDialog open={openIntensityRight} onClose={() => setOpenIntensityRight(false)} align="right">
                                  <p>Intensity</p>
                                  {videoData.i_compare_plot && <img src={`data:image/png;base64,${videoData.i_compare_plot}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                       </AccordionDetails>
                   </Accordion>

                   <Accordion defaultExpanded>
                       <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                           <Typography sx ={{fontSize:'25px', color:'#373733'}}>Text</Typography>
                       </AccordionSummary>
                       <AccordionDetails>
                           <Divider style={{ margin: '40px 10px', height: 1, backgroundColor: '#373733'}} />
                            <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Count:
                               </Typography>
                           </Box>
                           <Box sx={{textAlign:'center', marginBottom: 2}}>
                               <Typography sx={{ fontSize: '20px', display: 'inline' }}>Counts: {videoData.total_length_compare}</Typography>&nbsp;&nbsp;
                               <Typography sx={{ fontSize: '18px', display: 'inline' }}>Words</Typography>
                           </Box>
                           <Box sx={{textAlign:'center'}}>
                               <Typography sx={{ fontSize: '20px', display: 'inline' }}>Sentence Length: {videoData.count_compare}</Typography>
                               &nbsp;&nbsp;
                               <Typography sx={{ fontSize: '18px', display: 'inline' }}>Words/Sentence</Typography>
                           </Box>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Transcript:
                               </Typography>
                           </Box>
                           <Typography component="div" sx={{fontSize:'18px'}}>{videoData.transcript_compare}</Typography>

                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Word Usage:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                               <Box sx={{textAlign:'center', marginBottom: 2}}>
                                   <Typography sx={{ fontSize: '20px', display: 'inline' }}>Proportion of Frequent words: {videoData.simple_p_compare}</Typography>&nbsp;&nbsp;
                                   <Typography sx={{ fontSize: '18px', display: 'inline' }}>%</Typography>
                               </Box>
                               <Box sx={{textAlign:'center'}}>
                                   <Typography sx={{ fontSize: '20px', display: 'inline' }}>Proportion of Rare words: {videoData.diff_p_compare}</Typography>
                                   &nbsp;&nbsp;
                                   <Typography sx={{ fontSize: '18px', display: 'inline' }}>%</Typography>
                               </Box>

                               <Box sx={{ position: 'absolute', right: 0, top: '80px'}}>
                                   <Button sx = {{fontSize:'16px'}} onClick={() => setOpenWordRight(true)}>See All Words</Button>
                               </Box>
                                <CustomDialog open={openWordRight} onClose={() => setOpenWordRight(false)} align="right">
                                   <p style={{fontSize: '22px'}}><strong>Frequent Word:</strong></p>
                                      <div className="word-grid">
                                          {simpleCompareArray.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                                      <p style={{fontSize: '22px'}}><strong>Rare Word:</strong></p>
                                      <div className="word-grid">
                                          {diffCompareArray.map((word, index) => (
                                              <div className="word-item" key={index}>
                                                  {word}
                                              </div>
                                          ))}
                                      </div>
                              </CustomDialog>
                           </Box>
                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                           <Box sx={{ position: 'relative', textAlign: 'left', marginTop: '-30px' }}>
                               <Typography component="p" sx={{ fontSize: '24px', fontWeight: 'bold', color: '#b9ae9e'}}>
                                   Speed:
                               </Typography>
                           </Box>
                           <Box sx={{ textAlign: 'center', color: '#373733', position: 'relative', fontSize: '20px' }}>
                              <Typography component="div" sx={{fontSize:'20px'}}>Average Speed: {videoData.avg_speed_compare} words/mins</Typography>
                              <Box sx={{ position: 'absolute', right: 0, top: '30px'}}>
                                  <Button sx = {{fontSize:'16px'}} onClick={() => setOpenSpeedRight(true)}>See Speed plot</Button>
                              </Box>
                              <CustomDialog open={openSpeedRight} onClose={() => setOpenSpeedRight(false)} align="right">
                                  <p>Speed Plot</p>
                                  {videoData.speed_plot_compare && <img src={`data:image/png;base64,${videoData.speed_plot_compare}`} alt="Generated Plot" style={{ maxWidth: '100%', height: 'auto' }}/>}
                              </CustomDialog>
                           </Box>
                           <Divider style={{ margin: '40px 10px' , height: 1, backgroundColor:'gray'}} />
                       </AccordionDetails>
                   </Accordion>
               </div>
           </div>
         </Grid>
       </Grid>

);

}
export default CompareWith;