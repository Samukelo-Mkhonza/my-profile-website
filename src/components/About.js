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
import profilePhoto from '../assets/profile-photo-placeholder.svg';

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
  background: var(--bg-secondary-glass, rgba(247, 247, 247, 0.86));
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
  font-weight: 800;
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

/* Half the photo height — how far the photo sinks into the card below it */
const photoOverlap = 'clamp(75px, 11vw, 100px)';

const IntroCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(2rem, 4vw, 2.5rem);
  /* Room for the profile photo overlapping the top edge */
  padding-top: calc(${photoOverlap} + 1.5rem);
  position: relative;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
  }
`;

const ProfileSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const ProfileImageWrap = styled(motion.div)`
  width: clamp(150px, 22vw, 200px);
  aspect-ratio: 1;
  border-radius: 50%;
  margin: 0 auto calc(${photoOverlap} * -1);
  padding: 4px;
  background: var(--border-card, #111);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  cursor: pointer;
  position: relative;
  z-index: 2;
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
  background: var(--bg-card, #fff);
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
  /* Pin to the card's bottom edge so the card fills the grid row cleanly */
  margin-top: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: clamp(3rem, 5vw, 4rem);

  /* Phones: single column, cards stacked */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.5rem, 3vw, 2rem);
  text-align: center;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
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
  font-weight: 800;
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: var(--text-secondary, #666);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
`;

const ValuesSection = styled.div`
  margin-bottom: 0;
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
  grid-template-columns: repeat(4, 1fr);
  gap: clamp(1rem, 2vw, 1.5rem);

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Phones: single column, cards stacked */
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const ValueCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1rem, 2vw, 1.25rem);
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }

  &:hover:before {
    transform: scaleX(1);
  }
`;

const ValueIcon = styled.div`
  font-size: clamp(1.25rem, 2.5vw, 1.5rem);
  color: var(--text-primary, #000);
  margin-bottom: 0.5rem;
`;

const ValueTitle = styled.h4`
  font-size: clamp(0.9375rem, 2vw, 1rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  color: var(--text-primary, #000);
`;

const ValueDescription = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.95rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
`;

const PersonalSection = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: 2px solid var(--border-card, #e0e0e0);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(2rem, 4vw, 2.5rem);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--accent-orange, #ee5a24);
  }
`;

const PersonalText = styled.p`
  font-size: clamp(0.875rem, 2vw, 1rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
`;

const InterestsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  /* Split the card's leftover height evenly when it stretches to match the
     intro column, so the card never shows a dead gap */
  grid-auto-rows: 1fr;
  flex: 1;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
  }
`;

const InterestCard = styled(motion.div)`
  background: var(--tag-bg, #f0f0f0);
  border: 2px solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  padding: clamp(1rem, 2vw, 1.25rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  }
`;

const InterestLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 700;
  color: var(--text-primary, #000);
`;

const InterestNote = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
  line-height: 1.5;
  color: var(--text-secondary, #666);
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
  { icon: FaCoffee, label: 'Coffee Brewing', note: 'Dialing in the perfect pour-over, one cup at a time.' },
  { icon: FaMusic, label: 'Music Production', note: 'Building beats and mixing tracks after hours.' },
  { icon: FaGamepad, label: 'Gaming', note: 'Story-driven worlds and the occasional ranked grind.' },
  { icon: FaCode, label: 'Open Source', note: 'Giving back to the tools I use every day.' }
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
          <ProfileSection
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <ProfileImageWrap
              whileHover={{ scale: 1.06, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <ProfileImg src={profilePhoto} alt="Samukelo Mkhonza" />
            </ProfileImageWrap>
            <IntroCard>
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
          </ProfileSection>

          <PersonalSection
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <SectionTitle>When I'm Not Coding</SectionTitle>
            <PersonalText>
              I believe in maintaining a healthy work-life balance. Here are some things that keep me inspired and motivated outside of development.
            </PersonalText>
            <InterestsGrid>
              {interests.map((interest, index) => (
                <InterestCard
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <InterestLabel>
                    <interest.icon />
                    {interest.label}
                  </InterestLabel>
                  <InterestNote>{interest.note}</InterestNote>
                </InterestCard>
              ))}
            </InterestsGrid>
          </PersonalSection>
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
