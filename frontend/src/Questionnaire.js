
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import  './questionnaire.css';
import {Card, Form} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';
import VideoContext from "./VideoContext";

const Questionnaire = () => {
    const [alertVisible, setAlertVisible] = useState(true);
    const [fileName, setFileName] = useState("");
    const[file, setFile] = useState(null);
    const [open, setOpen] = useState(false);
    const[gender, setGender] = useState('');
    const[age, setAge] = useState('');
    const {videoUUID, setVideoUUID } = useContext(VideoContext);
    const [allowNavigate, setAllowNavigate] = useState(false);
    const auth = JSON.parse(sessionStorage.getItem('auth'));
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
  };
    const handleClose = () => {
        setOpen(false);
  };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
});

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if(fileName){
        handleClickOpen();
        return;
    }
    if (file) {
        setFile(file);
        setFileName(file.name);
    }
  };

  const handleAgeChange = (event) => {
      setAge(event.target.id);
  };

  const handleGenderChange = (event) => {
      setGender(event.target.id);
  };


  const handleSubmit = async (event) => {
      event.preventDefault();
        if (file && age && gender) {
             const formData = new FormData();
             formData.append('gender', gender);
             formData.append('age', age);
             formData.append('file', file);

            try {
                const response = await fetch(`/upload?email=${auth?.email || ''}`, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setVideoUUID(data.video_uuid);
                    setAllowNavigate(true);
                } else {
                    console.error('Upload failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else{
                 alert("Please finish the questionnaire and upload the video")
            }
    };

  useEffect(() => {
    if (videoUUID && allowNavigate) {
        let path = `/voice?uuid=${videoUUID}&email=${auth?.email || ''}`;
        navigate(path);
    }
}, [videoUUID, navigate, allowNavigate]);


  const handleDeleteVideo = async () => {
       setFile(null);
       setFileName("");
    if (videoUUID) {
        try {
            const response = await fetch('/delete_video', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video_uuid: videoUUID }),
            });

            if (response.ok) {
                setVideoUUID(null);
            } else {
                console.error('Failed to delete video');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

  return (
      <>
          <Stack sx={{ width: '100%' }} spacing={5}>
              {alertVisible &&(
              <Alert severity="warning"
                     onClose={() => {setAlertVisible(false)}}>
                  We are not able to collect your private information, these questions just help us to better analyse the results.</Alert>
                  )}

          </Stack>
          <Card>
              <Card.Header>Questionnaire</Card.Header>
              <Card.Body>
                  <blockquote className="blockquote mb-0">
                      <p>
                          {' '}
                          Please complete the following Questionnaire
                      </p>
                      <footer className="blockquote-footer">
                          <p> 1. What is your biological gender?</p>
                          <Form>
                              {['radio'].map((type) => (
                                  <div key={`default-${type}`} className="mb-3">
                                      <Form.Check
                                          type={type}
                                          name={"gender"}
                                          id={"female"}
                                          label={"Female"}
                                          onChange={handleGenderChange}
                                      />
                                      <Form.Check
                                          type={type}
                                          name={"gender"}
                                          label={`Male`}
                                          id={"male"}
                                          onChange={handleGenderChange}
                                      />
                                       <Form.Check
                                          type={type}
                                           name={"gender"}
                                          label={`Perfer not to say`}
                                          id={"pns"}
                                          onChange={handleGenderChange}
                                      />
                                  </div>
                              ))}
                          </Form>
                           <p> 2. What is your age?</p>
                          <Form>
                              {['radio'].map((type) => (
                                  <div key={`default-${type}`} className="mb-3">
                                      <Form.Check
                                          type={type}
                                          name={"age"}
                                          id={"u35"}
                                          label={"Under 35"}
                                          onChange={handleAgeChange}
                                      />
                                      <Form.Check
                                          type={type}
                                          name={"age"}
                                          label={`35 - 60`}
                                          id={"35to60"}
                                          onChange={handleAgeChange}
                                      />
                                       <Form.Check
                                          type={type}
                                          name={"age"}
                                          label={`Up to 60`}
                                          id={"u60"}
                                          onChange={handleAgeChange}
                                      />
                                       <Form.Check
                                          type={type}
                                          name={"age"}
                                          label={`Perfer not to say`}
                                          id={"pnsa"}
                                          onChange={handleAgeChange}
                                      />
                                  </div>
                              ))}
                          </Form>
                          <p>3. Please upload your video <strong>(mp4 Only)</strong> here.
                              <Button component="label">Upload Video
                                  <VisuallyHiddenInput type="file" onChange={handleFileChange} accept="video/mp4"/>
                              </Button >
                          </p>
                              {fileName &&
                                  <div style={{ color: 'grey', fontSize: '15px' }}>
                                      File: {fileName}
                                      {fileName && <Button onClick={handleDeleteVideo}>Clear</Button>}
                                  </div>}
                          <Dialog open={open} onClose={handleClose} aria-describedby="alert-dialog-description">
                              <DialogContent>
                                  <DialogContentText id="alert-dialog-description">
                                       Just can upload one video!
                                  </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                  <Button onClick={handleClose} autoFocus>Close</Button>
                              </DialogActions>
                          </Dialog>
                          <div className={"button"}>
                              <Button variant="outlined" onClick={handleSubmit}> Submit </Button>
                          </div>
                      </footer>
                  </blockquote>
              </Card.Body>
          </Card>
      </>
  );}
export default Questionnaire;