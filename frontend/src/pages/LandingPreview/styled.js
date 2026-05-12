import styled from 'styled-components';

export const Container = styled.div`
  background-color: #12121c;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
`;

export const Hero = styled.header`
  padding: 100px 20px 60px;
  text-align: center;
`;

export const HeroTitle = styled.h1`
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background: linear-gradient(135deg, #fff 0%, #808b9d 100%);
  background-clip: text;
  font-size: 4rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 20px 0;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroDescription = styled.p`
  color: #808b9d;
  font-size: 1.25rem;
  line-height: 1.6;
  margin: 0 auto 40px;
  max-width: 600px;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
`;

export const HeroButton = styled.button`
  background: #2196f3;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  height: 52px;
  padding: 0 32px;
  text-transform: uppercase;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }
`;

export const BentoSection = styled.section`
  display: grid;
  gap: 20px;
  grid-auto-rows: 200px;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-auto-rows: auto;
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background: #1b1b25;
  border: 1px solid #2d2d3d;
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  position: relative;
  transition: all 0.3s ease;
  z-index: 1;

  &:hover {
    border-color: #2196f3;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    transform: translateY(-5px);
    z-index: 10;
  }

  &.featured, &.tall, &.wide, &.sagas, &.node {
    grid-column: span 2;
    grid-row: span 2;
  }
`;

export const CardHeader = styled.div`
  margin-top: ${(props) => (props.$small ? '15px' : '20px')};
`;

export const CardTitle = styled.h3`
  font-size: ${(props) => (props.as === 'h4' ? '18px' : '20px')};
  margin-bottom: ${(props) => (props.as === 'h4' ? '0' : '10px')};
`;

export const CardDescription = styled.p`
  color: #808b9d;
  font-size: ${(props) => (props.$small ? '12px' : '14px')};
  line-height: 1.5;
  margin-top: ${(props) => (props.$small ? '5px' : '0')};
`;

export const Footer = styled.footer`
  border-top: 1px solid #2d2d3d;
  margin-top: 60px;
  padding: 40px 20px;
  text-align: center;
`;

export const FooterText = styled.p`
  color: #808b9d;
  font-size: 14px;
`;

export const GitHubLink = styled.a`
  color: #808b9d;
  opacity: 0.4;
  position: absolute;
  right: 24px;
  top: 24px;
  transition: all 0.3s ease;
  z-index: 20;

  &:hover {
    color: #2196f3;
    opacity: 1;
    transform: translateY(-2px);
  }
`;

export const ImageWrapper = styled.div`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: 20px;
  min-height: 0;
  overflow: visible;
  position: relative;
  width: 100%;
`;

export const LinkedinLink = styled.a`
  color: #808b9d;
  opacity: 0.4;
  position: absolute;
  right: 24px;
  top: 24px;
  transition: all 0.3s ease;
  z-index: 20;

  &:hover {
    color: #2196f3;
    opacity: 1;
    transform: translateY(-2px);
  }
`;

export const PreviewImage = styled.img`
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  height: auto;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  width: auto;
  z-index: 2;

  &:hover {
    cursor: zoom-in;
    transform: scale(2.0);
    z-index: 100;
  }
`;

export const SecondaryButton = styled.button`
  background: transparent;
  border: 1px solid #2d2d3d;
  border-radius: 12px;
  color: #ffffff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  height: 52px;
  padding: 0 32px;
  text-transform: uppercase;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #ffffff;
  }
`;
