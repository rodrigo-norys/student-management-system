---
name: audit-vps
description: Playbook de auditoria READ-ONLY da VPS de produção (Docker + Caddy + MariaDB). Conecta por SSH, inventaria todas as camadas (SO, SSH, firewall, Docker, proxy/TLS, banco, backup, observabilidade, recursos), e devolve relatório de inventário + tabela de melhorias padrão-indústria priorizada. Use para auditar/diagnosticar a infra de produção. NÃO altera estado — toda correção sai como sugestão + comando para o humano aprovar e rodar.
---

# Auditar VPS (read-only)

Auditoria de infraestrutura da VPS de produção do Student Management System. Roda **na sessão** (usa Bash/SSH). O alvo é produção — então **inspeção primeiro, sempre**.

## Gates inegociáveis (antes de qualquer comando)

1. **Produção é read-only.** A fase de inventário é 100% inspeção. **NÃO** rode nada que altere estado (sem `install`/`update`/`upgrade`/`restart`/`stop`, sem editar arquivo, sem mexer em firewall/serviço) **sem confirmação explícita do usuário, item a item**.
2. **Nunca** copie segredos, `.env` de produção ou dump de dados reais para a máquina local sem autorização explícita. Para popular o local, use **schema via migrations**, nunca dump de prod.
3. **Mascare segredos na saída** — mostre a chave, nunca o valor. Para inspecionar o banco, use a senha **de dentro do container** (`$MARIADB_*`), sem ecoá-la.
4. Toda mudança proposta vai como **sugestão + comando**; o usuário aprova e roda. A skill **não** aplica nem commita.
5. **Human-in-the-loop** (ver `.claude/context/governance.md`): parar antes de qualquer ação destrutiva, em schema core, ou que afete auth/dados/firewall.

## Pré-requisito de acesso

Chave SSH **dedicada** à VPS (não reusar a chave do Git — uma chave por finalidade, CIS/least-privilege). Se a chave local não autenticar, instrua o usuário a rodar `ssh-copy-id` no terminal **dele** (a senha nunca passa por aqui). Conecte com `ssh -i <chave_dedicada> -p <porta> root@<host>` e valide o login por chave antes de seguir.

## Playbook de inventário (lotes read-only)

Rode por lotes, com marcador por seção. Comandos de referência (não alteram estado):

1. **SO & host:** `/etc/os-release`, `uname -a`, `uptime`, `timedatectl`, `nproc`. Patching **sem** `apt update`: `apt list --upgradable 2>/dev/null` (cache existente), `/var/run/reboot-required(.pkgs)`, `systemctl is-enabled unattended-upgrades`.
2. **Usuários & SSH:** `getent passwd` (shells), `getent group sudo`, `ls /etc/sudoers.d/`, **`sshd -T`** (config efetiva: PermitRootLogin, PasswordAuthentication, Port), `authorized_keys` (comentários/qtd, não o conteúdo cru), `systemctl is-active fail2ban`, `last`.
3. **Firewall & rede:** `ufw status verbose`, `nft list ruleset`, `iptables -S`, **`ss -tulpn`** (o que escuta em `0.0.0.0` vs loopback).
4. **Docker & Compose:** `docker version`, `docker info` (logging driver, live-restore), `docker ps -a`, restart/healthcheck/user/limits por container via `docker inspect -f`, `docker images`, `docker network ls`, `docker system df` (disco/build cache), localizar o `docker-compose.yml`.
5. **Proxy & TLS:** ler config da borda (Caddyfile/nginx.conf), `certbot certificates` / `openssl x509 -enddate -ext subjectAltName`, conferir **renovação** (Caddy = nativo; certbot `standalone` com porta ocupada por container = renovação quebrada), security headers.
6. **Banco (MariaDB):** versão, bind/porta exposta, usuários/grants (`root@%`? app conecta como root?), charset/collation, `log_bin`, e **estratégia de backup** (existe? automatizada? testada?). Use `docker exec ... MYSQL_PWD=$MARIADB_ROOT_PASSWORD mariadb -uroot -e "..."`.
7. **App & deploy:** como sobem backend/frontend, variáveis efetivas (mascaradas), CORS/URLs, como o código chega (git pull? CI/CD?), onde estão os segredos, e se compose/proxy estão versionados.
8. **Observabilidade & recursos:** logs (rotação? centralizados?), monitoring/alertas, cron (backup?), `df -h`, `free -h`, swap, comportamento no reboot.

## Entregáveis

1. **Relatório de inventário** — uma seção por camada, cada afirmação com comando + saída.
2. **Tabela priorizada** — colunas: **Achado | Risco | Severidade (crítico/alto/médio/baixo) | Recomendação padrão-indústria (com referência: CIS Benchmark, OWASP, 12-Factor, Well-Architected) | Esforço**. Ordem: segurança (SSH/firewall/TLS/secrets) → resiliência (backup testado, restart, healthcheck) → eficiência/observabilidade. Destaque os **quick wins** (alto impacto, baixo esforço) no topo.
3. Salve o relatório em `docs/infra/AAAA-MM-DD-auditoria-infra-vps-producao.md` (nome datado).

> Correções entram depois, **uma a uma**, via sugestão + comando aprovado — nunca em lote automático. Para revisar os artefatos de infra do repo (compose/Dockerfile/Caddyfile), use o agente `infra-review`.
