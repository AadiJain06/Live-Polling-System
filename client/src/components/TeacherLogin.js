import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaChalkboardTeacher, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { setUserType, setUserName } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled(motion.div)`
  background: var(--surface);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
  border: 1px solid var(--border);
`;

const BackButton = styled(motion.button)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  background: var(--surface);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary-purple);
  font-size: 1.2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid var(--border);
  
  &:hover {
    transform: scale(1.1);
    background: var(--background);
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  border-radius: 50%;
  margin: 0 auto 2rem;
  color: white;
  font-size: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--text-secondary);
  margin-bottom: 2rem;
  font-size: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
  position: relative;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--surface);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary-purple);
    box-shadow: 0 0 0 3px rgba(119, 101, 218, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const PasswordInput = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 1.1rem;
  
  &:hover {
    color: var(--primary-purple);
  }
`;

const LoginButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(119, 101, 218, 0.3);
  transition: all 0.3s ease;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(119, 101, 218, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DemoCredentials = styled.div`
  background: var(--background);
  border-radius: 10px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
  border: 1px solid var(--border);
`;

const DemoTitle = styled.h4`
  color: var(--primary-purple);
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const DemoText = styled.p`
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin: 0.25rem 0;
`;

const TeacherLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Demo credentials (in a real app, this would be handled by a backend)
  const demoCredentials = {
    username: 'teacher',
    password: 'password123'
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Debug logging
    console.log('Attempting login with:', formData);
    console.log('Expected credentials:', demoCredentials);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials (in a real app, this would be validated against a backend)
    // Using case-insensitive comparison for username and exact match for password
    if (formData.username.toLowerCase().trim() === demoCredentials.username.toLowerCase() && 
        formData.password === demoCredentials.password) {
      
      console.log('Login successful!');
      dispatch(setUserType('teacher'));
      dispatch(setUserName(formData.username));
      toast.success('Login successful!');
      navigate('/teacher');
    } else {
      console.log('Login failed - credentials mismatch');
      toast.error('Invalid credentials. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    navigate('/');
  };

  const fillDemoCredentials = () => {
    setFormData({
      username: demoCredentials.username,
      password: demoCredentials.password
    });
  };

  return (
    <Container>
      <BackButton
        onClick={handleBack}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowLeft />
      </BackButton>
      
      <Card
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <IconContainer>
          <FaChalkboardTeacher />
        </IconContainer>
        
        <Title>Teacher Login</Title>
        <Subtitle>Enter your credentials to access the teacher dashboard</Subtitle>
        
        <div style={{
          background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <strong>Demo Login:</strong> Use <code>teacher</code> / <code>password123</code>
        </div>
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username..."
              value={formData.username}
              onChange={handleInputChange}
              required
              autoFocus
            />
          </InputGroup>
          
          <InputGroup>
            <Label htmlFor="password">Password</Label>
            <PasswordInput>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password..."
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordToggle>
            </PasswordInput>
          </InputGroup>
          
          <LoginButton
            type="submit"
            disabled={!formData.username || !formData.password || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </LoginButton>
        </Form>

        <DemoCredentials>
          <DemoTitle>Demo Credentials:</DemoTitle>
          <DemoText>Username: <strong>teacher</strong></DemoText>
          <DemoText>Password: <strong>password123</strong></DemoText>
          <motion.button
            onClick={fillDemoCredentials}
            style={{
              background: 'linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              padding: '0.5rem 1rem',
              borderRadius: '5px',
              marginTop: '0.5rem',
              fontWeight: '600'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔑 Fill Demo Credentials
          </motion.button>
        </DemoCredentials>
      </Card>
    </Container>
  );
};

export default TeacherLogin; 