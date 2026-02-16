#!/usr/bin/env python3
from PIL import Image
import os

# Caminho da logo original
logo_path = 'public/assets/logo.png'
favicon_path = 'public/assets/favicon.ico'
favicon_png_path = 'public/assets/favicon.png'

# Abrir a imagem
img = Image.open(logo_path)

# Converter para RGBA se necessário
if img.mode != 'RGBA':
    img = img.convert('RGBA')

# Criar favicon em múltiplos tamanhos (16x16, 32x32, 48x48)
favicon_sizes = [(16, 16), (32, 32), (48, 48)]
favicon_images = []

for size in favicon_sizes:
    resized = img.resize(size, Image.Resampling.LANCZOS)
    favicon_images.append(resized)

# Salvar como .ico (multi-size)
favicon_images[0].save(
    favicon_path,
    format='ICO',
    sizes=favicon_sizes,
    append_images=favicon_images[1:]
)

# Salvar também como PNG 192x192 para PWA
pwa_icon = img.resize((192, 192), Image.Resampling.LANCZOS)
pwa_icon.save(favicon_png_path, format='PNG')

# Criar também versão 512x512 para PWA
pwa_icon_large = img.resize((512, 512), Image.Resampling.LANCZOS)
pwa_icon_large.save('public/assets/icon-512.png', format='PNG')

print("✅ Favicon gerado com sucesso!")
print(f"   - {favicon_path}")
print(f"   - {favicon_png_path}")
print(f"   - public/assets/icon-512.png")
