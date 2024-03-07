import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {TextField} from "@mui/material";
import Button from "@mui/material/Button";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const[email, setEmail] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();

    const handleName = (event) => {
        setUsername(event.target.value);
    }
    const handleMail = (event) => {
        setEmail(event.target.value);
    }
   const handlePassword1 = (event) => {
        const newPassword1 = event.target.value;
        setPassword1(newPassword1);
        setPasswordsMatch(newPassword1 === password2);
};
    const handlePassword2 = (event) => {
        const newPassword2 = event.target.value;
        setPassword2(newPassword2);
        setPasswordsMatch(newPassword2 === password1);
};

    const handleSubmit = async (e) => {
    e.preventDefault();
    if(!passwordsMatch){
        return;
    }
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password1, email }),
      });
      const data = await response.json();
      if (response.status === 200) {
          alert("You can log in now, Please go to Login page");
          navigate('/login');
      }
    else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Register Failed:", error);
      // 处理错误情况，比如显示错误信息
    }
  };

    return (
        <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={handleName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-mail"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={handleMail}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password1"
            label="Password"
            type="password"
            id="password1"
            autoComplete="current-password"
            value={password1}
            onChange={handlePassword1}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords do not match" : ""}
          />
             <TextField
            margin="normal"
            required
            fullWidth
            name="password2"
            label="Confirm Password"
            type="password"
            id="password2"
            autoComplete="current-password"
            value={password2}
            onChange={handlePassword2}
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords do not match" : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
    );
}
export default Register;