import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBolt, FaClock, FaChartBar, FaComments, FaSignOutAlt, FaCheckCircle, FaTimes, FaCog } from 'react-icons/fa';
import { logout } from '../store/slices/authSlice';
import { 
  setCurrentPoll, 
  setPollResults, 
  setHasAnswered, 
  setPollError, 
  clearPollError,
  setTimeLeft,
  setKickedOut,
  updateUserList,
  addUser,
  removeUser
} from '../store/slices/pollSlice';
import { setConnected, setSocketId } from '../store/slices/socketSlice';
import { addMessage, setChatOpen, setChatHistory, setParticipants } from '../store/slices/chatSlice';
import io from 'socket.io-client';
import toast from 'react-hot-toast';
import PollAnswer from './PollAnswer';
import PollResults from './PollResults';
import Chat from './Chat';
import ThemeToggle from './ThemeToggle';
import Settings from './Settings';

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
  max-width: 800px;
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

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const QuestionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Timer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'timeLeft'
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.timeLeft < 10 ? 'var(--error)' : 'var(--primary-purple)'};
  padding: 0.5rem 1rem;
  background: ${props => props.timeLeft < 10 ? 'rgba(229, 62, 62, 0.1)' : 'rgba(119, 101, 218, 0.1)'};
  border-radius: 8px;
  border: 2px solid ${props => props.timeLeft < 10 ? 'var(--error)' : 'var(--primary-purple)'};
  animation: ${props => props.timeLeft < 10 ? 'pulse 1s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
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

const WaitingState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
`;

const WaitingIcon = styled.div`
  width: 80px;
  height: 80px;
  border: 4px solid var(--border);
  border-top: 4px solid var(--primary-purple);
  border-radius: 50%;
  margin: 0 auto 2rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const WaitingText = styled.h2`
  font-size: 1.5rem;
              color: var(--text-secondary);
  margin-bottom: 1rem;
`;

const WaitingSubtext = styled.p`
              color: var(--text-muted);
  font-size: 1rem;
`;

const AnsweredBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
              color: var(--success);
  font-weight: 600;
  font-size: 0.9rem;
`;

const KickedOutModal = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants'].includes(prop)
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const KickedOutCard = styled.div`
  background: var(--surface);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
`;

const KickedOutTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const KickedOutMessage = styled.p`
  color: var(--text-secondary);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
`;

const ContinueButton = styled(ActionButton)`
  padding: 1rem 2rem;
  font-size: 1.1rem;
`;

// Performance modal styled components
const ChatOverlay = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants'].includes(prop)
})`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatContainer = styled(motion.div).withConfig({
  shouldForwardProp: (prop) => !['initial', 'animate', 'exit', 'transition', 'whileHover', 'whileTap', 'variants'].includes(prop)
})`
  background: var(--surface);
  width: 500px;
  max-width: 90vw;
  height: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border);
`;

const ChatHeader = styled.div`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--primary-indigo) 100%);
  color: white;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userName } = useSelector((state) => state.auth);
  const { currentPoll, results, hasAnswered, timeLeft, error, kickedOut } = useSelector((state) => state.poll);
  const { isConnected } = useSelector((state) => state.socket);
  const { isChatOpen } = useSelector((state) => state.chat);
  
  const socketRef = useRef(null);
  
  const [showPerformance, setShowPerformance] = useState(false);
  const [studentPerformance, setStudentPerformance] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    console.log('Connecting to socket server as student...');
    const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      timeout: 10000,
      forceNew: true
    });
    
    newSocket.on('connect', () => {
      console.log('Socket connected successfully as student!');
      dispatch(setConnected(true));
      dispatch(setSocketId(newSocket.id));
      socketRef.current = newSocket;
      
      // Join room as student
      console.log('Joining room as student...');
      newSocket.emit('join-room', {
        userType: 'student',
        userName: userName
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
      dispatch(setHasAnswered(false));
      toast.success('New poll available!');
    });

    newSocket.on('poll-update', (data) => {
      console.log('Poll update received:', data);
      dispatch(setCurrentPoll(data.poll));
      dispatch(setPollResults(data.results));
    });

    newSocket.on('poll-results', (data) => {
      console.log('Poll results received:', data);
      dispatch(setPollResults(data.results));
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

    newSocket.on('kicked-out', (data) => {
      console.log('Kicked out event received:', data);
      dispatch(setKickedOut(true));
      toast.error('You have been removed from the session by the teacher.');
    });

    // Performance tracking events
    newSocket.on('student-performance', (performance) => {
      console.log('Student performance received:', performance);
      setStudentPerformance(performance);
    });

    // Session management events
    newSocket.on('session-ended', (data) => {
      console.log('Session ended:', data);
      setSessionEnded(true);
      toast.success('Session ended! You can now view your performance.');
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

  const toggleChat = () => {
    dispatch(setChatOpen(!isChatOpen));
  };

  const handleContinue = () => {
    dispatch(setKickedOut(false));
    navigate('/');
  };

  const handleGetPerformance = () => {
    if (socketRef.current && userName) {
      socketRef.current.emit('get-student-performance', userName);
      setShowPerformance(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    if (seconds < 10) {
      return `⚠️ ${timeString}`;
    } else if (seconds < 30) {
      return `⏰ ${timeString}`;
    }
    return timeString;
  };

  if (kickedOut) {
    return (
      <KickedOutModal
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <KickedOutCard>
          <AppBadge style={{ margin: '0 auto 2rem' }}>
            <FaBolt />
            Intervue Poll
          </AppBadge>
          <KickedOutTitle>You've been Kicked out!</KickedOutTitle>
          <KickedOutMessage>
            Looks like the teacher had removed you from the poll system. Please try again sometime.
          </KickedOutMessage>
          <ContinueButton
            onClick={handleContinue}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Continue
          </ContinueButton>
        </KickedOutCard>
      </KickedOutModal>
    );
  }

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
          
          {sessionEnded && (
            <ActionButton
              onClick={handleGetPerformance}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
            >
              <FaChartBar />
              My Performance
            </ActionButton>
          )}
          
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
        <AnimatePresence mode="wait">
          {!currentPoll ? (
            <Section
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <WaitingState>
                <WaitingIcon />
                <WaitingText>Wait for the teacher to ask questions..</WaitingText>
                <WaitingSubtext>
                  Stay connected and wait for the teacher to create a new poll.
                </WaitingSubtext>
              </WaitingState>
            </Section>
          ) : currentPoll.isActive && !hasAnswered ? (
            <Section
              key="answering"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <QuestionHeader>
                <QuestionTitle>
                  Question 1
                </QuestionTitle>
                <Timer timeLeft={timeLeft}>
                  <FaClock />
                  {formatTime(timeLeft)}
                </Timer>
              </QuestionHeader>
              
              <PollAnswer
                poll={currentPoll}
                socket={socketRef.current}
                onAnswer={() => dispatch(setHasAnswered(true))}
              />
            </Section>
          ) : (
            <Section
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <QuestionHeader>
                <QuestionTitle>
                  <FaChartBar />
                  Polling results
                </QuestionTitle>
                {hasAnswered && (
                  <AnsweredBadge>
                    <FaCheckCircle />
                    Answered
                  </AnsweredBadge>
                )}
              </QuestionHeader>
              
              {results ? (
                <PollResults results={results} poll={currentPoll} />
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  Waiting for results...
                </div>
              )}
              
              <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                Wait for the teacher to ask a new question..
              </div>
            </Section>
          )}
        </AnimatePresence>
      </MainContent>

      <AnimatePresence>
        {isChatOpen && <Chat socket={socketRef.current} />}
      </AnimatePresence>

      <AnimatePresence>
        {isSettingsOpen && (
          <Settings
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPerformance && (
          <ChatOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPerformance(false)}
          >
            <ChatContainer
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ChatHeader>
                <HeaderTitle>
                  <FaChartBar />
                  My Performance
                </HeaderTitle>
                <CloseButton onClick={() => setShowPerformance(false)}>
                  <FaTimes />
                </CloseButton>
              </ChatHeader>
              
              <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto' }}>
                {studentPerformance ? (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                          {studentPerformance.totalAnswers}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Total Answers</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>
                          {studentPerformance.correctAnswers}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Correct</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--error)' }}>
                          {studentPerformance.incorrectAnswers}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Incorrect</div>
                      </div>
                      <div style={{ textAlign: 'center', padding: '1rem', background: 'var(--background)', borderRadius: '8px' }}>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '700', 
                          color: studentPerformance.accuracy >= 70 ? 'var(--success)' : studentPerformance.accuracy >= 50 ? 'var(--warning)' : 'var(--error)' 
                        }}>
                          {studentPerformance.accuracy}%
                        </div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Accuracy</div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Keep answering questions to improve your performance!
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '2rem', 
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '2rem' }}>📊</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Performance Not Available
                    </div>
                    <div style={{ fontSize: '0.9rem' }}>
                      {sessionEnded 
                        ? 'Your performance data is being processed. Please try again in a moment.'
                        : 'Performance data will be available after the teacher ends the session.'
                      }
                    </div>
                  </div>
                )}
              </div>
            </ChatContainer>
          </ChatOverlay>
        )}
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

export default StudentDashboard; 