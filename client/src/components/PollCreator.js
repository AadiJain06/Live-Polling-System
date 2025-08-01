import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash, FaClock, FaList, FaCheckCircle, FaStar, FaImage, FaEyeSlash, FaAlignLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
`;

const Modal = styled(motion.div)`
  background: var(--surface);
  border-radius: 20px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--border);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--medium-gray);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--surface);
    color: var(--text-primary);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuestionInput = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  background: var(--surface);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary-purple);
    outline: none;
    box-shadow: 0 0 0 3px rgba(119, 101, 218, 0.1);
  }
  
  &::placeholder {
    color: var(--text-muted);
  }
`;

const TimeLimitGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const TimeSelect = styled.select`
  padding: 0.5rem 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--surface);
  color: var(--text-primary);
  cursor: pointer;
  
  &:focus {
    border-color: var(--primary-purple);
    outline: none;
  }
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
`;

const OptionItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
`;

const OptionNumber = styled.div`
  width: 24px;
  height: 24px;
      background: var(--primary-purple);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  font-size: 0.9rem;
  background: var(--background);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary-purple);
    outline: none;
  }
`;

const CorrectnessSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const RadioInput = styled.input`
  width: 16px;
  height: 16px;
  accent-color: var(--primary-purple);
`;

const AddOptionButton = styled.button`
  background: var(--success);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--success);
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, var(--primary-purple) 0%, var(--secondary-purple) 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(119, 101, 218, 0.3);
  margin-left: auto;
  display: block;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(119, 101, 218, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const PollTypeSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PollTypeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const PollTypeCard = styled.div`
  padding: 1rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-purple)' : 'var(--border)'};
  border-radius: 8px;
  background: ${props => props.selected ? 'rgba(119, 101, 218, 0.1)' : 'var(--surface)'};
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  &:hover {
    border-color: var(--primary-purple);
    background: rgba(119, 101, 218, 0.05);
  }
`;

const PollTypeIcon = styled.div`
  font-size: 1.2rem;
  color: var(--primary-purple);
`;

const PollTypeInfo = styled.div`
  flex: 1;
`;

const PollTypeTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
`;

const PollTypeDescription = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
`;

const AnonymousToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-purple);
  }
`;

const ToggleSwitch = styled.div`
  width: 40px;
  height: 20px;
  background: ${props => props.active ? 'var(--primary-purple)' : 'var(--border)'};
  border-radius: 10px;
  position: relative;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '22px' : '2px'};
    width: 16px;
    height: 16px;
    background: var(--background);
    border-radius: 50%;
    transition: all 0.3s ease;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RatingScale = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RatingOption = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-purple);
  }
`;

const TextResponseArea = styled.textarea`
  width: 100%;
  padding: 1rem;
      border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  transition: all 0.3s ease;
  
  &:focus {
    border-color: var(--primary-purple);
    outline: none;
  }
`;

const ImageUploadArea = styled.div`
      border: 2px dashed var(--border);
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--primary-purple);
    background: rgba(102, 126, 234, 0.05);
  }
`;

