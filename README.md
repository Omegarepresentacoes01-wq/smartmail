# 📧 Sistema de Envio de Emails em Massa

Sistema completo para envio de emails em massa com backend Node.js + Express e frontend HTML/CSS/JavaScript.

## 🚀 Funcionalidades

- ✅ Envio de emails para múltiplos destinatários simultaneamente
- ✅ Interface moderna e responsiva
- ✅ Validação de emails
- ✅ Remoção de emails duplicados automaticamente
- ✅ Feedback visual do status de envio
- ✅ Suporte a múltiplos provedores de email (Gmail, SMTP, SendGrid, AWS SES)
- ✅ Modo de desenvolvimento para testes sem envio real
- ✅ API RESTful completa
- ✅ Tratamento de erros robusto
- ✅ Limite de destinatários configurável

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta de email (Gmail, SMTP personalizado, SendGrid, ou AWS SES)

## 🔧 Instalação

### 1. Clone ou baixe o projeto

```bash
cd bulk-email-sender
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

#### Opção 1: Gmail (Mais Fácil para Testes)

```env
PORT=3000
EMAIL_SERVICE=gmail
EMAIL_USER=seu.email@gmail.com
EMAIL_PASSWORD=sua_senha_de_app
MAX_RECIPIENTS=50
DEV_MODE=false
```

**⚠️ IMPORTANTE para Gmail:**
- Você precisa gerar uma "Senha de App" no Google
- Vá em: Conta Google → Segurança → Verificação em duas etapas → Senhas de app
- Gere uma senha específica para este aplicativo
- Use essa senha no campo `EMAIL_PASSWORD`

#### Opção 2: SMTP Personalizado

```env
PORT=3000
EMAIL_HOST=smtp.exemplo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=seu.email@exemplo.com
EMAIL_PASSWORD=sua_senha
MAX_RECIPIENTS=50
DEV_MODE=false
```

#### Opção 3: SendGrid

```env
PORT=3000
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=sua_chave_api_sendgrid
MAX_RECIPIENTS=50
DEV_MODE=false
```

### 4. Inicie o servidor

#### Modo Desenvolvimento (com auto-reload):
```bash
npm run dev
```

#### Modo Produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🎯 Como Usar

### Interface Web

1. Abra o navegador em `http://localhost:3000`
2. Clique em "Testar Conexão com Servidor" para verificar se tudo está funcionando
3. Preencha o formulário:
   - Nome (opcional)
   - Email do remetente
   - Adicione destinatários (pressione Enter após cada email)
   - Assunto
   - Mensagem
4. Clique em "Enviar Emails"
5. Aguarde o resultado do envio

### API (para integração)

#### Endpoint: Enviar Emails
```http
POST /api/send-emails
Content-Type: application/json

{
  "senderName": "João Silva",
  "senderEmail": "joao@exemplo.com",
  "recipients": [
    "destinatario1@exemplo.com",
    "destinatario2@exemplo.com"
  ],
  "subject": "Assunto do Email",
  "message": "Conteúdo da mensagem"
}
```

#### Resposta de Sucesso:
```json
{
  "success": true,
  "message": "Todos os 2 emails foram enviados com sucesso!",
  "results": {
    "successful": [
      {
        "email": "destinatario1@exemplo.com",
        "messageId": "<abc123@gmail.com>"
      }
    ],
    "failed": [],
    "total": 2
  },
  "devMode": false
}
```

#### Endpoint: Verificar Saúde
```http
GET /api/health
```

#### Endpoint: Testar Conexão
```http
POST /api/test-connection
```

## 🔒 Modo de Desenvolvimento

Para testar o sistema sem enviar emails reais, configure no `.env`:

```env
DEV_MODE=true
```

Neste modo:
- Emails não serão enviados de verdade
- O sistema simulará o envio
- Útil para desenvolvimento e testes

## 📁 Estrutura do Projeto

```
bulk-email-sender/
│
├── server.js              # Servidor backend Express
├── package.json           # Dependências do projeto
├── .env                   # Configurações (NÃO commitar!)
├── .env.example           # Exemplo de configurações
├── README.md              # Este arquivo
│
└── public/
    └── index.html         # Interface frontend
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **Nodemailer** - Envio de emails
- **dotenv** - Gerenciamento de variáveis de ambiente
- **express-validator** - Validação de dados
- **cors** - Habilitação de CORS
- **body-parser** - Parse de requisições JSON

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização
- **JavaScript Vanilla** - Interatividade

## 📝 Configurações Avançadas

### Limitar Destinatários

Edite no `.env`:
```env
MAX_RECIPIENTS=50
```

### Configurar Delay Entre Emails

No arquivo `server.js`, localize a linha:
```javascript
await new Promise(resolve => setTimeout(resolve, 100));
```

Ajuste o valor (em milissegundos) conforme necessário.

### Personalizar Template de Email

No arquivo `server.js`, localize a seção `mailOptions.html` e customize o HTML.

## 🚨 Solução de Problemas

### Erro: "Falha ao conectar com servidor de email"

**Soluções:**
1. Verifique suas credenciais no arquivo `.env`
2. Para Gmail, certifique-se de usar uma "Senha de App"
3. Verifique se a verificação em duas etapas está ativada
4. Teste a conexão usando o botão "Testar Conexão"

### Erro: "ECONNREFUSED"

**Soluções:**
1. Certifique-se de que o servidor está rodando (`npm start`)
2. Verifique se a porta 3000 está disponível
3. Tente mudar a porta no arquivo `.env`

### Emails não estão sendo recebidos

**Soluções:**
1. Verifique a pasta de spam
2. Confirme que `DEV_MODE=false` no `.env`
3. Verifique os logs do servidor para erros
4. Teste com um único destinatário primeiro

## 🔐 Segurança

### Boas Práticas:

1. **NUNCA** commite o arquivo `.env` com credenciais reais
2. Use senhas de aplicativo específicas (não sua senha principal)
3. Configure limite de destinatários para evitar abuso
4. Implemente rate limiting em produção
5. Use HTTPS em produção
6. Valide e sanitize todos os inputs

### Adicionar ao `.gitignore`:
```
.env
node_modules/
```

## 📊 Logs

O servidor registra todas as ações importantes:
- ✅ Emails enviados com sucesso
- ❌ Erros de envio
- 🔧 Status de conexão
- ⚠️ Avisos e problemas

## 🌐 Deploy em Produção

### Opções de Deploy:

1. **Heroku**
2. **DigitalOcean**
3. **AWS EC2**
4. **Google Cloud**
5. **Vercel** (apenas para frontend)

### Passos Gerais:

1. Configure variáveis de ambiente no serviço de hosting
2. Certifique-se de que `DEV_MODE=false`
3. Use HTTPS
4. Configure firewall apropriadamente
5. Monitore logs e performance

## 📞 Suporte

Para problemas ou dúvidas:
- Verifique os logs do servidor
- Consulte a documentação do Nodemailer: https://nodemailer.com/
- Teste em modo desenvolvimento primeiro

## 📄 Licença

MIT License - Livre para uso pessoal e comercial

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se livre para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests

---

**Desenvolvido com ❤️ usando Node.js e Express**
