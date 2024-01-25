import {TopBar} from "./App";
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import  './questionnaire.css';
import {Card, Form} from "react-bootstrap";
import {useState} from "react";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useNavigate } from 'react-router-dom';

const Questionnaire = () => {
    const [alertVisible, setAlertVisible] = useState(true);
    const [fileName, setFileName] = useState("");
    const[file, setFile] = useState(null);
    const[clear, setClear] = useState("");
    const [open, setOpen] = useState(false);
    const[gender, setGender] = useState('');
    const[age, setAge] = useState('');
    const [isVideoUploaded, setIsVideoUploaded] = useState(false);
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
        setClear(file.name);
    }
  };

  const handleAgeChange = (event) => {
      setAge(event.target.id);
  };

  const handleGenderChange = (event) => {
      setGender(event.target.id);
  };


  const handleClear = (event) => {
      setClear(null);
      setFileName("");

  };

  const handleSubmit = async (event) => {
      event.preventDefault();
        if (file && age && gender) {
             const formData = new FormData();
             formData.append('gender', gender);
             formData.append('age', age);
             formData.append('file', file);

            try {
                const response = await fetch('/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    const videoUUID = data.video_uuid;
                    setIsVideoUploaded(true);
                    if(videoUUID){
                        let path = `/voice?uuid=${videoUUID}`;
                        navigate(path);
                    }
                    else{
                        console.error('UUID is missing in the response');
                    }

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

  return (
      <>
          <TopBar isVideoUploaded={isVideoUploaded}/>
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
                              {fileName && <div style={{ color: 'grey', fontSize: '15px' }}>
                                  File: {fileName}
                                  {fileName && <Button onClick={handleClear}>Clear</Button>}
                              </div>}
                          </p>
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