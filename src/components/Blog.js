import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const Section = styled.section`
  padding: clamp(2rem, 5vw, 5rem) clamp(1rem, 5vw, 2rem);
  background: #ffffff;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Heading = styled.h2`
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  text-align: center;
  margin-bottom: clamp(2rem, 4vw, 3rem);
`;

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: clamp(1.5rem, 3vw, 2rem);
 
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const BlogCard = styled(motion.article)`
  background: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: clamp(1.5rem, 3vw, 2rem);
  transition: all 0.3s ease;
  cursor: pointer;
 
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #000;
  }
`;

const BlogDate = styled.time`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  display: block;
  margin-bottom: 0.5rem;
`;

const ComingSoonBadge = styled.span`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #000;
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

const BlogTitle = styled.h3`
  font-size: clamp(1.25rem, 3vw, 1.5rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  line-height: 1.3;
`;

const BlogExcerpt = styled.p`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.6;
  color: #333;
  margin-bottom: 1rem;
`;

const ReadMore = styled.span`
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  display: inline-flex;
  align-items: center;
  transition: all 0.3s ease;
 
  &:after {
    content: '→';
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
  }
 
  ${BlogCard}:hover & {
    &:after {
      transform: translateX(4px);
    }
  }
`;

// Modal Styles
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: #ffffff;
  border-radius: 8px;
  padding: clamp(2rem, 5vw, 3rem);
  max-width: 500px;
  width: 100%;
  text-align: center;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: color 0.3s ease;
  
  &:hover {
    color: #000;
  }
`;

const ModalIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1.5rem;
  color: #000;
`;

const ModalTitle = styled.h3`
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
`;

const ModalText = styled.p`
  font-size: clamp(0.875rem, 2.5vw, 1rem);
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
`;

const ModalBlogTitle = styled.h4`
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
`;

// Sample blog posts data
const blogPosts = [
  {
    id: 1,
    title: 'Building Scalable Microservices with AWS',
    excerpt: 'Exploring best practices for designing and deploying microservices architecture on AWS, including service mesh implementation and container orchestration.',
    link: '#'
  },
  {
    id: 2,
    title: 'Optimizing React Performance',
    excerpt: 'Deep dive into React performance optimization techniques, from memo and useMemo to code splitting and lazy loading strategies.',
    link: '#'
  },
  {
    id: 3,
    title: 'Infrastructure as Code with Terraform',
    excerpt: 'How to manage cloud infrastructure efficiently using Terraform, including modules, state management, and CI/CD integration.',
    link: '#'
  }
];

const Blog = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const handleCardClick = (post) => {
    setSelectedPost(post);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPost(null);
  };

  return (
    <Section id="blog">
      <Container>
        <Heading>Blog</Heading>
        <BlogGrid>
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => handleCardClick(post)}
            >
              <ComingSoonBadge>Coming Soon</ComingSoonBadge>
              <BlogTitle>{post.title}</BlogTitle>
              <BlogExcerpt>{post.excerpt}</BlogExcerpt>
              <ReadMore>Read More</ReadMore>
            </BlogCard>
          ))}
        </BlogGrid>
      </Container>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <CloseButton onClick={closeModal}>&times;</CloseButton>
              <ModalIcon>🚀</ModalIcon>
              <ModalTitle>Coming Soon!</ModalTitle>
              {selectedPost && (
                <ModalBlogTitle>"{selectedPost.title}"</ModalBlogTitle>
              )}
              <ModalText>
                I'm working hard to bring you quality content. This blog post will be available soon. 
                Stay tuned for in-depth technical insights and best practices!
              </ModalText>
              <ModalText style={{ fontSize: '0.875rem', fontStyle: 'italic' }}>
                Subscribe to my newsletter to get notified when new content is published.
              </ModalText>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Section>
  );
};

export default Blog;