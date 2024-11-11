import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container } from '@mui/material';
import "../Calculator/CalculatorComponent.css";

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('john@gmail.com');
  const [password, setPassword] = useState<string>('john0000');
  const [error, setError] = useState<string>('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim() === '' || password.trim() === '') {
      setError('Both fields are required');
      return;
    }

    setError('');

    sessionStorage.setItem('username', username);
    sessionStorage.setItem('password', password);
    onLogin();
  };

  const buttonStyle = {
    backgroundColor: '#B2B2B2', 
    '&:hover': {
      backgroundColor: '#A1A1A1', 
    },
    mt: 2
  };
  
  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        mt={8}
        mb={2}
        p={3}
        boxShadow={3}
        borderRadius={2}
      >
      <Typography variant="h5" sx={{ color: '#333333' }}>
      Calculator
      </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            fullWidth
            type="text-login"
            label="Username"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={buttonStyle}
          >
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
