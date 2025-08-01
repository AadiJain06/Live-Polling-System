import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaClock, FaUsers, FaChartLine, FaDownload, FaEye, FaCheckCircle, FaTimesCircle, FaCheck } from 'react-icons/fa';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background: var(--surface);
  border-radius: 16px;
  padding: 2rem;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
`;

const AnalyticsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--background);
    color: var(--text-primary);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})`
  background: ${props => props.active ? 'var(--primary-purple)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text-secondary)'};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'var(--primary-purple)' : 'var(--background)'};
    color: ${props => props.active ? 'white' : 'var(--text-primary)'};
  }
`;

const ContentArea = styled.div`
  min-height: 400px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const MetricCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-purple);
  margin-bottom: 0.5rem;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ParticipationList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid var(--border);
  border-radius: 8px;
`;

const ParticipantItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ParticipantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ParticipantStatus = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'answered'
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.answered ? 'var(--success)' : 'var(--text-muted)'};
`;

const ResponseTimeChart = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const TimeDistribution = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const TimeBucket = styled.div`
  text-align: center;
  padding: 1rem;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

const TimeBucketValue = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-purple);
`;

const TimeBucketLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const ExportSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
`;

const ExportButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const ExportButton = styled.button`
  background: var(--primary-purple);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--primary-indigo);
    transform: translateY(-1px);
  }
`;

const AnswerAccuracyCard = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const AccuracyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const AccuracyItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: var(--background);
  border-radius: 8px;
  border: 1px solid var(--border);
`;

const AccuracyValue = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'correct'
})`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => props.correct ? 'var(--success)' : 'var(--error)'};
`;

const AccuracyLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
`;

const AnalyticsDashboard = ({ isOpen, onClose, currentPoll, connectedUsers }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [participationData, setParticipationData] = useState([]);

  useEffect(() => {
    if (isOpen && currentPoll) {
      fetchAnalyticsData();
      const interval = setInterval(fetchAnalyticsData, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, currentPoll]);

  const fetchAnalyticsData = async () => {
    try {
      const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
      const [analyticsResponse, participationResponse] = await Promise.all([
        fetch(`${serverUrl}/api/analytics/current`),
        fetch(`${serverUrl}/api/analytics/participation`)
      ]);
      
      if (analyticsResponse.ok) {
        const analytics = await analyticsResponse.json();
        if (analytics.error) {
          console.log('No active poll for analytics');
          setAnalyticsData(null);
        } else {
          setAnalyticsData(analytics);
        }
      } else {
        console.log('Analytics endpoint not available');
        setAnalyticsData(null);
      }
      
      if (participationResponse.ok) {
        const participation = await participationResponse.json();
        setParticipationData(participation);
      } else {
        console.log('Participation endpoint not available');
        setParticipationData([]);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  const calculateMetrics = () => {
    if (!analyticsData || analyticsData.error) return {
      totalStudents: 0,
      answeredStudents: 0,
      participationRate: 0,
      averageResponseTime: 0,
      completionRate: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      accuracyRate: 0
    };
    
    return {
      totalStudents: analyticsData.totalStudents || 0,
      answeredStudents: analyticsData.answeredStudents || 0,
      participationRate: analyticsData.participationRate || 0,
      averageResponseTime: analyticsData.averageResponseTime || 0,
      completionRate: analyticsData.participationRate || 0,
      correctAnswers: analyticsData.correctAnswers || 0,
      incorrectAnswers: analyticsData.incorrectAnswers || 0,
      accuracyRate: analyticsData.accuracyRate || 0
    };
  };

  const exportData = (format) => {
    if (!analyticsData) return;
    
    const data = {
      poll: currentPoll,
      analytics: analyticsData,
      participation: participationData,
      timestamp: new Date().toISOString()
    };
    
    if (format === 'csv') {
      const csv = convertToCSV(data);
      downloadFile(csv, 'analytics.csv', 'text/csv');
    } else if (format === 'json') {
      downloadFile(JSON.stringify(data, null, 2), 'analytics.json', 'application/json');
    }
  };

  const convertToCSV = (data) => {
    const headers = ['Student Name', 'Has Answered', 'Response Time (ms)', 'Answer', 'Correct', 'Timestamp'];
    const rows = participationData.map(p => [
      p.studentName,
      p.hasAnswered ? 'Yes' : 'No',
      p.responseTime || 'N/A',
      p.answer || 'N/A',
      p.isCorrect ? 'Yes' : 'No',
      new Date(p.timestamp).toLocaleString()
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renderOverview = () => {
    const metrics = calculateMetrics();
    
    // Show message if no active poll
    if (!currentPoll || !analyticsData || analyticsData.error) {
      return (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: 'var(--text-secondary)',
          background: 'var(--surface)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
            📊 No Active Poll
          </div>
          <div>
            Analytics will be available when a poll is active. Start a poll to see real-time analytics data.
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <MetricsGrid>
          <MetricCard>
            <MetricValue>{metrics.totalStudents}</MetricValue>
            <MetricLabel>Total Students</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{metrics.answeredStudents}</MetricValue>
            <MetricLabel>Students Answered</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{metrics.participationRate}%</MetricValue>
            <MetricLabel>Participation Rate</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{Math.round(metrics.averageResponseTime / 1000)}s</MetricValue>
            <MetricLabel>Avg Response Time</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{metrics.accuracyRate}%</MetricValue>
            <MetricLabel>Accuracy Rate</MetricLabel>
          </MetricCard>
          <MetricCard>
            <MetricValue>{metrics.correctAnswers}</MetricValue>
            <MetricLabel>Correct Answers</MetricLabel>
          </MetricCard>
        </MetricsGrid>

        <Section>
          <SectionTitle>
            <FaCheck />
            Answer Accuracy
          </SectionTitle>
          <AnswerAccuracyCard>
            {analyticsData?.accuracyData ? (
              <AccuracyGrid>
                <AccuracyItem>
                  <AccuracyValue correct={true}>
                    {analyticsData.correctAnswers || 0}
                  </AccuracyValue>
                  <AccuracyLabel>Correct Answers</AccuracyLabel>
                </AccuracyItem>
                <AccuracyItem>
                  <AccuracyValue correct={false}>
                    {analyticsData.incorrectAnswers || 0}
                  </AccuracyValue>
                  <AccuracyLabel>Incorrect Answers</AccuracyLabel>
                </AccuracyItem>
                <AccuracyItem>
                  <AccuracyValue correct={true}>
                    {analyticsData.accuracyRate || 0}%
                  </AccuracyValue>
                  <AccuracyLabel>Accuracy Rate</AccuracyLabel>
                </AccuracyItem>
              </AccuracyGrid>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No accuracy data available
              </div>
            )}
          </AnswerAccuracyCard>
        </Section>

        <Section>
          <SectionTitle>
            <FaClock />
            Response Time Distribution
          </SectionTitle>
          <ResponseTimeChart>
            {analyticsData?.responseTimeDistribution ? (
              <TimeDistribution>
                {Object.entries(analyticsData.responseTimeDistribution).map(([range, count]) => (
                  <TimeBucket key={range}>
                    <TimeBucketValue>{count}</TimeBucketValue>
                    <TimeBucketLabel>{range}</TimeBucketLabel>
                  </TimeBucket>
                ))}
              </TimeDistribution>
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                No response time data available
              </div>
            )}
          </ResponseTimeChart>
        </Section>
      </div>
    );
  };

  const renderParticipation = () => {
    return (
      <div>
        <Section>
          <SectionTitle>
            <FaUsers />
            Student Participation
          </SectionTitle>
          <ParticipationList>
            {participationData.length > 0 ? (
              participationData.map((participant, index) => (
                <ParticipantItem key={index}>
                  <ParticipantInfo>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {participant.studentName}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {participant.responseTime ? 
                          `Response time: ${Math.round(participant.responseTime / 1000)}s` : 
                          'No response yet'
                        }
                        {participant.answer && (
                          <span style={{ marginLeft: '1rem' }}>
                            Answer: {participant.answer}
                            {participant.isCorrect !== undefined && (
                              <span style={{ 
                                marginLeft: '0.5rem', 
                                color: participant.isCorrect ? 'var(--success)' : 'var(--error)' 
                              }}>
                                {participant.isCorrect ? <FaCheck /> : <FaTimes />}
                              </span>
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </ParticipantInfo>
                  <ParticipantStatus answered={participant.hasAnswered}>
                    {participant.hasAnswered ? (
                      <>
                        <FaCheckCircle />
                        Answered
                      </>
                    ) : (
                      <>
                        <FaTimesCircle />
                        Pending
                      </>
                    )}
                  </ParticipantStatus>
                </ParticipantItem>
              ))
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No participation data available
              </div>
            )}
          </ParticipationList>
        </Section>
      </div>
    );
  };

  const renderTrends = () => {
    return (
      <div>
        <Section>
          <SectionTitle>
            <FaChartLine />
            Performance Trends
          </SectionTitle>
          <div style={{ 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            textAlign: 'center',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              📊 Trend Analysis
            </div>
            <div>
              Compare results across multiple polls to identify patterns and trends.
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
              This feature will show historical data and performance comparisons.
            </div>
          </div>
        </Section>
      </div>
    );
  };

  const renderExport = () => {
    return (
      <div>
        <Section>
          <SectionTitle>
            <FaDownload />
            Export Analytics Data
          </SectionTitle>
          <div style={{ 
            background: 'var(--surface)', 
            border: '1px solid var(--border)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            marginBottom: '1rem'
          }}>
            <div style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Download analytics data in various formats for further analysis.
            </div>
            <ExportButtons>
              <ExportButton onClick={() => exportData('csv')}>
                <FaDownload />
                Export as CSV
              </ExportButton>
              <ExportButton onClick={() => exportData('json')}>
                <FaDownload />
                Export as JSON
              </ExportButton>
            </ExportButtons>
          </div>
        </Section>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <Modal
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Header>
              <AnalyticsTitle>Analytics & Insights</AnalyticsTitle>
              <CloseButton onClick={onClose}>
                <FaTimes />
              </CloseButton>
            </Header>

            <TabsContainer>
              <Tab 
                active={activeTab === 'overview'} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </Tab>
              <Tab 
                active={activeTab === 'participation'} 
                onClick={() => setActiveTab('participation')}
              >
                Participation
              </Tab>
              <Tab 
                active={activeTab === 'trends'} 
                onClick={() => setActiveTab('trends')}
              >
                Trends
              </Tab>
              <Tab 
                active={activeTab === 'export'} 
                onClick={() => setActiveTab('export')}
              >
                Export
              </Tab>
            </TabsContainer>

            <ContentArea>
              {activeTab === 'overview' && renderOverview()}
              {activeTab === 'participation' && renderParticipation()}
              {activeTab === 'trends' && renderTrends()}
              {activeTab === 'export' && renderExport()}
            </ContentArea>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};

export default AnalyticsDashboard; 