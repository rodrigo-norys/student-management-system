import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaThLarge, FaCode, FaDatabase, FaGithub, FaLinkedin } from 'react-icons/fa';
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

  return (
    <Styled.Container>
      <Styled.Hero>
        <Styled.HeroTitle>
          Gestão Escolar com <br /> Engenharia de Ponta
        </Styled.HeroTitle>
        <Styled.HeroDescription>
          Uma aplicação fullstack de alta performance focada em segurança e
          usabilidade. Projeto em fase de aprimoramento contínuo, com novas
          features e ajustes de arquitetura sendo implementados regularmente.
        </Styled.HeroDescription>
        <Styled.HeroActions>
          {/* <Styled.HeroButton onClick={() => navigate('/login')}>
            Aceder ao Sistema
          </Styled.HeroButton> */}

          <Styled.SecondaryButton onClick={() => navigate('/login')}>
            Para o Login
          </Styled.SecondaryButton>
        </Styled.HeroActions>
      </Styled.Hero>

      <Styled.BentoSection>
        <Styled.Card className="featured">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/tree/main/frontend/src/pages/Student/StudentList/components"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver componentes no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>

          <FaThLarge size={32} color="#2196f3" />
          <Styled.CardHeader>
            <Styled.CardTitle>Dashboard Dinâmico</Styled.CardTitle>
            <Styled.CardDescription>
              Visualização flexível entre Grid e Table. Alterne entre foco em
              identidade visual ou densidade de dados com um clique.
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

        <Styled.Card className="tall">
          <Styled.LinkedinLink
            href="https://www.linkedin.com/feed/update/urn:li:activity:7449506572998692865/"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver documentação no Linkedin"
          >
            <FaLinkedin size={20} />
          </Styled.LinkedinLink>

          <FaShieldAlt size={32} color="#2196f3" />
          <Styled.CardHeader>
            <Styled.CardTitle>Segurança de Elite</Styled.CardTitle>
            <Styled.CardDescription>
              Autenticação robusta utilizando JWT via HttpOnly Cookies,
              protegendo a sessão contra ataques XSS e garantindo persistência
              segura.
            </Styled.CardDescription>
          </Styled.CardHeader>
          <Styled.ImageWrapper>
            <InteractivePreview
              altText="Segurança JWT HttpOnly"
              gifSrc={httponlyGif}
              staticSrc={securityStatic}
            />
          </Styled.ImageWrapper>
        </Styled.Card>

        <Styled.Card className="wide">
          <FaDatabase size={32} color="#2196f3" />
          <Styled.CardHeader>
            <Styled.CardTitle>Formulários Inteligentes</Styled.CardTitle>
            <Styled.CardDescription>
              Integração em tempo real com APIs de endereços e validações
              complexas para múltiplos registos de estudantes e encarregados de
              educação.
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

        <Styled.Card className="sagas">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/blob/main/frontend/src/store/modules/student/sagas.js"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver componentes no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>

          <FaCode size={24} color="#2196f3" />
          <Styled.CardHeader $small>
            <Styled.CardTitle as="h4">React & Redux</Styled.CardTitle>
            <Styled.CardDescription $small>
              Estado global gerido com Sagas.
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

        <Styled.Card className="node">
          <Styled.GitHubLink
            href="https://github.com/rodrigo-norys/student-management-system/blob/main/backend/src/controllers/StudentController.js"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver Controller no GitHub"
          >
            <FaGithub size={20} />
          </Styled.GitHubLink>

          <FaDatabase size={24} color="#2196f3" />
          <Styled.CardHeader $small>
            <Styled.CardTitle as="h4">Node & MariaDB</Styled.CardTitle>
            <Styled.CardDescription $small>
              API RESTful sólida e relacional.
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
        <Styled.FooterText>
          Desenvolvido por Rodrigo Norys • SisboSchool 2026
        </Styled.FooterText>
      </Styled.Footer>
    </Styled.Container>
  );
}
