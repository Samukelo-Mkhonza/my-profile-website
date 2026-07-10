import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub,
  FaLinkedin,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowUp,
  FaHeart,
  FaCode,
  FaPaperPlane
} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: #111111;
  color: #fffcf5;
  border-top: 2px solid var(--border-card, #111);
  position: relative;
  overflow: hidden;
  margin-top: clamp(3rem, 8vw, 6rem);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }

  @media (max-width: 480px) {
    margin-top: clamp(2rem, 6vw, 3rem);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(2.5rem, 5vw, 3.5rem) clamp(1rem, 4vw, 2rem) clamp(1.25rem, 3vw, 1.75rem);

  @media (max-width: 480px) {
    padding: 2rem 1rem 1.25rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 1.2fr 1.1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  margin-bottom: clamp(1.75rem, 3vw, 2.5rem);

  @media (max-width: 900px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const BrandSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;

  @media (max-width: 640px) {
    align-items: center;
    text-align: center;
  }
`;

const Wordmark = styled.a`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #fff;
  text-decoration: none;
  line-height: 1.2;

  span {
    color: var(--accent-orange, #ee5a24);
  }
`;

const Tagline = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8125rem;
  line-height: 1.6;
  max-width: 32ch;
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
`;

const ContactItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.8125rem;
  padding: 0.3rem 0;
  transition: color 0.3s ease;
  word-break: break-word;

  @media (hover: hover) {
    &:hover {
      color: #fff;
    }
  }

  @media (max-width: 768px) {
    min-height: 44px;
  }

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const ContactIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9375rem;
  color: var(--accent-orange, #ee5a24);
  flex-shrink: 0;
`;

const SocialRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 640px) {
    justify-content: center;
  }
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.75);
  font-size: 1.125rem;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background: #fffcf5;
      border-color: #fffcf5;
      color: #111;
      transform: translateY(-3px);
      box-shadow: 3px 3px 0 rgba(255, 255, 255, 0.25);
    }
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SectionTitle = styled.h3`
  font-size: 0.9375rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 1rem;
  color: #fff;
  position: relative;
  padding-bottom: 0.625rem;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 2.5rem;
    height: 3px;
    background: var(--accent-orange, #ee5a24);
  }

  @media (max-width: 640px) {
    display: flex;
    flex-direction: column;
    align-items: center;

    &:after {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

const LinksSection = styled(motion.div)`
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    align-items: center;
    text-align: center;
  }
`;

const LinksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.125rem 1.5rem;

  @media (max-width: 640px) {
    width: 100%;
    max-width: 320px;
    text-align: left;
  }
`;

const FooterLink = styled(motion.a)`
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.3rem 0;
  min-height: 28px;
  transition: color 0.3s ease;

  &:before {
    content: '/';
    color: var(--accent-orange, #ee5a24);
    opacity: 0.4;
    margin-right: 0.5em;
    transition: opacity 0.3s ease;
  }

  @media (hover: hover) {
    &:hover {
      color: #fff;

      &:before {
        opacity: 1;
      }
    }
  }

  @media (max-width: 768px) {
    min-height: 44px;
  }
`;

const NewsletterSection = styled(motion.div)`
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    grid-column: 1 / -1;
    max-width: 480px;
  }

  @media (max-width: 640px) {
    align-items: center;
    text-align: center;
    max-width: none;
    width: 100%;
  }
`;

const NewsletterDescription = styled.p`
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8125rem;
  line-height: 1.6;
  margin-bottom: 1rem;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 400px;

  @media (min-width: 481px) {
    flex-direction: row;
  }
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--radius-pill, 999px);
  padding: 0.7rem 1.1rem;
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 0;
  min-height: 44px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: var(--accent-orange, #ee5a24);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 3px rgba(238, 90, 36, 0.25);
  }

  @media (max-width: 640px) {
    text-align: center;
  }
`;

const NewsletterButton = styled(motion.button)`
  background: #fffcf5;
  color: #111;
  border: 2px solid #fffcf5;
  border-radius: var(--radius-pill, 999px);
  box-shadow: 3px 3px 0 rgba(255, 255, 255, 0.3);
  padding: 0.7rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      background: var(--accent-orange, #ee5a24);
      border-color: var(--accent-orange, #ee5a24);
      color: var(--on-orange, #fff);
      transform: translateY(-2px);
      box-shadow: 4px 4px 0 rgba(255, 255, 255, 0.3);
    }
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.5;
`;

const MadeWith = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.5;

  svg {
    color: #e74c3c;
    animation: pulse 1.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
`;

const EasterEggHint = styled.span`
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  cursor: default;
  user-select: none;
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: clamp(1.5rem, 4vw, 2.5rem);
  right: clamp(1.5rem, 4vw, 2.5rem);
  width: clamp(2.75rem, 6vw, 3.5rem);
  height: clamp(2.75rem, 6vw, 3.5rem);
  background: var(--accent-orange, #ee5a24);
  color: var(--on-orange, #fff);
  border: 2px solid var(--border-card, #111);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 2.5vw, 1.375rem);
  cursor: pointer;
  box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  z-index: 1000;
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hard, 4px 4px 0 #111);
    }
  }

  &:active {
    transform: scale(0.95);
  }

  /* Small mobile */
  @media (max-width: 640px) {
    bottom: clamp(1rem, 3vw, 1.5rem);
    right: clamp(1rem, 3vw, 1.5rem);
    width: clamp(2.5rem, 7vw, 3rem);
    height: clamp(2.5rem, 7vw, 3rem);
    font-size: clamp(0.875rem, 3vw, 1.125rem);
  }

  /* Very small screens */
  @media (max-width: 360px) {
    bottom: 0.75rem;
    right: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
    font-size: 0.875rem;
    box-shadow: var(--shadow-hard-sm, 3px 3px 0 #111);
  }

  /* Landscape mobile */
  @media (max-height: 500px) and (orientation: landscape) {
    bottom: 0.75rem;
    right: 0.75rem;
    width: 2.25rem;
    height: 2.25rem;
  }
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Handle newsletter signup
    alert('Thanks for your interest! Newsletter functionality coming soon.');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { href: '#hero', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#skills', label: 'Skills' },
    { href: '#projects', label: 'Projects' },
    { href: '#blog', label: 'Blog' },
    // Hash-routed extra pages (see src/components/SitePages.js)
    { href: '#/now', label: 'Now' },
    { href: '#/uses', label: 'Uses' },
    { href: '#/til', label: 'TIL' },
    { href: '#/case-studies', label: 'Case Studies' },
    { href: '#/changelog', label: 'Changelog' },
    { href: '#/playground', label: 'Playground' },
    { href: '#/terminal', label: 'Terminal' },
  ];

  const socialLinks = [
    {
      href: 'https://github.com/Samukelo-Mkhonza',
      icon: FaGithub,
      label: 'GitHub'
    },
    {
      href: 'https://www.linkedin.com/in/samukelo-mkhonza-a27340215/',
      icon: FaLinkedin,
      label: 'LinkedIn'
    },
    {
      href: 'mailto:samukelo.mkhonza@outlook.com',
      icon: FaEnvelope,
      label: 'Email'
    }
  ];

  return (
    <>
      <FooterContainer id="contact">
        <FooterContent>
          <FooterGrid>
            <BrandSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <Wordmark href="#hero">
                Samukelo Mkhonza<span>.</span>
              </Wordmark>
              <Tagline>
                Software developer building clean, playful things for the web
                from the Western Cape.
              </Tagline>
              <ContactList>
                <ContactItem
                  href="mailto:samukelo.mkhonza@outlook.com"
                  whileTap={{ scale: 0.98 }}
                >
                  <ContactIcon><FaEnvelope /></ContactIcon>
                  samukelo.mkhonza@outlook.com
                </ContactItem>
                <ContactItem as="div">
                  <ContactIcon><FaMapMarkerAlt /></ContactIcon>
                  Bellville, Western Cape, ZA
                </ContactItem>
              </ContactList>
              <SocialRow>
                {socialLinks.map((social) => (
                  <SocialLink
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileTap={{ scale: 0.95 }}
                  >
                    <social.icon />
                  </SocialLink>
                ))}
              </SocialRow>
            </BrandSection>

            <LinksSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionTitle>Explore</SectionTitle>
              <LinksGrid>
                {quickLinks.map((link) => (
                  <FooterLink
                    key={link.href}
                    href={link.href}
                    whileTap={{ scale: 0.98 }}
                  >
                    {link.label}
                  </FooterLink>
                ))}
              </LinksGrid>
            </LinksSection>

            <NewsletterSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <SectionTitle>Stay Updated</SectionTitle>
              <NewsletterDescription>
                Get notified about new projects, blog posts, and tech insights.
              </NewsletterDescription>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <NewsletterButton
                  type="submit"
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                  <FaPaperPlane />
                </NewsletterButton>
              </NewsletterForm>
            </NewsletterSection>
          </FooterGrid>

          <FooterBottom>
            <Copyright>
              &copy; {new Date().getFullYear()} Samukelo Mkhonza. All rights reserved.
            </Copyright>
            <MadeWith>
              Made with <FaHeart /> and <FaCode /> in South Africa
            </MadeWith>
            <EasterEggHint>↑↑↓↓←→←→BA</EasterEggHint>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      <AnimatePresence>
        {showScrollTop && (
          <ScrollToTop
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Scroll to top"
          >
            <FaArrowUp />
          </ScrollToTop>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
