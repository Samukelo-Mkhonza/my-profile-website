import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaArrowDown, 
  FaDownload, 
  FaEnvelope,
  FaCode,
  FaCloud,
  FaRocket,
  FaMapMarkerAlt,
  FaTimes,
  FaPaperPlane,
  FaEye,
  FaPhone,
  FaLinkedin,
  FaGithub,
  FaCertificate,
  FaGraduationCap,
  FaBriefcase,
  FaUser
} from 'react-icons/fa';

// Floating animation for background elements
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
`;

// Cursor blink animation
const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

// Background gradient animation
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Styled cursor element
const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  width: 1ch;
  background-color: currentColor;
  animation: ${blink} 1s step-start infinite;
`;

// TypingText component with enhanced functionality
const TypingText = ({ texts, speed = 50, pause = 2000 }) => {
  const [displayed, setDisplayed] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[currentIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayed.length < currentText.length) {
          setDisplayed(currentText.slice(0, displayed.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pause);
        }
      } else {
        if (displayed.length > 0) {
          setDisplayed(displayed.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [displayed, currentIndex, isDeleting, texts, speed, pause]);

  return (
    <span>
      {displayed}
      <Cursor />
    </span>
  );
};

const Section = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(2rem, 10vw, 4rem) 1rem;
  background: linear-gradient(-45deg, #ffffff, #f8f9fa, #ffffff, #f0f2f5);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding-top: clamp(6rem, 15vw, 8rem);
    align-items: flex-start;
    justify-content: center;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(0, 0, 0, 0.02) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(0, 0, 0, 0.02) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const BackgroundElements = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
`;

const FloatingIcon = styled(motion.div)`
  position: absolute;
  color: rgba(0, 0, 0, 0.05);
  font-size: ${props => props.size || '2rem'};
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const Container = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 4rem);
  align-items: center;
  z-index: 1;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
`;

const MainContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 3vw, 1.5rem);

  @media (max-width: 768px) {
    order: 1;
  }
`;

const Greeting = styled(motion.div)`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  color: #666;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Title = styled(motion.h1)`
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1.1;
  color: #000;
  margin: 0;

  @media (max-width: 480px) {
    letter-spacing: 0.02em;
  }
`;

const DynamicRole = styled(motion.div)`
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #333;
  margin: clamp(0.5rem, 2vw, 1rem) 0;
  min-height: clamp(1.5rem, 4vw, 2.5rem);

  @media (max-width: 480px) {
    letter-spacing: 0.05em;
  }
`;

const Description = styled(motion.p)`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.6;
  color: #555;
  margin: clamp(1rem, 3vw, 1.5rem) 0;
  max-width: 500px;

  @media (max-width: 768px) {
    margin: 1rem auto;
  }
`;

const ButtonGroup = styled(motion.div)`
  display: flex;
  gap: 1rem;
  margin-top: clamp(1.5rem, 3vw, 2rem);

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 768px) and (min-width: 641px) {
    justify-content: center;
  }
`;

const Button = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: clamp(0.75rem, 2vw, 1rem) clamp(1.5rem, 3vw, 2rem);
  border-radius: 4px;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  min-width: 200px;

  @media (max-width: 640px) {
    width: 100%;
    min-width: unset;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    transition: all 0.3s ease;
    z-index: 0;
  }

  span {
    position: relative;
    z-index: 1;
  }

  svg {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const PrimaryButton = styled(Button)`
  background: #000;
  color: #fff;
  border: 2px solid #000;

  &:before {
    background: #fff;
  }

  &:hover {
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

    &:before {
      width: 100%;
    }
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #000;
  border: 2px solid #000;

  &:before {
    background: #000;
  }

  &:hover {
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);

    &:before {
      width: 100%;
    }
  }
`;

const StatsSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: clamp(2rem, 4vw, 2.5rem);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    order: 2;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    background: rgba(255, 255, 255, 0.9);
  }
`;

const StatNumber = styled.div`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: #000;
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const QuickInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: #555;
`;

const InfoIcon = styled.div`
  font-size: 1rem;
  color: #000;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  cursor: pointer;

  @media (max-width: 768px) {
    bottom: 1rem;
  }
`;

const ScrollText = styled.span`
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #fff;
  border-radius: 12px;
  padding: clamp(2rem, 5vw, 3rem);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #000;
  }
`;

const ModalTitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: #000;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ModalSubtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #333;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const TextArea = styled.textarea`
  padding: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
  transition: all 0.3s ease;
  background: #fff;

  &:focus {
    outline: none;
    border-color: #000;
    box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #000;
  color: #fff;
  border: 2px solid #000;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    background: #333;
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover:not(:disabled) svg {
    transform: translateX(4px);
  }
`;

// CV Modal Styles
const CVContent = styled.div`
  margin-top: 2rem;
`;

const CVSection = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

const CVSectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #000;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    font-size: 1rem;
    color: #666;
  }
`;

const CVText = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
`;

const CVList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const CVListItem = styled.li`
  background: #f0f0f0;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.875rem;
  color: #333;
  transition: all 0.3s ease;

  &:hover {
    background: #e0e0e0;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #000;
  }

  svg {
    font-size: 1rem;
    color: #000;
  }
`;

const WorkExperience = styled.div`
  margin-top: 1rem;
`;

const JobTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Company = styled.p`
  color: #666;
  font-style: italic;
  margin-bottom: 0.5rem;
`;

const Duration = styled.span`
  font-size: 0.875rem;
  color: #999;
`;

const roles = [
  "Software Developer",
  "Cloud Architect", 
  "Full Stack Engineer",
  "Problem Solver"
];

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! I\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <ModalTitle>Get In Touch</ModalTitle>
        <ModalSubtitle>
          Have a project in mind or want to collaborate? I'd love to hear from you. 
          Send me a message and let's create something amazing together!
        </ModalSubtitle>

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Your Name *</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="What's this about?"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">Message *</Label>
            <TextArea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell me about your project, ideas, or just say hello..."
              required
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            disabled={isSubmitting}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
            <FaPaperPlane />
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const CVModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        
        <ModalTitle>Curriculum Vitae</ModalTitle>
        
        <CVContent>
          {/* <CVSection>
            <CVSectionTitle>
              <FaUser />
              Profile
            </CVSectionTitle>
            <CVText>
              Junior Cloud Technologist with a diploma in ICT Software Development and AWS certifications. 
              Passionate about leveraging technology to drive efficiency and building innovative cloud solutions. 
              Recently achieved AWS Solutions Architect certification and excited to contribute to cutting-edge projects.
            </CVText>
          </CVSection> */}

          <CVSection>
            <CVSectionTitle>
              <FaPhone />
              Contact
            </CVSectionTitle>
            <ContactInfo>
              <ContactItem href="tel:+27638184436">
                <FaPhone />
                +27 (63) 818 4436
              </ContactItem>
              <ContactItem href="mailto:Mkhonzasenzo525@gmail.com">
                <FaEnvelope />
                samukelo.mkhonza@outlook.com
              </ContactItem>
              <ContactItem href="https://www.linkedin.com/in/samukelo-mkhonza-a27340215/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
                LinkedIn Profile
              </ContactItem>
            </ContactInfo>
          </CVSection>

          <CVSection>
            <CVSectionTitle>
              <FaGraduationCap />
              Education
            </CVSectionTitle>
            <JobTitle>National Diploma in ICT - Applications Development</JobTitle>
            <Company>Durban University of Technology • 2022</Company>
            <CVText style={{ marginTop: '0.5rem' }}>
              4-Year Extended Curriculum Programme focusing on software development, web technologies, and database management.
            </CVText>
          </CVSection>

          <CVSection>
            <CVSectionTitle>
              <FaBriefcase />
              Experience
            </CVSectionTitle>
            <WorkExperience>
              <JobTitle>Junior Cloud Technologist (Intern)</JobTitle>
              <Company>CloudZA • <Duration>Dec 2023 - Dec 2024</Duration></Company>
              <CVText>
                Assisted in implementing and maintaining cloud infrastructure, contributed to AWS architecture documentation, 
                and collaborated with senior technologists to optimize AWS solutions.
              </CVText>
            </WorkExperience>
          </CVSection>

          <CVSection>
            <CVSectionTitle>
              <FaCode />
              Technical Skills
            </CVSectionTitle>
            <CVList>
              <CVListItem>Java</CVListItem>
              <CVListItem>Python</CVListItem>
              <CVListItem>JavaScript</CVListItem>
              <CVListItem>React.js</CVListItem>
              <CVListItem>Node.js</CVListItem>
              <CVListItem>AWS Cloud</CVListItem>
              <CVListItem>SQL</CVListItem>
              <CVListItem>Git/GitHub</CVListItem>
            </CVList>
          </CVSection>

          <CVSection>
            <CVSectionTitle>
              <FaCertificate />
              Key Certifications
            </CVSectionTitle>
            <CVList>
              <CVListItem>AWS Cloud Practitioner</CVListItem>
              <CVListItem>AWS Solutions Architect</CVListItem>
              <CVListItem>Fortinet NSE 1-3</CVListItem>
              <CVListItem>Cisco Network Security</CVListItem>
              <CVListItem>Python Essentials</CVListItem>
            </CVList>
          </CVSection>
        </CVContent>
      </ModalContent>
    </ModalOverlay>
  );
};

const Hero = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const scrollToAbout = () => {
    // In a real app, this would scroll to the about section
    console.log('Scrolling to about section...');
  };

  const viewCV = () => {
    setIsCVModalOpen(true);
  };

  const openContact = () => {
    setIsContactModalOpen(true);
  };

  const closeContact = () => {
    setIsContactModalOpen(false);
  };

  const closeCV = () => {
    setIsCVModalOpen(false);
  };

  return (
    <>
      <Section id="hero">
        <BackgroundElements>
          <FloatingIcon size="3rem" duration="8s" delay="0s" style={{ top: '10%', left: '10%' }}>
            <FaCode />
          </FloatingIcon>
          <FloatingIcon size="2.5rem" duration="6s" delay="2s" style={{ top: '70%', right: '15%' }}>
            <FaCloud />
          </FloatingIcon>
          <FloatingIcon size="2rem" duration="7s" delay="4s" style={{ top: '30%', right: '25%' }}>
            <FaRocket />
          </FloatingIcon>
          <FloatingIcon size="2.5rem" duration="9s" delay="1s" style={{ bottom: '20%', left: '20%' }}>
            <FaCode />
          </FloatingIcon>
        </BackgroundElements>

        <Container>
          <MainContent
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Greeting
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span></span>
            </Greeting>

            <Title
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              SAMUKELO MKHONZA
            </Title>

            <DynamicRole
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <TypingText texts={roles} speed={100} pause={2000} />
            </DynamicRole>

            <Description
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Passionate about building scalable cloud-native applications and 
              creating exceptional digital experiences. Currently architecting 
              solutions at CloudZA, transforming ideas into reality.
            </Description>

            <ButtonGroup
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <PrimaryButton
                onClick={openContact}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Get In Touch</span>
                <FaEnvelope />
              </PrimaryButton>
              <SecondaryButton
                onClick={viewCV}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>View CV</span>
                <FaEye />
              </SecondaryButton>
            </ButtonGroup>
          </MainContent>

          <StatsSection
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StatsGrid>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <StatNumber>25+</StatNumber>
                <StatLabel>Projects</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                <StatNumber>3+</StatNumber>
                <StatLabel>Years Exp</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <StatNumber>10+</StatNumber>
                <StatLabel>Technologies</StatLabel>
              </StatCard>
              <StatCard
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <StatNumber>15+</StatNumber>
                <StatLabel>Deployments</StatLabel>
              </StatCard>
            </StatsGrid>

            <QuickInfo>
              <InfoItem>
                <InfoIcon><FaMapMarkerAlt /></InfoIcon>
                <span>Bellville, Western Cape</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaRocket /></InfoIcon>
                <span>Available for Projects</span>
              </InfoItem>
              <InfoItem>
                <InfoIcon><FaCloud /></InfoIcon>
                <span>Cloud Solutions Expert</span>
              </InfoItem>
            </QuickInfo>
          </StatsSection>
        </Container>

        <ScrollIndicator
          onClick={scrollToAbout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2 }}
          whileHover={{ y: 4 }}
        >
          <ScrollText>Explore More</ScrollText>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaArrowDown />
          </motion.div>
        </ScrollIndicator>
      </Section>

      <ContactModal isOpen={isContactModalOpen} onClose={closeContact} />
      <CVModal isOpen={isCVModalOpen} onClose={closeCV} />
    </>
  );
};

export default Hero;