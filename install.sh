#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║  📧 Instalador - Sistema de Emails em Massa    ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não está instalado!"
    echo "Por favor, instale Node.js de https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo "✅ npm encontrado: $(npm --version)"
echo ""

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependências instaladas com sucesso!"
else
    echo "❌ Erro ao instalar dependências"
    exit 1
fi

echo ""

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "⚙️  Criando arquivo .env..."
    cp .env.example .env
    echo "✅ Arquivo .env criado!"
    echo ""
    echo "⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações de email"
    echo ""
else
    echo "✅ Arquivo .env já existe"
fi

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║  ✅ Instalação Concluída!                      ║"
echo "╠════════════════════════════════════════════════╣"
echo "║  Próximos passos:                              ║"
echo "║                                                ║"
echo "║  1. Edite o arquivo .env com suas credenciais ║"
echo "║  2. Execute: npm start                         ║"
echo "║  3. Abra: http://localhost:3000                ║"
echo "╚════════════════════════════════════════════════╝"
echo ""
