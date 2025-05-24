import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaEnvelope, 
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaHeart,
  FaCode,
  FaRocket
} from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: linear-gradient(135deg, #000 0%, #1a1a1a 50%, #000 100%);
  color: #fff;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #333, transparent);
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: clamp(3rem, 5vw, 4rem) clamp(1rem, 5vw, 2rem) clamp(2rem, 3vw, 2.5rem);
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: clamp(2rem, 4vw, 3rem);
  margin-bottom: clamp(2rem, 4vw, 3rem);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
  color: #fff;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -0.5rem;
    left: 0;
    width: 3rem;
    height: 2px;
    background: #fff;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #ccc;
  text-decoration: none;
  font-size: clamp(0.875rem, 2vw, 1rem);
  transition: all 0.3s ease;
  padding: 0.75rem;
  border-radius: 4px;
  border: 1px solid transparent;

  &:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateX(8px);
  }
`;

const ContactIcon = styled.div`
  font-size: 1.25rem;
  width: 24px;
  display: flex;
  justify-content: center;
`;

const QuickLinks = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const QuickLinksGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const QuickLink = styled(motion.a)`
  color: #ccc;
  text-decoration: none;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  border-bottom: 1px solid transparent;

  &:hover {
    color: #fff;
    border-bottom-color: #fff;
    transform: translateX(4px);
  }
`;

const NewsletterSection = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const NewsletterForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const NewsletterInput = styled.input`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 0.75rem 1rem;
  color: #fff;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &::placeholder {
    color: #999;
  }

  &:focus {
    outline: none;
    border-color: #fff;
    background: rgba(255, 255, 255, 0.15);
  }
`;

const NewsletterButton = styled(motion.button)`
  background: #fff;
  color: #000;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
  }
`;

const SocialSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2rem);
  margin-bottom: clamp(2rem, 3vw, 2.5rem);
  padding: clamp(1.5rem, 3vw, 2rem);
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
`;

const SocialLink = styled(motion.a)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: clamp(3rem, 4vw, 3.5rem);
  height: clamp(3rem, 4vw, 3.5rem);
  border: 2px solid #333;
  border-radius: 50%;
  color: #ccc;
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: #fff;
    border-radius: 50%;
    transition: all 0.3s ease;
    transform: translate(-50%, -50%);
    z-index: 0;
  }

  &:hover {
    border-color: #fff;
    color: #000;
    transform: translateY(-4px);

    &:before {
      width: 100%;
      height: 100%;
    }
  }

  svg {
    position: relative;
    z-index: 1;
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding-top: clamp(1.5rem, 3vw, 2rem);
  border-top: 1px solid #333;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
  }
`;

const Copyright = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
`;

const MadeWith = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #999;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
`;

const ScrollToTop = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  background: #fff;
  color: #000;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: all 0.3s ease;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }

  @media (max-width: 640px) {
    bottom: 1rem;
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

const Footer = () => {
  const [email, setEmail] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  React.useEffect(() => {
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
    // { href: '#about', label: 'About' },
    { href: '#skills', label: 'Skills' },
    // { href: '#experience', label: 'Experience' },
    { href: '#blog', label: 'Blog' },
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
      href: 'mailto:samukelo.dev@example.com',
      icon: FaEnvelope,
      label: 'Email'
    }
  ];

  return (
    <>
      <FooterContainer id="contact">
        <FooterContent>
          <FooterGrid>
            <ContactSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <SectionTitle>Get In Touch</SectionTitle>
              <ContactInfo>
                <ContactItem 
                  href="mailto:samukelo.dev@example.com"
                  whileHover={{ x: 8 }}
                >
                  <ContactIcon><FaEnvelope /></ContactIcon>
                  samukelo.mkhonza@outlook.com
                </ContactItem>
                <ContactItem 
                  href="tel:+27123456789"
                  whileHover={{ x: 8 }}
                >
                  <ContactIcon><FaPhone /></ContactIcon>
                  +27 (63) 818-4436
                </ContactItem>
                <ContactItem
                  whileHover={{ x: 8 }}
                >
                  <ContactIcon><FaMapMarkerAlt /></ContactIcon>
                  Bellville, Western Cape, ZA
                </ContactItem>
              </ContactInfo>
            </ContactSection>

            <QuickLinks
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <SectionTitle>Quick Links</SectionTitle>
              <QuickLinksGrid>
                {quickLinks.map((link, index) => (
                  <QuickLink
                    key={link.href}
                    href={link.href}
                    whileHover={{ x: 4 }}
                  >
                    {link.label}
                  </QuickLink>
                ))}
              </QuickLinksGrid>
            </QuickLinks>

            <NewsletterSection
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <SectionTitle>Stay Updated</SectionTitle>
              <p style={{ color: '#ccc', fontSize: '0.875rem', lineHeight: '1.6' }}>
                Get notified about new projects and blog posts.
              </p>
              <NewsletterForm onSubmit={handleNewsletterSubmit}>
                <NewsletterInput
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <NewsletterButton
                  type="submit"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Subscribe
                </NewsletterButton>
              </NewsletterForm>
            </NewsletterSection>
          </FooterGrid>

          <SocialSection>
            {socialLinks.map((social, index) => (
              <SocialLink
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                <social.icon />
              </SocialLink>
            ))}
          </SocialSection>

          <FooterBottom>
            <Copyright>
              &copy; {new Date().getFullYear()} Samukelo Mkhonza. All rights reserved.
            </Copyright>
            <MadeWith>
              Made with <FaHeart color="#e74c3c" /> and <FaCode /> in South Africa
            </MadeWith>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      {showScrollTop && (
        <ScrollToTop
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.9 }}
        >
          <FaArrowUp />
        </ScrollToTop>
      )}
    </>
  );
};

export default Footer;