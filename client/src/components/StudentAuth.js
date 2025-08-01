import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUserGraduate, FaArrowLeft, FaUser, FaIdCard } from 'react-icons/fa';
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

const AuthOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const AuthOption = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--border);
  border-radius: 12px;
  background: var(--surface);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  
  &:hover {
    border-color: var(--primary-purple);
    background: rgba(119, 101, 218, 0.05);
  }
`;

const OptionIcon = styled.div`
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const OptionContent = styled.div`
  flex: 1;
`;

const OptionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const OptionDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  text-align: left;
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

const SubmitButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 10px 20px rgba(119, 101, 218, 0.3);
  transition: all 0.3s ease;
  
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

const StudentAuth = () => {
  const [authMethod, setAuthMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    studentId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAuthMethodSelect = (method) => {
    setAuthMethod(method);
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

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (authMethod === 'simple') {
      if (formData.name.trim()) {
        dispatch(setUserType('student'));
        dispatch(setUserName(formData.name.trim()));
        toast.success('Welcome! You can now join the polling session.');
        navigate('/student');
      } else {
        toast.error('Please enter your name.');
      }
    } else if (authMethod === 'advanced') {
      if (formData.name.trim() && formData.studentId.trim()) {
        dispatch(setUserType('student'));
        dispatch(setUserName(`${formData.name.trim()} (${formData.studentId.trim()})`));
        toast.success('Welcome! You can now join the polling session.');
        navigate('/student');
      } else {
        toast.error('Please fill in all fields.');
      }
    }
    
    setIsLoading(false);
  };

  const handleBack = () => {
    if (authMethod) {
      setAuthMethod(null);
      setFormData({ name: '', studentId: '' });
    } else {
      navigate('/');
    }
  };

  const handleQuickJoin = () => {
    const randomNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Morgan', 'Riley', 'Quinn'];
    const randomName = randomNames[Math.floor(Math.random() * randomNames.length)];
    
    dispatch(setUserType('student'));
    dispatch(setUserName(randomName));
    toast.success(`Welcome ${randomName}! You can now join the polling session.`);
    navigate('/student');
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
          <FaUserGraduate />
        </IconContainer>
        
        <Title>Student Authentication</Title>
        <Subtitle>Choose how you'd like to join the polling session</Subtitle>
        
        {!authMethod ? (
          <>
            <AuthOptions>
              <AuthOption
                onClick={() => handleAuthMethodSelect('simple')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionIcon>
                  <FaUser />
                </OptionIcon>
                <OptionContent>
                  <OptionTitle>Simple Join</OptionTitle>
                  <OptionDescription>Just enter your name to join quickly</OptionDescription>
                </OptionContent>
              </AuthOption>
              
              <AuthOption
                onClick={() => handleAuthMethodSelect('advanced')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionIcon>
                  <FaIdCard />
                </OptionIcon>
                <OptionContent>
                  <OptionTitle>Advanced Join</OptionTitle>
                  <OptionDescription>Enter your name and student ID for tracking</OptionDescription>
                </OptionContent>
              </AuthOption>
            </AuthOptions>
            
            <motion.button
              onClick={handleQuickJoin}
              style={{
                background: 'none',
                border: '2px solid var(--primary-purple)',
                color: 'var(--primary-purple)',
                padding: '1rem 2rem',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Quick Join (Random Name)
            </motion.button>
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name..."
                value={formData.name}
                onChange={handleInputChange}
                required
                autoFocus
              />
            </InputGroup>
            
            {authMethod === 'advanced' && (
              <InputGroup>
                <Label htmlFor="studentId">Student ID</Label>
                <Input
                  id="studentId"
                  name="studentId"
                  type="text"
                  placeholder="Enter your student ID..."
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                />
              </InputGroup>
            )}
            
            <SubmitButton
              type="submit"
              disabled={!formData.name.trim() || (authMethod === 'advanced' && !formData.studentId.trim()) || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Joining...' : 'Join Session'}
            </SubmitButton>
          </Form>
        )}
      </Card>
    </Container>
  );
};

export default StudentAuth; 