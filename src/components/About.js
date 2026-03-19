import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import {
  FaCode,
  FaCloud,
  FaLightbulb,
  FaUsers,
  FaRocket,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaCoffee,
  FaMusic,
  FaGamepad
} from 'react-icons/fa';

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  width: 1ch;
  background-color: currentColor;
  animation: ${blink} 1s step-start infinite;
`;

const TypingText = ({ text, speed = 40 }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, index + 1));
      index++;
      if (index > text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      <Cursor />
    </span>
  );
};

const Section = styled.section`
  padding: clamp(3rem, 8vw, 6rem) clamp(1rem, 5vw, 2rem);
  background: var(--bg-secondary, #f7f7f7);
  position: relative;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: clamp(1.75rem, 6vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
  color: var(--text-primary, #000);
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 4vw, 3rem);
  margin-bottom: clamp(3rem, 5vw, 4rem);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const IntroCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(2rem, 4vw, 2.5rem);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
  }
`;

const ProfileSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ProfileImage = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--text-primary, #000), var(--text-secondary, #333));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: var(--accent-inverse, #fff);
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &:before {
    content: 'SM';
    font-weight: 700;
    letter-spacing: 0.1em;
  }
`;

const IntroText = styled.p`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.7;
  color: var(--text-secondary, #333);
  margin-bottom: 1.5rem;
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin-bottom: 1rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: clamp(3rem, 5vw, 4rem);
`;

const StatCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 32px var(--shadow-color, rgba(0, 0, 0, 0.15));
    border-color: var(--text-primary, #000);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

const StatIcon = styled.div`
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--text-primary, #000);
  margin-bottom: 1rem;
  transition: transform 0.3s ease;

  ${StatCard}:hover & {
    transform: scale(1.1);
  }
`;

const StatNumber = styled.div`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
`;

const ValuesSection = styled.div`
  margin-bottom: clamp(3rem, 5vw, 4rem);
`;

const SectionTitle = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: clamp(1.5rem, 3vw, 2rem);
  color: var(--text-primary, #000);
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
`;

const ValueCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px var(--shadow-color, rgba(0, 0, 0, 0.15));
    border-color: var(--text-primary, #000);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

const ValueIcon = styled.div`
  font-size: clamp(1.5rem, 3vw, 2rem);
  color: var(--text-primary, #000);
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h4`
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  color: var(--text-primary, #000);
`;

const ValueDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.95rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
`;

const PersonalSection = styled.div`
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-card, #e0e0e0);
  border-radius: 8px;
  padding: clamp(2rem, 4vw, 2.5rem);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--text-primary, #000), var(--text-secondary, #333));
  }
`;

const InterestsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1.5rem;
`;

const InterestTag = styled(motion.span)`
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-secondary, #333);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: var(--text-primary, #000);
    color: var(--accent-inverse, #fff);
    transform: scale(1.05);
  }
`;

const stats = [
  { icon: FaCode, number: '25+', label: 'Projects Completed' },
  { icon: FaCloud, number: '3+', label: 'Years in Cloud' },
  { icon: FaUsers, number: '10+', label: 'Teams Collaborated' },
  { icon: FaRocket, number: '15+', label: 'Apps Deployed' }
];

const values = [
  {
    icon: FaLightbulb,
    title: 'Innovation',
    description: 'Constantly exploring new technologies and approaches to solve complex problems efficiently.'
  },
  {
    icon: FaUsers,
    title: 'Collaboration',
    description: 'Believing that the best solutions come from diverse teams working together towards common goals.'
  },
  {
    icon: FaRocket,
    title: 'Excellence',
    description: 'Committed to delivering high-quality, scalable solutions that exceed expectations.'
  },
  {
    icon: FaGraduationCap,
    title: 'Learning',
    description: 'Embracing continuous learning and staying current with industry trends and best practices.'
  }
];

const interests = [
  { icon: FaCoffee, label: 'Coffee Brewing' },
  { icon: FaMusic, label: 'Music Production' },
  { icon: FaGamepad, label: 'Gaming' },
  { icon: FaCode, label: 'Open Source' }
];

const About = () => (
  <Section id="about">
    <Container>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Heading>
          <TypingText text="About Me" speed={100} />
        </Heading>

        <MainContent>
          <IntroCard
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <IntroText>
              <TypingText
                text="I'm a passionate software developer specializing in cloud-native infrastructures and high-performance applications. Currently, I architect solutions at CloudZA, leveraging AWS to build scalable, secure systems that drive business growth."
                speed={20}
              />
            </IntroText>
            <IntroText>
              My journey in technology spans over 5 years, during which I've had the privilege of working with cutting-edge technologies and contributing to projects that make a real difference. I believe in writing clean, maintainable code and creating solutions that not only work but scale beautifully.
            </IntroText>
            <LocationInfo>
              <FaMapMarkerAlt />
              <span>Bellville, Western Cape, South Africa</span>
            </LocationInfo>
          </IntroCard>

          <ProfileSection
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <ProfileImage />
            <PersonalSection>
              <SectionTitle>When I'm Not Coding</SectionTitle>
              <p style={{
                fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                lineHeight: '1.6',
                color: 'var(--text-secondary, #666)',
                marginBottom: '1rem'
              }}>
                I believe in maintaining a healthy work-life balance. Here are some things that keep me inspired and motivated outside of development.
              </p>
              <InterestsList>
                {interests.map((interest, index) => (
                  <InterestTag
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <interest.icon />
                    {interest.label}
                  </InterestTag>
                ))}
              </InterestsList>
            </PersonalSection>
          </ProfileSection>
        </MainContent>

        <StatsGrid>
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              <StatIcon>
                <stat.icon />
              </StatIcon>
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>

        <ValuesSection>
          <SectionTitle>My Approach</SectionTitle>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <ValueIcon>
                  <value.icon />
                </ValueIcon>
                <ValueTitle>{value.title}</ValueTitle>
                <ValueDescription>{value.description}</ValueDescription>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesSection>
      </motion.div>
    </Container>
  </Section>
);

export default About;
