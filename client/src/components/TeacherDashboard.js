import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaPlus, FaChartBar, FaComments, FaSignOutAlt, FaHistory, FaUsers, FaClock, FaCog, FaChartPie } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { 
  setCurrentPoll, 
  setPollResults, 
  setPollError, 
  clearPollError,
  setTimeLeft,
  updateUserList,
  addUser,
  removeUser
} from '../store/slices/pollSlice';
import { setConnected, setSocketId } from '../store/slices/socketSlice';
import { addMessage, setChatOpen, setChatHistory, setParticipants } from '../store/slices/chatSlice';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import PollCreator from './PollCreator';
import PollResults from './PollResults';
import PollHistory from './PollHistory';
import Chat from './Chat';
import Settings from './Settings';
import ThemeToggle from './ThemeToggle';
import AnalyticsDashboard from './AnalyticsDashboard';

const Container = styled.div`
  min-height: 100vh;
  background: var(--background);
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: var(--surface);
  color: var(--text-primary);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AppBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants'].includes(prop)
})`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-1px);
  }
`;

const LogoutButton = styled(ActionButton)`
      background: var(--error);
  
  &:hover {
    background: var(--error);
  }
`;



const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const Section = styled.div`
  background: var(--surface);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const WelcomeText = styled.p`
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(ActionButton)`
  padding: 1rem 2rem;
  font-size: 1rem;
`;

const SecondaryButton = styled(ActionButton)`
  background: var(--text-muted);
  
  &:hover {
    background: var(--border);
  }
`;

const StatusIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isConnected'
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${props => props.isConnected ? 'var(--success)' : 'var(--error)'};
  font-weight: 600;
`;

const FloatingChatButton = styled(motion.button).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants'].includes(prop)
})`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  background: var(--primary-purple);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(119, 101, 218, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-indigo);
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(119, 101, 218, 0.4);
  }
`;

const StatusDot = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isConnected'
})`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isConnected ? 'var(--success)' : 'var(--error)'};
  animation: ${props => props.isConnected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
`;

const UserStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--surface);
  border-radius: 8px;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-purple);
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName } = useSelector((state) => state.auth);
  const { currentPoll, results, timeLeft, error, connectedUsers } = useSelector((state) => state.poll);
  const { isConnected } = useSelector((state) => state.socket);
  const { isChatOpen } = useSelector((state) => state.chat);
  
  const socketRef = useRef(null);
  
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showPollHistory, setShowPollHistory] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [individualAnswers, setIndividualAnswers] = useState([]);

  useEffect(() => {
    // Initialize socket connection
    console.log('Connecting to socket server...');
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected successfully!');
      dispatch(setConnected(true));
      dispatch(setSocketId(newSocket.id));
      socketRef.current = newSocket;
      
      // Join room as teacher
      console.log('Joining room as teacher...');
      newSocket.emit('join-room', {
        userType: 'teacher',
        userName: userName || 'Teacher'
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      dispatch(setConnected(false));
      toast.error('Failed to connect to server. Please refresh the page.');
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      dispatch(setConnected(false));
      if (reason === 'io server disconnect') {
        toast.error('Disconnected from server. Please refresh the page.');
      }
    });

    newSocket.on('poll-created', (poll) => {
      console.log('Poll created:', poll);
      dispatch(setCurrentPoll(poll));
      toast.success('Poll created successfully!');
    });

    newSocket.on('poll-results', (data) => {
      console.log('Poll results received:', data);
      dispatch(setPollResults(data.results));
      if (data.individualAnswers) {
        setIndividualAnswers(data.individualAnswers);
      }
    });

    newSocket.on('timer-update', (data) => {
      console.log('Timer update received:', data);
      dispatch(setTimeLeft(data.timeLeft));
    });

    newSocket.on('poll-ended', (data) => {
      console.log('Poll ended:', data);
      dispatch(setCurrentPoll(data.poll));
      dispatch(setPollResults(data.results));
      toast.success('Poll ended!');
    });

    newSocket.on('poll-reset', () => {
      console.log('Poll reset');
      dispatch(setCurrentPoll(null));
      dispatch(setPollResults(null));
      setIndividualAnswers([]);
      toast.success('Ready for new poll!');
    });

    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      dispatch(setPollError(error.message));
      toast.error(error.message);
    });

    newSocket.on('new-message', (message) => {
      console.log('New message received:', message);
      dispatch(addMessage(message));
    });

    newSocket.on('chat-history', (messages) => {
      console.log('Chat history received:', messages);
      dispatch(setChatHistory(messages));
    });

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data);
      dispatch(addUser(data.user));
      toast.success(`${data.user.name} joined the session`);
    });

    newSocket.on('user-left', (data) => {
      console.log('User left:', data);
      dispatch(removeUser(data.user));
              toast(`${data.user.name} left the session`);
    });

    newSocket.on('user-list-updated', (data) => {
      console.log('User list updated:', data);
      dispatch(updateUserList(data));
      dispatch(setParticipants(data.users));
    });

    newSocket.on('student-removed', (data) => {
      console.log('Student removed:', data);
      toast.success(`Student ${data.studentName} has been removed`);
    });





    return () => {
      console.log('Cleaning up socket connection...');
      newSocket.disconnect();
    };
  }, [dispatch, userName]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearPollError());
    }
  }, [error, dispatch]);







  const handleLogout = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    dispatch(logout());
    navigate('/');
  };

  const handleCreatePoll = () => {
    setShowPollCreator(true);
  };

  const handleAskNewQuestion = () => {
    if (socketRef.current) {
      socketRef.current.emit('ask-new-question');
    }
  };

  const toggleChat = () => {
    dispatch(setChatOpen(!isChatOpen));
  };











  return (
    <Container>
      <Header>
        <HeaderLeft>
          <AppBadge>
            <FaBolt />
            Intervue Poll
          </AppBadge>
        </HeaderLeft>
        
        <HeaderRight>
          <StatusIndicator isConnected={isConnected}>
            <StatusDot isConnected={isConnected} />
            {isConnected ? 'Connected' : 'Disconnected'}
          </StatusIndicator>
          

          
          <ThemeToggle />
          
          <ActionButton
            onClick={() => setIsSettingsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
          >
            <FaCog />
            Settings
          </ActionButton>
          
          <LogoutButton
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt />
            Logout
          </LogoutButton>
        </HeaderRight>
      </Header>

      <MainContent>
        <Section>
          <SectionTitle>
            <FaPlus />
            Let's Get Started
          </SectionTitle>
          <WelcomeText>
            You'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
          </WelcomeText>
          
          <UserStats>
            <StatItem>
              <StatValue>{connectedUsers.total}</StatValue>
              <StatLabel>Total Users</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{connectedUsers.students}</StatValue>
              <StatLabel>Students</StatLabel>
            </StatItem>
            <StatItem>
              <StatValue>{connectedUsers.teachers}</StatValue>
              <StatLabel>Teachers</StatLabel>
            </StatItem>

          </UserStats>
          
          <ButtonGroup>
            <PrimaryButton
              onClick={handleCreatePoll}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaPlus />
              Ask a Question
            </PrimaryButton>
            
            {currentPoll && currentPoll.isActive && (
              <>
                <SecondaryButton
                  onClick={handleAskNewQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Ask New Question
                </SecondaryButton>
                <SecondaryButton
                  onClick={handleAskNewQuestion}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ background: 'var(--error)' }}
                >
                  Reset Current Poll
                </SecondaryButton>
              </>
            )}
            
            <SecondaryButton
              onClick={() => setShowPollHistory(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaHistory />
              View Poll History
            </SecondaryButton>
            
            <SecondaryButton
              onClick={() => setIsAnalyticsOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaChartPie />
              Analytics & Insights
            </SecondaryButton>





            

          </ButtonGroup>
        </Section>

        {currentPoll && currentPoll.isActive && (
          <Section>
            <SectionTitle>
              <FaClock />
              Active Poll Timer
            </SectionTitle>
            <div style={{
              background: timeLeft < 10 
                ? 'linear-gradient(135deg, var(--error) 0%, var(--error) 100%)' 
                : 'linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%)',
              color: 'white',
              padding: '2rem',
              borderRadius: '12px',
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              animation: timeLeft < 10 ? 'pulse 1s infinite' : 'none'
            }}>
              {timeLeft < 10 ? '⚠️ ' : ''}{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
          </Section>
        )}

        {results && (
          <Section>
            <SectionTitle>
              <FaChartBar />
              Poll Results
            </SectionTitle>
            <PollResults results={results} poll={currentPoll} />
          </Section>
        )}



        {currentPoll && individualAnswers.length > 0 && (
          <Section>
            <SectionTitle>
              <FaUsers />
              Individual Student Answers
            </SectionTitle>
            <div style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {individualAnswers.map((studentAnswer, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '1rem',
                    borderBottom: '1px solid var(--border)',
                    background: 'var(--background)',
                    marginBottom: '0.5rem',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${studentAnswer.isCorrect ? 'var(--success)' : 'var(--error)'}`
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem'
                      }}>
                        {studentAnswer.studentName}
                      </div>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: 'var(--text-secondary)',
                        marginBottom: '0.25rem'
                      }}>
                        Answer: {Array.isArray(studentAnswer.answer) ? studentAnswer.answer.join(', ') : studentAnswer.answer}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--text-muted)' 
                      }}>
                        Response time: {Math.round(studentAnswer.responseTime / 1000)}s
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '700', 
                        color: studentAnswer.isCorrect ? 'var(--success)' : 'var(--error)',
                        marginBottom: '0.25rem'
                      }}>
                        {studentAnswer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: 'var(--text-muted)' 
                      }}>
                        {new Date(studentAnswer.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        )}
      </MainContent>

      <AnimatePresence>
        {showPollCreator && (
          <PollCreator
            onClose={() => setShowPollCreator(false)}
            socket={socketRef.current}
          />
        )}
        {showPollHistory && (
          <PollHistory
            onClose={() => setShowPollHistory(false)}
          />
        )}
        {isSettingsOpen && (
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
        {isAnalyticsOpen && (
          <AnalyticsDashboard
            isOpen={isAnalyticsOpen}
            onClose={() => setIsAnalyticsOpen(false)}
            currentPoll={currentPoll}
            connectedUsers={connectedUsers}
          />
        )}

      </AnimatePresence>

      <AnimatePresence>
        {isChatOpen && <Chat socket={socketRef.current} />}
      </AnimatePresence>
      
      <FloatingChatButton
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaComments />
      </FloatingChatButton>
    </Container>
  );
};

export default TeacherDashboard; 