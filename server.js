const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Multer com memoryStorage (compativel com Vercel serverless)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 25 * 1024 * 1024 }
});

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'public')));

// Configuração do transportador de email
function env(key) {
    return (process.env[key] || '').trim();
}

function createTransporter() {
    if (env('DEV_MODE') === 'true') {
        console.log('🔧 Modo de desenvolvimento ativado - emails serão apenas simulados');
        return nodemailer.createTransport({
            streamTransport: true,
            newline: 'unix',
            buffer: true
        });
    }

    if (env('EMAIL_SERVICE') === 'gmail') {
        return nodemailer.createTransport({
            service: 'gmail',
            pool: false,
            auth: {
                user: env('EMAIL_USER'),
                pass: env('EMAIL_PASSWORD')
            }
        });
    }

    if (env('EMAIL_HOST')) {
        return nodemailer.createTransport({
            host: env('EMAIL_HOST'),
            port: env('EMAIL_PORT') || 587,
            secure: env('EMAIL_SECURE') === 'true',
            pool: false,
            auth: {
                user: env('EMAIL_USER'),
                pass: env('EMAIL_PASSWORD')
            }
        });
    }

    console.warn('⚠️  Nenhuma configuração de email encontrada. Usando transportador de teste.');
    return nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
    });
}

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});
// Health check
app.get('/api/health', (req, res) => {
    const emailService = env('EMAIL_SERVICE');
    const emailUser = env('EMAIL_USER');
    res.json({
        status: 'ok',
        service: 'Bulk Email Sender API',
        timestamp: new Date().toISOString(),
        devMode: env('DEV_MODE') === 'true',
        emailConfigured: emailService === 'gmail' || !!env('EMAIL_HOST'),
        emailService: emailService || 'none',
        emailUser: emailUser ? emailUser.substring(0, 3) + '***' : 'not set'
    });
});

// Enviar emails
app.post('/api/send-emails', upload.array('attachments', 10), async (req, res) => {
    const { senderEmail, subject, message, senderName } = req.body;
    let recipients = req.body.recipients;
    const files = req.files || [];

    if (typeof recipients === 'string') {
        recipients = [recipients];
    }

    if (!senderEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(senderEmail)) {
        return res.status(400).json({ success: false, message: 'Email do remetente inválido' });
    }
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ success: false, message: 'Pelo menos um destinatário é necessário' });
    }
    if (!subject || !subject.trim()) {
        return res.status(400).json({ success: false, message: 'O assunto é obrigatório' });
    }
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'A mensagem é obrigatória' });
    }

    const maxRecipients = parseInt(process.env.MAX_RECIPIENTS) || 50;
    if (recipients.length > maxRecipients) {
        return res.status(400).json({
            success: false,
            message: `Número máximo de destinatários excedido. Limite: ${maxRecipients}`
        });
    }

    const uniqueRecipients = [...new Set(recipients)];

    // Anexos via buffer (memoryStorage)
    const attachments = files.map(file => ({
        filename: file.originalname,
        content: file.buffer
    }));

    try {
        const transporter = createTransporter();
        const results = {
            successful: [],
            failed: [],
            total: uniqueRecipients.length
        };

        for (const recipient of uniqueRecipients) {
            try {
                const authEmail = process.env.EMAIL_USER || senderEmail;
                const mailOptions = {
                    from: senderName
                        ? `"${senderName}" <${authEmail}>`
                        : authEmail,
                    replyTo: senderEmail,
                    to: recipient,
                    subject: subject,
                    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;">
<tr><td align="center" style="padding:40px 20px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

<!-- Header -->
<tr><td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:28px 40px;text-align:left;">
<h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.3px;">${senderName || senderEmail}</h1>
</td></tr>

<!-- Body -->
<tr><td style="padding:32px 40px;">
<p style="margin:0;color:#333333;font-size:15px;line-height:1.7;text-align:left;">${message.replace(/\n/g, '<br>')}</p>
</td></tr>

<!-- Divider -->
<tr><td style="padding:0 40px;"><hr style="border:none;border-top:1px solid #e8e8eb;margin:0;"></td></tr>

<!-- Footer -->
<tr><td style="padding:20px 40px 28px;text-align:center;">
<p style="margin:0;color:#999999;font-size:12px;line-height:1.5;">Enviado por <strong style="color:#6366f1;">${senderEmail}</strong></p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
                    text: message,
                    attachments: attachments
                };

                const info = await transporter.sendMail(mailOptions);

                results.successful.push({
                    email: recipient,
                    messageId: info.messageId,
                    response: info.response,
                    accepted: info.accepted,
                    rejected: info.rejected
                });

                console.log(`✅ Email enviado para: ${recipient}${attachments.length > 0 ? ` (${attachments.length} anexo(s))` : ''}`);

            } catch (error) {
                results.failed.push({
                    email: recipient,
                    error: error.message
                });
                console.error(`❌ Erro ao enviar para ${recipient}:`, error.message);
            }

            await new Promise(resolve => setTimeout(resolve, 100));
        }

        transporter.close();
        const allSuccessful = results.failed.length === 0;

        res.json({
            success: allSuccessful,
            message: allSuccessful
                ? `Todos os ${results.successful.length} emails foram enviados com sucesso!`
                : `${results.successful.length} emails enviados, ${results.failed.length} falharam.`,
            results: results,
            devMode: process.env.DEV_MODE === 'true'
        });

    } catch (error) {
        console.error('❌ Erro geral no envio de emails:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao processar envio de emails',
            error: error.message
        });
    }
});

// Testar conexão
app.post('/api/test-connection', async (req, res) => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        transporter.close();
        res.json({
            success: true,
            message: 'Conexão com servidor de email estabelecida com sucesso!',
            devMode: process.env.DEV_MODE === 'true'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Falha ao conectar com servidor de email',
            error: error.message
        });
    }
});

// 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});


// Erro geral
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(500).json({ success: false, message: 'Erro interno do servidor', error: err.message });
});

// Iniciar servidor (apenas local, Vercel ignora isso)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════════════╗
║   📧 Servidor de Envio de Emails em Massa      ║
╠════════════════════════════════════════════════╣
║   🌐 Servidor rodando em: http://localhost:${PORT}
║   📝 Modo: ${process.env.DEV_MODE === 'true' ? 'Desenvolvimento (Simulação)' : 'Produção'}
║   ⏰ Iniciado em: ${new Date().toLocaleString('pt-BR')}
╚════════════════════════════════════════════════╝
        `);
    });
}

module.exports = app;
