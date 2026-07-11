import React, { useState, useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion, useReducedMotion } from 'framer-motion';
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

/* ─── Typing accent (heading only) ────────────────────────────────────────── */

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
`;

const Cursor = styled.span`
  display: inline-block;
  margin-left: 2px;
  width: 1ch;
  background-color: currentColor;
  animation: ${p => (p.$done ? 'none' : css`${blink} 1s step-start infinite`)};
  opacity: ${p => (p.$done ? 0 : 1)};
  transition: opacity 0.6s ease;
`;

/* Types once when `start` flips true; renders instantly under reduced motion.
   Screen readers get the full text via aria-label rather than char-by-char. */
const TypingText = ({ text, speed = 40, start = true }) => {
  const reducedMotion = useReducedMotion();
  const instant = reducedMotion || !window.matchMedia;
  const [displayed, setDisplayed] = useState(instant ? text : '');
  const [done, setDone] = useState(instant);

  useEffect(() => {
    if (instant) { setDisplayed(text); setDone(true); return undefined; }
    if (!start) return undefined;
    let index = 0;
    setDisplayed('');
    setDone(false);
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, start, instant]);

  return (
    <span aria-label={text}>
      <span aria-hidden="true">{displayed}</span>
      <Cursor $done={done} aria-hidden="true" />
    </span>
  );
};

/* ─── Layout ──────────────────────────────────────────────────────────────── */

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

  @media (max-width: 480px) {
    padding: clamp(2rem, 6vw, 3rem) clamp(0.75rem, 3vw, 1.5rem);
  }
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(0.5rem, 2vw, 1rem);
`;

const Heading = styled(motion.h2)`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: center;
  margin-bottom: clamp(1rem, 2vw, 1.5rem);
  color: var(--text-primary, #000);
  position: relative;
  &:after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: clamp(60px, 10vw, 100px);
    height: 3px;
    background: var(--text-primary, #000);
  }
  @media (max-width: 480px) { font-size: clamp(1.5rem, 6vw, 2rem); }
`;

const Subtitle = styled(motion.p)`
  text-align: center;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1.0625rem);
  line-height: 1.6;
  max-width: 600px;
  margin: clamp(1.5rem, 3vw, 2rem) auto clamp(2rem, 4vw, 3rem);
`;

/* ─── Feature card (focal point: photo + bio + stats) ─────────────────────── */

const FeatureCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard-lg, 6px 6px 0 #111);
  padding: clamp(1.25rem, 4vw, 2.5rem);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 6px;
    background: var(--accent-orange, #ee5a24);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 3vw, 2rem);
  align-items: start;

  @media (min-width: 769px) {
    grid-template-columns: minmax(220px, 280px) 1fr;
    gap: clamp(2rem, 4vw, 3rem);
  }
`;

const PhotoColumn = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 0.5rem;

  @media (min-width: 769px) {
    position: sticky;
    top: 1rem;
  }
`;

const PhotoFrame = styled(motion.div)`
  width: clamp(180px, 45vw, 240px);
  aspect-ratio: 1;
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  background: var(--tag-bg, #f0f0f0);
  position: relative;

  @media (min-width: 769px) {
    width: 100%;
    max-width: 260px;
  }
`;

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: calc(var(--radius-sm, 10px) - 2px);
  display: block;
`;

const PhotoBadge = styled.span`
  position: absolute;
  bottom: -0.875rem;
  left: 50%;
  transform: translateX(-50%) rotate(-3deg);
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  background: var(--accent-orange, #ee5a24);
  color: var(--on-orange, #fff);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-pill, 999px);
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  white-space: nowrap;
`;

const BioColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const Overline = styled.span`
  color: var(--accent-orange, #ee5a24);
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
`;

const Name = styled.h3`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-primary, #000);
  margin-bottom: 0.25rem;
`;

const RoleLine = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted, #888);
  margin-bottom: clamp(1rem, 2.5vw, 1.5rem);
`;

const IntroText = styled.p`
  font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
  line-height: 1.7;
  color: var(--text-secondary, #333);
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    text-align: left;
  }
`;

const LocationInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary, #666);
  font-size: clamp(0.875rem, 2vw, 1rem);
  margin-top: auto;

  svg { color: var(--accent-orange, #ee5a24); flex-shrink: 0; }

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

/* Divider-line trick: the strip's background shows through the gaps between
   cells, drawing crisp 2px separators for any row/column count. */
const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--border-w, 2px);
  background: var(--border-card, #111);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  overflow: hidden;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  @media (min-width: 720px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatCell = styled.div`
  background: var(--bg-card, #fff);
  padding: clamp(1rem, 2.5vw, 1.5rem) clamp(0.5rem, 1.5vw, 1rem);
  text-align: center;
  transition: background-color 0.3s ease;

  @media (hover: hover) {
    &:hover { background: var(--tag-bg, #f0f0f0); }
  }
`;

const StatIcon = styled.div`
  font-size: clamp(1.125rem, 2.5vw, 1.375rem);
  color: var(--accent-orange, #ee5a24);
  margin-bottom: 0.375rem;
`;

const StatNumber = styled.div`
  font-size: clamp(1.375rem, 3.5vw, 2rem);
  font-weight: 800;
  color: var(--text-primary, #000);
  line-height: 1.2;
`;

const StatLabel = styled.div`
  font-size: clamp(0.6875rem, 1.75vw, 0.8125rem);
  color: var(--text-muted, #666);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 700;
  margin-top: 0.25rem;
`;

/* ─── Detail cards (values + interests as compact lists) ──────────────────── */

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(1.5rem, 3vw, 2rem);
  margin-top: clamp(1.5rem, 3vw, 2.5rem);

  @media (min-width: 900px) {
    grid-template-columns: 1fr 1fr;
    align-items: stretch;
  }
`;

const ListCard = styled(motion.div)`
  background: var(--bg-card, #ffffff);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-card, 14px);
  box-shadow: var(--shadow-hard, 4px 4px 0 #111);
  padding: clamp(1.25rem, 3vw, 2rem);
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

const CardTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-size: clamp(1.0625rem, 2.5vw, 1.25rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-primary, #000);
  margin-bottom: 0.75rem;

  &:before {
    content: '';
    width: 12px;
    height: 12px;
    flex-shrink: 0;
    background: var(--accent-orange, #ee5a24);
    border: var(--border-w, 2px) solid var(--border-card, #111);
  }
`;

const CardLede = styled.p`
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  line-height: 1.6;
  color: var(--text-secondary, #666);
  margin-bottom: 0.5rem;
`;

const RowList = styled.ul`
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
`;

/* Rows animate opacity only (via framer) so the CSS hover transform below
   is never fought by a leftover inline transform. */
const Row = styled(motion.li)`
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: clamp(0.75rem, 2vw, 0.875rem) 0.5rem;
  border-radius: var(--radius-sm, 10px);
  transition: background-color 0.3s ease, transform 0.3s ease;

  & + & {
    border-top: 2px dashed var(--border-color, rgba(17, 17, 17, 0.15));
  }

  @media (hover: hover) {
    &:hover {
      background: var(--tag-bg, #f0f0f0);
      transform: translateX(4px);
    }
  }
`;

const RowIcon = styled.span`
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: var(--tag-bg, #f0f0f0);
  color: var(--text-primary, #000);
  border: var(--border-w, 2px) solid var(--border-card, #111);
  border-radius: var(--radius-sm, 10px);
  font-size: 1.125rem;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (hover: hover) {
    ${Row}:hover & {
      background: var(--accent-orange, #ee5a24);
      color: var(--on-orange, #fff);
    }
  }
`;

const RowBody = styled.div`
  min-width: 0;
`;

const RowTitle = styled.h4`
  font-size: clamp(0.875rem, 2vw, 0.9375rem);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-primary, #000);
  margin-bottom: 0.25rem;
`;

const RowNote = styled.p`
  font-size: clamp(0.8125rem, 2vw, 0.875rem);
  line-height: 1.55;
  color: var(--text-secondary, #666);
`;

/* ─── Data ────────────────────────────────────────────────────────────────── */

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

/* ─── Component ───────────────────────────────────────────────────────────── */

const About = () => {
  const reducedMotion = useReducedMotion();
  const [headingSeen, setHeadingSeen] = useState(false);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: reducedMotion ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
    viewport: { once: true, margin: '-40px' },
  });

  const rowFade = (index) => ({
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    transition: { duration: 0.35, delay: index * 0.06 },
    viewport: { once: true },
  });

  return (
    <Section id="about">
      <Container>
        <Heading
          {...fadeUp()}
          onViewportEnter={() => setHeadingSeen(true)}
        >
          <TypingText text="About Me" speed={90} start={headingSeen} />
        </Heading>
        <Subtitle {...fadeUp(0.1)}>
          Cloud technologist by day, coffee and beats enthusiast by night.
        </Subtitle>

        <FeatureCard {...fadeUp(0.15)}>
          <FeatureGrid>
            <PhotoColumn>
              <PhotoFrame
                style={{ rotate: reducedMotion ? 0 : -2 }}
                whileHover={reducedMotion ? undefined : { rotate: 0, scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <ProfileImg src={profilePhoto} alt="Samukelo Mkhonza" />
                <PhotoBadge>
                  <FaCloud aria-hidden="true" />
                  Cloud Native
                </PhotoBadge>
              </PhotoFrame>
            </PhotoColumn>

            <BioColumn>
              <Overline>{'// hello, I\'m'}</Overline>
              <Name>Samukelo Mkhonza</Name>
              <RoleLine>Software Developer · Cloud Technologist</RoleLine>
              <IntroText>
                I'm a passionate software developer specializing in cloud-native infrastructures and high-performance applications. Currently, I architect solutions at CloudZA, leveraging AWS to build scalable, secure systems that drive business growth.
              </IntroText>
              <IntroText>
                My journey in technology spans over 5 years, during which I've had the privilege of working with cutting-edge technologies and contributing to projects that make a real difference. I believe in writing clean, maintainable code and creating solutions that not only work but scale beautifully.
              </IntroText>
              <LocationInfo>
                <FaMapMarkerAlt aria-hidden="true" />
                <span>Bellville, Western Cape, South Africa</span>
              </LocationInfo>
            </BioColumn>
          </FeatureGrid>

          <StatsStrip>
            {stats.map((stat) => (
              <StatCell key={stat.label}>
                <StatIcon aria-hidden="true">
                  <stat.icon />
                </StatIcon>
                <StatNumber>{stat.number}</StatNumber>
                <StatLabel>{stat.label}</StatLabel>
              </StatCell>
            ))}
          </StatsStrip>
        </FeatureCard>

        <DetailsGrid>
          <ListCard {...fadeUp(0.1)}>
            <CardTitle>My Approach</CardTitle>
            <CardLede>
              The principles that shape how I build software and work with people.
            </CardLede>
            <RowList>
              {values.map((value, index) => (
                <Row key={value.title} {...rowFade(index)}>
                  <RowIcon aria-hidden="true">
                    <value.icon />
                  </RowIcon>
                  <RowBody>
                    <RowTitle>{value.title}</RowTitle>
                    <RowNote>{value.description}</RowNote>
                  </RowBody>
                </Row>
              ))}
            </RowList>
          </ListCard>

          <ListCard {...fadeUp(0.2)}>
            <CardTitle>When I'm Not Coding</CardTitle>
            <CardLede>
              I believe in maintaining a healthy work-life balance. Here's what keeps me inspired outside of development.
            </CardLede>
            <RowList>
              {interests.map((interest, index) => (
                <Row key={interest.label} {...rowFade(index)}>
                  <RowIcon aria-hidden="true">
                    <interest.icon />
                  </RowIcon>
                  <RowBody>
                    <RowTitle>{interest.label}</RowTitle>
                    <RowNote>{interest.note}</RowNote>
                  </RowBody>
                </Row>
              ))}
            </RowList>
          </ListCard>
        </DetailsGrid>
      </Container>
    </Section>
  );
};

export default About;
