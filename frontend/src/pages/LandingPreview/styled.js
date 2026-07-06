import styled from 'styled-components';

export const Container = styled.div`
  background-color: #0b1121;
  background-image: radial-gradient(
    ellipse at 50% 0%,
    rgba(99, 102, 241, 0.15) 0%,
    rgba(30, 41, 59, 0.4) 35%,
    #0b1121 80%
  );
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const Navbar = styled.nav`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  width: 100%;
  box-sizing: border-box;

  &::after {
    content: '';
  }

  @media (max-width: 768px) {
    display: flex;
    justify-content: space-between;

    &::after {
      display: none;
    }
  }
`;

export const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #f8fafc;
`;

export const NavMenu = styled.div`
  display: flex;
  gap: 32px;

  a {
    color: #94a3b8;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
    padding-bottom: 4px;

    &.active {
      color: #f8fafc;
      border-bottom: 2px solid #f8fafc;
    }

    &:hover {
      color: #f8fafc;
    }
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Hero = styled.header`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 80px;
  width: 100%;
  box-sizing: border-box;
  text-align: left;
`;

export const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #f8fafc;

  span {
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background: linear-gradient(135deg, #a5b4fc 0%, #818cf8 50%, #c7d2fe 100%);
    background-size: 200% auto;
    animation: shine 5s linear infinite;
    background-clip: text;
  }

  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const HeroDescription = styled.p`
  color: #94a3b8;
  font-size: 1.125rem;
  line-height: 1.6;
  max-width: 650px;
  margin-bottom: 40px;
`;

export const HeroActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-start;
`;

export const PrimaryButton = styled.button`
  background-color: #c7d2fe;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  height: 44px;
  padding: 0 24px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  &.small {
    height: 36px;
    padding: 0 20px;
    border-radius: 20px;
  }
`;

export const SecondaryButton = styled.button`
  background-color: transparent;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #f8fafc;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  height: 44px;
  padding: 0 24px;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: #f8fafc;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  max-width: 1200px;
  margin: 0 auto 24px;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
`;

export const BentoSection = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(6, 1fr);
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-color: #111827;
  border: 1px solid #1f2937;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  padding: 24px 32px 32px 32px;
  position: relative;
  transition:
    transform 0.3s ease,
    border-color 0.3s ease;
  z-index: 1;

  &:hover {
    border-color: #374151;
    transform: translateY(-4px);
    z-index: 100;
  }

  &.large {
    grid-column: span 3;
    min-height: 450px;
  }

  &.small {
    grid-column: span 2;
    min-height: 240px;
  }

  @media (max-width: 1024px) {
    &.large {
      grid-column: span 2;
    }
    &.small {
      grid-column: span 1;
    }
  }
  @media (max-width: 768px) {
    &.large,
    &.small {
      grid-column: span 1;
    }
  }
`;

export const CardHeader = styled.div`
  margin-top: ${(props) => (props.$small ? '8px' : '16px')};
`;

export const CardTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f8fafc;
`;

export const CardDescription = styled.p`
  color: #94a3b8;
  font-size: 14px;
  line-height: 1.6;
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${(props) => (props.$plain ? 'transparent' : '#1f2937')};
  border: ${(props) => (props.$plain ? 'none' : '1px solid #374151')};
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
`;

export const TagGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: ${(props) => (props.$bottom ? 'auto' : '0')};
  margin-bottom: ${(props) => (props.$bottom ? '0' : '20px')};
`;

export const Tag = styled.span`
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 20px;
  color: #cbd5e1;
  font-size: 11px;
  padding: 4px 12px;
`;

export const ImageWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  margin-top: 24px;
  position: relative;
  width: 100%;
`;

export const PreviewImage = styled.img`
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  height: auto;
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 2;

  &:hover {
    cursor: zoom-in;
    transform: scale(2);
    z-index: 100;
  }
`;

export const GitHubLink = styled.a`
  color: #94a3b8;
  position: absolute;
  right: 24px;
  top: 32px;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
  z-index: 20;

  &:hover {
    color: #f8fafc;
    transform: translateY(-2px);
  }
`;

export const LinkedinLink = styled.a`
  color: #94a3b8;
  position: absolute;
  right: 24px;
  top: 32px;
  transition:
    color 0.3s ease,
    transform 0.3s ease;
  z-index: 20;

  &:hover {
    color: #f8fafc;
    transform: translateY(-2px);
  }
`;

export const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  width: 100%;
  box-sizing: border-box;
  border-top: 1px solid #1f2937;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
  }
`;

export const FooterLogo = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #f8fafc;
`;

export const FooterText = styled.p`
  color: #94a3b8;
  font-size: 13px;
`;

export const FooterLinks = styled.div`
  display: flex;
  gap: 20px;

  a {
    color: #94a3b8;
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #f8fafc;
    }
  }
`;
