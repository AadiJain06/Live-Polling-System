import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaBolt, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';
import { setUserType } from '../store/slices/authSlice';

const Container = styled.div`
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const AppBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 600px;
`;

const RoleSelectionContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RoleCard = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => prop !== 'selected'
})`
  width: 300px;
  padding: 2rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-purple)' : 'var(--border)'};
  border-radius: 12px;
  background: ${props => props.selected ? 'linear-gradient(135deg, rgba(119, 101, 218, 0.1) 0%, rgba(79, 13, 206, 0.1) 100%)' : 'var(--surface)'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-purple);
    transform: translateY(-2px);
  }
`;

const RoleTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const RoleDescription = styled.p`
  color: var(--text-secondary);
  line-height: 1.5;
  font-size: 0.95rem;
`;

const ContinueButton = styled(motion.button)`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  border: none;
  padding: 1rem 3rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(119, 101, 218, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(119, 101, 218, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const UserSelection = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      if (selectedRole === 'teacher') {
        navigate('/teacher/login');
      } else {
        navigate('/student/auth');
      }
    }
  };

  return (
    <Container>
      <Header>
        <AppBadge>
          <FaBolt />
          Intervue Poll
        </AppBadge>
        <Title>Welcome to the Live Polling System</Title>
        <Subtitle>
          Please select the role that best describes you to begin using the live polling system.
        </Subtitle>
      </Header>
      
      <RoleSelectionContainer>
        <RoleCard
          selected={selectedRole === 'student'}
          onClick={() => handleRoleSelect('student')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RoleTitle>I'm a Student</RoleTitle>
          <RoleDescription>
            Submit answers and view live poll results in real-time.
          </RoleDescription>
        </RoleCard>
        
        <RoleCard
          selected={selectedRole === 'teacher'}
          onClick={() => handleRoleSelect('teacher')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <RoleTitle>I'm a Teacher</RoleTitle>
          <RoleDescription>
            Create polls, ask questions, and monitor student responses in real-time.
          </RoleDescription>
        </RoleCard>
      </RoleSelectionContainer>
      
      <ContinueButton
        onClick={handleContinue}
        disabled={!selectedRole}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Continue
      </ContinueButton>
    </Container>
  );
};

export default UserSelection; 