const PollCreator = ({ onClose, socket }) => {
  const [question, setQuestion] = useState('');
  const [pollType, setPollType] = useState('multiple-choice');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState(['yes', 'no']);
  const [timeLimit, setTimeLimit] = useState(60);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [ratingScale, setRatingScale] = useState(5);
  const [textResponse, setTextResponse] = useState('');
  const [imageOptions, setImageOptions] = useState([]);

  const handleAddOption = () => {
    setOptions([...options, '']);
    setCorrectAnswers([...correctAnswers, 'no']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      const newCorrectAnswers = correctAnswers.filter((_, i) => i !== index);
      setOptions(newOptions);
      setCorrectAnswers(newCorrectAnswers);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleCorrectnessChange = (index, value) => {
    const newCorrectAnswers = [...correctAnswers];
    newCorrectAnswers[index] = value;
    setCorrectAnswers(newCorrectAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }
    
    if (pollType === 'multiple-choice' || pollType === 'single-choice') {
      const validOptions = options.filter(option => option.trim());
      if (validOptions.length < 2) {
        toast.error('Please enter at least 2 options');
        return;
      }
    }
    
    if (timeLimit < 10 || timeLimit > 300) {
      toast.error('Time limit must be between 10 and 300 seconds');
      return;
    }

    // Validate that at least one correct answer is selected
    if (pollType === 'multiple-choice' || pollType === 'single-choice' || pollType === 'yes-no') {
      const hasCorrectAnswer = correctAnswers.some(answer => answer === 'yes');
      if (!hasCorrectAnswer) {
        toast.error('Please select at least one correct answer');
        return;
      }
    }

    // Determine correct answer based on poll type
    let correctAnswer = null;
    if (pollType === 'multiple-choice') {
      // For multiple choice, get all options marked as correct
      const correctOptions = options
        .map((option, index) => ({ option, index }))
        .filter((_, index) => correctAnswers[index] === 'yes')
        .map(item => item.option);
      correctAnswer = correctOptions;
    } else if (pollType === 'single-choice') {
      // For single choice, get the first option marked as correct
      const correctIndex = correctAnswers.findIndex(answer => answer === 'yes');
      correctAnswer = correctIndex >= 0 ? options[correctIndex] : null;
    } else if (pollType === 'yes-no') {
      // For yes/no, use the first option marked as correct
      const correctIndex = correctAnswers.findIndex(answer => answer === 'yes');
      correctAnswer = correctIndex >= 0 ? (correctIndex === 0 ? 'Yes' : 'No') : 'Yes';
    } else if (pollType === 'rating') {
      // For rating, use the middle value as correct (e.g., 3 for 1-5 scale)
      correctAnswer = Math.ceil(ratingScale / 2).toString();
    }

    const pollData = {
      question: question.trim(),
      pollType: pollType,
      options: pollType === 'multiple-choice' || pollType === 'single-choice' ? options.filter(option => option.trim()) : [],
      timeLimit: parseInt(timeLimit),
      isAnonymous: isAnonymous,
      ratingScale: pollType === 'rating' ? ratingScale : null,
      textResponse: pollType === 'text' ? textResponse : null,
      imageOptions: pollType === 'image' ? imageOptions : [],
      correctAnswer: correctAnswer
    };

    socket.emit('create-poll', pollData);
    onClose();
  };

  const pollTypes = [
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Students can select multiple options',
      icon: <FaList />
    },
    {
      id: 'single-choice',
      title: 'Single Choice',
      description: 'Students can select only one option',
      icon: <FaCheckCircle />
    },
    {
      id: 'rating',
      title: 'Rating Scale',
      description: 'Students rate on a scale (1-5 or 1-10)',
      icon: <FaStar />
    },
    {
      id: 'yes-no',
      title: 'Yes/No Question',
      description: 'Simple yes or no response',
      icon: <FaCheckCircle />
    },
    {
      id: 'text',
      title: 'Text Response',
      description: 'Open-ended text answers',
      icon: <FaAlignLeft />
    }
  ];

  return (
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
          <Title>Let's Get Started</Title>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </Header>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Question:</Label>
            <QuestionInput
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter your question..."
              required
            />
          </FormGroup>

          <PollTypeSelector>
            <Label>Poll Type:</Label>
            <PollTypeGrid>
              {pollTypes.map((type) => (
                <PollTypeCard
                  key={type.id}
                  selected={pollType === type.id}
                  onClick={() => setPollType(type.id)}
                >
                  <PollTypeIcon>{type.icon}</PollTypeIcon>
                  <PollTypeInfo>
                    <PollTypeTitle>{type.title}</PollTypeTitle>
                    <PollTypeDescription>{type.description}</PollTypeDescription>
                  </PollTypeInfo>
                </PollTypeCard>
              ))}
            </PollTypeGrid>
          </PollTypeSelector>

          <AnonymousToggle onClick={() => setIsAnonymous(!isAnonymous)}>
            <FaEyeSlash />
            <div>
              <div style={{ fontWeight: 600, color: 'var(--dark-gray)' }}>Anonymous Polling</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--medium-gray)' }}>
                Hide student names in results
              </div>
            </div>
            <ToggleSwitch active={isAnonymous} />
          </AnonymousToggle>

          {pollType === 'rating' && (
            <FormGroup>
              <Label>
                <FaStar />
                Rating Scale:
              </Label>
              <TimeLimitGroup>
                <TimeSelect
                  value={ratingScale}
                  onChange={(e) => setRatingScale(parseInt(e.target.value))}
                >
                  <option value={5}>1-5 Stars</option>
                  <option value={10}>1-10 Stars</option>
                </TimeSelect>
              </TimeLimitGroup>
            </FormGroup>
          )}

          {pollType === 'yes-no' && (
            <OptionsContainer>
              <CorrectnessSection>
                <SectionTitle>Correct Answer</SectionTitle>
                <RadioGroup>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="yes-no-correct"
                      value="yes"
                      checked={correctAnswers[0] === 'yes'}
                      onChange={() => handleCorrectnessChange(0, 'yes')}
                    />
                    Yes
                  </RadioLabel>
                  <RadioLabel>
                    <RadioInput
                      type="radio"
                      name="yes-no-correct"
                      value="no"
                      checked={correctAnswers[1] === 'yes'}
                      onChange={() => handleCorrectnessChange(1, 'yes')}
                    />
                    No
                  </RadioLabel>
                </RadioGroup>
              </CorrectnessSection>
            </OptionsContainer>
          )}

          {(pollType === 'multiple-choice' || pollType === 'single-choice') && (
            <OptionsContainer>
              <OptionsSection>
                <SectionTitle>Poll Options</SectionTitle>
                {options.map((option, index) => (
                  <OptionItem key={index}>
                    <OptionNumber>{index + 1}</OptionNumber>
                    <OptionInput
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          fontSize: '1.2rem'
                        }}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </OptionItem>
                ))}
                <AddOptionButton type="button" onClick={handleAddOption}>
                  <FaPlus />
                  Add Option
                </AddOptionButton>
              </OptionsSection>
            </OptionsContainer>
          )}

          <FormGroup>
            <Label>
              <FaClock />
              Time Limit:
            </Label>
            <TimeLimitGroup>
              <TimeSelect
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                required
              >
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={90}>90 seconds</option>
                <option value={120}>120 seconds</option>
                <option value={180}>180 seconds</option>
                <option value={300}>300 seconds</option>
              </TimeSelect>
            </TimeLimitGroup>
          </FormGroup>

          {(pollType === 'multiple-choice' || pollType === 'single-choice') && (
            <OptionsContainer>
              <OptionsSection>
                <SectionTitle>Edit Options</SectionTitle>
                {options.map((option, index) => (
                  <OptionItem key={index}>
                    <OptionInput
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder="Enter option..."
                      required
                    />
                  </OptionItem>
                ))}
                <AddOptionButton
                  type="button"
                  onClick={handleAddOption}
                >
                  <FaPlus />
                  Add Option
                </AddOptionButton>
              </OptionsSection>

              <CorrectnessSection>
                <SectionTitle>Is it Correct?</SectionTitle>
                {options.map((option, index) => (
                  <RadioGroup key={index}>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name={`correct-${index}`}
                        value="yes"
                        checked={correctAnswers[index] === 'yes'}
                        onChange={() => handleCorrectnessChange(index, 'yes')}
                      />
                      Yes
                    </RadioLabel>
                    <RadioLabel>
                      <RadioInput
                        type="radio"
                        name={`correct-${index}`}
                        value="no"
                        checked={correctAnswers[index] === 'no'}
                        onChange={() => handleCorrectnessChange(index, 'no')}
                      />
                      No
                    </RadioLabel>
                  </RadioGroup>
                ))}
              </CorrectnessSection>
            </OptionsContainer>
          )}

          <SubmitButton type="submit">
            Ask Question
          </SubmitButton>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default PollCreator; 