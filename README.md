# MATRIX Mobile - Jogo de Cartas

Um jogo de cartas MATRIX completamente otimizado para dispositivos móveis, desenvolvido com HTML5, CSS3 e JavaScript puro.

## 🎮 Como Jogar

### Objetivo
Formar combinações de cartas em grupos ou sequências (3+3+3+2) para vencer o jogo.

### Regras Básicas
1. **Início**: Comece com 11 cartas na mão
2. **Compra**: Quando tiver exatamente 11 cartas, compre 1 carta
3. **Descarte**: Com 12 cartas, descarte 1 para continuar
4. **Grupos**: Organize as cartas em 3 grupos de 3 cartas + 1 par
5. **Vitória**: Clique em "Verificar" quando tiver a combinação 3+3+3+2

### Combinações Válidas
- **Sequência**: 3 cartas da mesma cor em ordem (ex: 2-3-4 azuis)
- **Trinca**: 3 cartas do mesmo número, cores diferentes
- **Par**: 2 cartas iguais OU 2 cartas consecutivas da mesma cor

### Cartas Especiais
- **Cartas 1 e 9**: Não podem formar grupos válidos para bater

## 📱 Controles Mobile

### Toque Simples
- **Toque na carta**: Seleciona a carta (fica destacada)
- **Toque na área**: Move a carta selecionada para essa área
- **Toque na carta selecionada**: Cancela a seleção

### Áreas do Jogo
- **Sua Mão**: Cartas disponíveis para jogar
- **Grupos 1, 2, 3**: Cada um deve ter 3 cartas
- **Par**: Deve ter 2 cartas
- **Descarte**: Para descartar cartas indesejadas

## 🚀 Recursos Mobile

### Interface Otimizada
- ✅ Design responsivo para todos os tamanhos de tela
- ✅ Controles touch-friendly (botões grandes)
- ✅ Feedback visual para interações
- ✅ Suporte a orientação portrait e landscape

### Progressive Web App (PWA)
- ✅ Instalável na tela inicial do celular
- ✅ Funciona offline após primeira visita
- ✅ Ícone personalizado
- ✅ Experiência nativa

### Acessibilidade
- ✅ Cores contrastantes para melhor visibilidade
- ✅ Textos legíveis em telas pequenas
- ✅ Animações suaves e feedback visual
- ✅ Prevenção de zoom acidental

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com gradientes e animações
- **JavaScript ES6+**: Lógica do jogo e interações touch
- **PWA**: Service Worker para cache offline
- **Responsive Design**: CSS Grid e Flexbox

## 📦 Instalação

### Como PWA (Recomendado)
1. Abra o jogo no navegador mobile
2. Toque no menu do navegador
3. Selecione "Adicionar à tela inicial"
4. O jogo será instalado como um app nativo

### Servidor Local
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Navegue até a pasta
cd matrix-mobile

# Sirva os arquivos (exemplo com Python)
python -m http.server 8000

# Ou com Node.js
npx serve .
```

## 🎯 Melhorias Implementadas

### Performance Mobile
- Otimização de touch events
- Prevenção de zoom acidental
- Animações GPU-aceleradas
- Carregamento rápido de recursos

### UX/UI Mobile
- Interface limpa e intuitiva
- Feedback visual imediato
- Mensagens contextuais
- Modal de regras integrado

### Compatibilidade
- Testado em iOS Safari
- Testado em Android Chrome
- Suporte a diferentes resoluções
- Funciona em modo landscape

## 🐛 Solução de Problemas

### Cartas não respondem ao toque
- Certifique-se de tocar diretamente na carta
- Evite arrastar, use toques rápidos
- Recarregue a página se necessário

### Jogo não instala como PWA
- Use Chrome ou Safari atualizado
- Certifique-se de estar em HTTPS
- Limpe o cache do navegador

### Performance lenta
- Feche outras abas do navegador
- Reinicie o app se instalado como PWA
- Verifique se há atualizações do navegador

## 📄 Licença

Este projeto é open source e está disponível sob a licença MIT.

## 🤝 Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir melhorias
- Enviar pull requests
- Melhorar a documentação

---

**Divirta-se jogando MATRIX Mobile! 🎮📱**