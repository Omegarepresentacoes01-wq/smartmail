# 📧 Guia de Configuração de Provedores de Email

Este guia detalha como configurar diferentes provedores de email para o sistema de envio em massa.

---

## 🔵 Gmail (Recomendado para Testes)

### Pré-requisitos
- Conta Gmail ativa
- Verificação em duas etapas habilitada

### Passo a Passo

#### 1. Habilitar Verificação em Duas Etapas
1. Acesse https://myaccount.google.com/security
2. Em "Como fazer login no Google", clique em "Verificação em duas etapas"
3. Siga as instruções para ativar

#### 2. Gerar Senha de App
1. Acesse https://myaccount.google.com/apppasswords
2. Selecione "Outro (nome personalizado)"
3. Digite "Sistema de Email em Massa"
4. Clique em "Gerar"
5. Copie a senha gerada (16 caracteres)

#### 3. Configurar .env
```env
EMAIL_SERVICE=gmail
EMAIL_USER=seu.email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

### Limites do Gmail
- **Por dia**: 500 emails (contas gratuitas)
- **Por hora**: 100 emails
- **Destinatários por email**: 100

---

## 🟠 Outlook / Hotmail

### Configuração .env
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu.email@outlook.com
EMAIL_PASSWORD=sua_senha
```

### Observações
- Use a senha normal da conta
- Pode precisar permitir "apps menos seguros"

### Limites
- **Por dia**: 300 emails
- **Por minuto**: 30 emails

---

## 🟢 SMTP Personalizado (Hostinger, GoDaddy, etc.)

### Informações Necessárias
Consulte a documentação do seu provedor para obter:
- Host SMTP (ex: `smtp.seudominio.com`)
- Porta (normalmente 587 ou 465)
- Usuário (seu email completo)
- Senha

### Configuração .env
```env
EMAIL_HOST=smtp.seudominio.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=contato@seudominio.com
EMAIL_PASSWORD=sua_senha_email
```

### Portas Comuns
- **587**: TLS (recomendada)
- **465**: SSL
- **25**: Sem criptografia (não recomendada)

---

## 🟣 SendGrid (Profissional)

### Vantagens
- Alta capacidade de envio
- Estatísticas detalhadas
- Templates avançados
- Reputação de IP gerenciada

### Passo a Passo

#### 1. Criar Conta
1. Acesse https://sendgrid.com
2. Registre-se (plano gratuito: 100 emails/dia)

#### 2. Gerar API Key
1. Vá em Settings → API Keys
2. Clique em "Create API Key"
3. Dê um nome descritivo
4. Selecione "Full Access"
5. Copie a chave gerada

#### 3. Configurar .env
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
```

#### 4. Atualizar server.js
Adicione no início do arquivo:
```javascript
if (process.env.EMAIL_SERVICE === 'sendgrid') {
    return nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        }
    });
}
```

### Limites SendGrid
- **Gratuito**: 100 emails/dia
- **Essentials ($15/mês)**: 50.000 emails/mês
- **Pro ($90/mês)**: 1.5M emails/mês

---

## 🔴 AWS SES (Amazon Simple Email Service)

### Vantagens
- Muito econômico ($0.10/1000 emails)
- Alta escalabilidade
- Integração com AWS

### Passo a Passo

#### 1. Criar Conta AWS
1. Acesse https://aws.amazon.com/ses/
2. Registre-se e faça login no Console

#### 2. Verificar Email/Domínio
1. Em SES, vá em "Verified identities"
2. Clique em "Create identity"
3. Verifique seu email ou domínio

#### 3. Criar Credenciais SMTP
1. Em "Account dashboard", clique em "Create SMTP credentials"
2. Copie:
   - SMTP Username
   - SMTP Password

#### 4. Configurar .env
```env
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=AKIAIOSFODNN7EXAMPLE
EMAIL_PASSWORD=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

#### 5. Sair do Sandbox (Importante!)
Por padrão, AWS SES está em modo sandbox (só pode enviar para emails verificados).

Para produção:
1. Vá em "Account dashboard"
2. Clique em "Request production access"
3. Preencha o formulário justificando o uso

### Limites AWS SES
- **Sandbox**: Emails verificados apenas
- **Produção**: 
  - Inicial: 1 email/segundo, 200/dia
  - Aumenta automaticamente com uso

---

## 🟡 Mailgun

### Configuração

#### 1. Criar Conta
1. Acesse https://mailgun.com
2. Registre-se

#### 2. Obter Credenciais
1. Vá em "Sending" → "Domain settings"
2. Copie as credenciais SMTP

#### 3. Configurar .env
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=postmaster@seu-dominio.mailgun.org
EMAIL_PASSWORD=sua_senha_mailgun
```

### Limites Mailgun
- **Gratuito**: 5.000 emails/mês (3 meses)
- **Foundation ($35/mês)**: 50.000 emails/mês

---

## 🔵 Zoho Mail

### Configuração .env
```env
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu@email.zoho.com
EMAIL_PASSWORD=sua_senha
```

### Limites
- **Gratuito**: 5 emails/dia
- **Pago**: 500-1000 emails/dia

---

## 📊 Comparação de Provedores

| Provedor | Custo | Limite Grátis | Melhor Para |
|----------|-------|---------------|-------------|
| Gmail | Grátis | 500/dia | Testes, uso pessoal |
| Outlook | Grátis | 300/dia | Testes, uso pessoal |
| SendGrid | $0-$15+ | 100/dia | Profissional, médio volume |
| AWS SES | $0.10/1000 | Sandbox | Grande volume, econômico |
| Mailgun | $35+ | 5000/mês | Profissional, API avançada |
| SMTP Host | Varia | Varia | Domínio próprio |

---

## 🛡️ Boas Práticas

### 1. Autenticação
- Sempre use senhas de aplicativo (não senhas principais)
- Mantenha credenciais seguras no .env
- Nunca commite credenciais no Git

### 2. Reputação de Email
- Não envie spam
- Use domínio próprio verificado
- Configure SPF, DKIM, DMARC
- Inclua link de descadastro

### 3. Performance
- Adicione delays entre envios
- Respeite limites de taxa
- Monitore bounces e reclamações
- Use IP dedicado para alto volume

### 4. Conformidade
- Respeite GDPR/LGPD
- Tenha consentimento dos destinatários
- Ofereça opção de opt-out
- Mantenha registros de consentimento

---

## 🚨 Troubleshooting

### "Authentication failed"
- Verifique usuário e senha
- Para Gmail, use senha de app
- Verifique se 2FA está ativo

### "Connection timeout"
- Verifique firewall
- Tente outra porta (587/465/25)
- Verifique configuração de VPN

### "Daily sending quota exceeded"
- Aguarde 24 horas
- Considere upgrade de plano
- Distribua envios ao longo do tempo

### Emails vão para spam
- Configure SPF/DKIM/DMARC
- Use domínio verificado
- Evite palavras de spam
- Inclua texto simples além de HTML

---

## 📞 Suporte dos Provedores

- **Gmail**: https://support.google.com/mail/
- **SendGrid**: https://support.sendgrid.com/
- **AWS SES**: https://aws.amazon.com/ses/faqs/
- **Mailgun**: https://help.mailgun.com/
- **Outlook**: https://support.microsoft.com/outlook

---

**Última atualização**: Janeiro 2024
