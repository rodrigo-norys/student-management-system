import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  FaShieldAlt,
  FaThLarge,
  FaCode,
  FaLayerGroup,
  FaDatabase,
  FaGithub,
  FaLinkedin,
} from 'react-icons/fa';
import * as authActions from 'store/modules/auth/actions';
import * as Styled from './styled.js';

import tableGrid from 'assets/images/table-grid.gif';
import tableStatic from 'assets/images/table-preview.png';
import httponlyGif from 'assets/images/httponly.gif';
import securityStatic from 'assets/images/httponly-preview.jpg';
import cepGif from 'assets/images/cep.gif';
import cepStatic from 'assets/images/cep-preview.jpg';
import sagasStatic from 'assets/images/sagas.png';
import studentGif from 'assets/images/studentGif.gif';
import studentStatic from 'assets/images/studentStatic.jpg';

function InteractivePreview({ staticSrc, gifSrc, altText, isCode }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Styled.PreviewImage
      $isCode={isCode}
      alt={altText}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      src={isHovered ? gifSrc : staticSrc}
    />
  );
}

export default function LandingPreview() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Styled.Container>
      <Styled.Navbar>
        <Styled.Logo>Portfólio</Styled.Logo>
        <Styled.NavMenu>
          <a href="#funcionalidades" className="active">
            Funcionalidades
          </a>
          <a href="#contact">Contact</a>
        </Styled.NavMenu>
      </Styled.Navbar>

      <Styled.Hero>
        <Styled.HeroTitle>
          Gestão Escolar com <br /> <span>Engenharia de Ponta.</span>
        </Styled.HeroTitle>
        <Styled.HeroDescription>
          Transformando complexidade em eficiência com arquiteturas fullstack de
          alta performance, foco total em segurança e usabilidade.
        </Styled.HeroDescription>
        <Styled.HeroActions>
          <Styled.PrimaryButton
            onClick={() => dispatch(authActions.demoLoginRequest())}
          >
            Acessar demo
          </Styled.PrimaryButton>
          <Styled.SecondaryButton onClick={() => navigate('/login')}>
            Entrar
          </Styled.SecondaryButton>
        </Styled.HeroActions>
      </Styled.Hero>

      <Styled.SectionTitle>Funcionalidades em Destaque</Styled.SectionTitle>

      <Styled.BentoSection>
        {/* Card 1: Dashboard Dinâmico */}
        <Styled.Card className="large">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/tree/main/frontend/src/pages/Student/StudentList/components"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver componentes no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>
          <FaThLarge
            size={32}
            color="#94a3b8"
            style={{ marginBottom: '20px' }}
          />
          <Styled.CardHeader>
            <Styled.CardTitle>Dashboard Dinâmico</Styled.CardTitle>
            <Styled.CardDescription>
              Visualização fluida entre Grid e Table. Foco na manutenção da
              identidade visual mesmo com alta densidade de dados.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="Demonstração do Dashboard"
              gifSrc={tableGrid}
              staticSrc={tableStatic}
            />
          </Styled.ImageWrapper>
        </Styled.Card>

        {/* Card 2: Segurança */}
        <Styled.Card className="large">
          <Styled.LinkedinLink
            href="https://www.linkedin.com/feed/update/urn:li:activity:7449506572998692865/"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver documentação no Linkedin"
          >
            <FaLinkedin size={20} />
          </Styled.LinkedinLink>
          <FaShieldAlt
            size={32}
            color="#94a3b8"
            style={{ marginBottom: '20px' }}
          />
          <Styled.CardHeader>
            <Styled.CardTitle>Segurança de Elite</Styled.CardTitle>
            <Styled.CardDescription>
              Implementação de JWT via HttpOnly Cookies. Proteção robusta contra
              XSS e persistência segura de sessão.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="Segurança JWT HttpOnly"
              gifSrc={httponlyGif}
              staticSrc={securityStatic}
            />
          </Styled.ImageWrapper>
          <Styled.TagGroup $bottom></Styled.TagGroup>
        </Styled.Card>

        {/* Card 3: Formulários */}
        <Styled.Card className="small">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>
          <FaLayerGroup
            size={32}
            color="#94a3b8"
            style={{ marginBottom: '11px' }}
          />
          <Styled.CardHeader>
            <Styled.CardTitle>Formulários Inteligentes</Styled.CardTitle>
            <Styled.CardDescription>
              Integração avançada com APIs de endereçamento e validações
              complexas assíncronas para UX impecável.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="CEP Dinâmico"
              gifSrc={cepGif}
              staticSrc={cepStatic}
            />
          </Styled.ImageWrapper>
        </Styled.Card>

        {/* Card 4: Sagas */}
        <Styled.Card className="small">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/blob/main/frontend/src/store/modules/student/sagas.js"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver componentes no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>
          <FaCode size={32} color="#94a3b8" style={{ marginBottom: '20px' }} />
          <Styled.CardHeader $small>
            <Styled.CardTitle as="h4">React & Redux Saga</Styled.CardTitle>
            <Styled.CardDescription $small>
              Gerenciamento de estado global complexo.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="Arquitetura Redux Saga"
              gifSrc={sagasStatic}
              isCode
              staticSrc={sagasStatic}
            />
          </Styled.ImageWrapper>
        </Styled.Card>

        {/* Card 5: Node */}
        <Styled.Card className="small">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/blob/main/backend/src/controllers/StudentController.js"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver Controller no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>
          <FaDatabase
            size={32}
            color="#94a3b8"
            style={{ marginBottom: '20px' }}
          />
          <Styled.CardHeader $small>
            <Styled.CardTitle as="h4">Node & MariaDB</Styled.CardTitle>
            <Styled.CardDescription $small>
              APIs RESTful e modelagem relacional de alta performance.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="Arquitetura de Backend"
              gifSrc={studentGif}
              isCode
              staticSrc={studentStatic}
            />
          </Styled.ImageWrapper>
        </Styled.Card>
      </Styled.BentoSection>

      <Styled.Footer>
        <Styled.FooterLogo>Portfólio</Styled.FooterLogo>
        <Styled.FooterText>
          Desenvolvido por Rodrigo Norys • SisboSchool 2026
        </Styled.FooterText>
        <Styled.FooterLinks>
          <a href="https://github.com/rodrigo-norys">GitHub</a>
          <a href="https://www.linkedin.com/in/rodrigo-norys/">LinkedIn</a>
        </Styled.FooterLinks>
      </Styled.Footer>
    </Styled.Container>
  );
}
