/******************************************************
 * VARIÁVEIS GLOBAIS E ESTADO
 ******************************************************/
let deck = [];
let playerHand = [];
let groups = { group1: [], group2: [], group3: [], group4: [] };
let discardPile = [];
let cardIdCounter = 0;
let gameStarted = false;
let selectedCard = null;
let touchStartTime = 0;

/******************************************************
 * DETECÇÃO DE DISPOSITIVO MÓVEL
 ******************************************************/
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                 ('ontouchstart' in window) || 
                 (navigator.maxTouchPoints > 0);

/******************************************************
 * CRIA E EMBARALHA O BARALHO
 ******************************************************/
function createDeck() {
  const colors = ["red", "blue", "green", "yellow"];
  const numbers = [1,2,3,4,5,6,7,8,9];
  let newDeck = [];
  for (let color of colors) {
    for (let num of numbers) {
      newDeck.push({ id: cardIdCounter++, color: color, value: num });
      newDeck.push({ id: cardIdCounter++, color: color, value: num });
    }
  }
  return newDeck;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/******************************************************
 * INICIAR / REINICIAR JOGO
 ******************************************************/
function startGame() {
  deck = shuffle(createDeck());
  playerHand = [];
  groups = { group1: [], group2: [], group3: [], group4: [] };
  discardPile = [];
  gameStarted = true;
  selectedCard = null;
  
  // 11 cartas iniciais
  for (let i = 0; i < 11; i++) {
    playerHand.push(deck.pop());
  }
  
  showMessage("Jogo iniciado! Toque nas cartas para selecioná-las.", "success");
  renderAll();
}

function resetGameState() {
  deck = [];
  playerHand = [];
  groups = { group1: [], group2: [], group3: [], group4: [] };
  discardPile = [];
  cardIdCounter = 0;
  gameStarted = false;
  selectedCard = null;
  
  showMessage("Jogo reiniciado. Toque em 'Iniciar' para começar.", "info");
  clearAllAreas();
  updateHandCountMessage();
}

function clearAllAreas() {
  document.getElementById("playerHand").innerHTML = "";
  document.querySelectorAll(".group-cards").forEach(area => area.innerHTML = "");
  document.getElementById("discardCards").innerHTML = "";
}

/******************************************************
 * COMPRAR CARTA
 ******************************************************/
function drawCard() {
  if (!gameStarted) {
    showMessage("Inicie o jogo primeiro!", "error");
    return;
  }
  if (deck.length === 0) {
    showMessage("O baralho acabou!", "error");
    return;
  }
  
  let total = getTotalCards();
  if (total !== 11) {
    showMessage("Você só pode comprar com 11 cartas no total.", "error");
    return;
  }

  playerHand.push(deck.pop());
  showMessage("Carta comprada! Agora descarte uma carta.", "info");
  renderAll();
}

/******************************************************
 * SISTEMA DE MENSAGENS
 ******************************************************/
function showMessage(text, type = "info") {
  const messageEl = document.getElementById("message");
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  
  // Auto-hide após 3 segundos
  setTimeout(() => {
    if (messageEl.textContent === text) {
      messageEl.textContent = "";
      messageEl.className = "message";
    }
  }, 3000);
}

/******************************************************
 * RENDERIZAÇÕES
 ******************************************************/
function renderAll() {
  renderHand();
  renderGroups();
  renderDiscardPile();
  updateHandCountMessage();
}

function renderHand() {
  const handDiv = document.getElementById("playerHand");
  handDiv.innerHTML = "";
  playerHand.forEach(card => {
    const cardEl = createCardElement(card, "hand");
    handDiv.appendChild(cardEl);
  });
}

function renderGroups() {
  for (let groupId in groups) {
    const groupCardsDiv = document.querySelector(`#${groupId} .group-cards`);
    groupCardsDiv.innerHTML = "";
    
    groups[groupId].forEach(card => {
      const cardEl = createCardElement(card, groupId);
      groupCardsDiv.appendChild(cardEl);
    });
  }
}

function renderDiscardPile() {
  const discardContainer = document.getElementById("discardCards");
  discardContainer.innerHTML = "";
  discardPile.forEach(card => {
    const cardEl = createCardElement(card, "discardPile");
    discardContainer.appendChild(cardEl);
  });
}

function createCardElement(card, source) {
  const cardEl = document.createElement("div");
  cardEl.classList.add("card", card.color);
  cardEl.textContent = card.value;
  cardEl.setAttribute("data-card-id", card.id);
  cardEl.dataset.source = source;
  
  // Eventos para mobile e desktop
  if (isMobile) {
    cardEl.addEventListener("touchstart", handleTouchStart, { passive: false });
    cardEl.addEventListener("touchend", handleTouchEnd, { passive: false });
  } else {
    cardEl.setAttribute("draggable", "true");
    cardEl.addEventListener("dragstart", dragStart);
    cardEl.addEventListener("click", handleCardClick);
  }
  
  return cardEl;
}

/******************************************************
 * EVENTOS TOUCH PARA MOBILE
 ******************************************************/
function handleTouchStart(event) {
  event.preventDefault();
  touchStartTime = Date.now();
  
  // Adiciona feedback visual
  event.target.style.transform = "scale(0.95)";
}

function handleTouchEnd(event) {
  event.preventDefault();
  const touchDuration = Date.now() - touchStartTime;
  
  // Remove feedback visual
  event.target.style.transform = "";
  
  // Se foi um toque rápido (não drag), trata como clique
  if (touchDuration < 300) {
    handleCardClick(event);
  }
}

function handleCardClick(event) {
  const cardId = parseInt(event.target.getAttribute("data-card-id"));
  const source = event.target.dataset.source;
  
  // Se não há carta selecionada, seleciona esta
  if (!selectedCard) {
    selectCard(cardId, source, event.target);
    return;
  }
  
  // Se clicou na mesma carta, deseleciona
  if (selectedCard.id === cardId) {
    deselectCard();
    return;
  }
  
  // Se clicou em outra carta, move a selecionada para cá
  const targetZone = getZoneFromSource(source);
  if (targetZone) {
    moveSelectedCardTo(targetZone);
  }
}

function selectCard(cardId, source, element) {
  selectedCard = { id: cardId, source: source, element: element };
  element.classList.add("selected");
  showMessage("Carta selecionada. Toque onde quer movê-la.", "info");
  
  // Destaca zonas válidas
  highlightValidZones(true);
}

function deselectCard() {
  if (selectedCard) {
    selectedCard.element.classList.remove("selected");
    selectedCard = null;
    showMessage("Seleção cancelada.", "info");
    highlightValidZones(false);
  }
}

function highlightValidZones(highlight) {
  const zones = document.querySelectorAll(".dropzone");
  zones.forEach(zone => {
    if (highlight) {
      zone.style.borderColor = "#00ff41";
      zone.style.backgroundColor = "rgba(0, 255, 65, 0.1)";
    } else {
      zone.style.borderColor = "";
      zone.style.backgroundColor = "";
    }
  });
}

function getZoneFromSource(source) {
  if (source === "hand") return "playerHand";
  if (source === "discardPile") return "discardPile";
  if (groups[source]) return source;
  return null;
}

/******************************************************
 * EVENTOS DE ZONA (TOUCH)
 ******************************************************/
function setupZoneEvents() {
  const zones = document.querySelectorAll(".dropzone");
  zones.forEach(zone => {
    if (isMobile) {
      zone.addEventListener("touchend", handleZoneTouch, { passive: false });
    } else {
      zone.addEventListener("dragover", dragOver);
      zone.addEventListener("dragleave", dragLeave);
      zone.addEventListener("drop", drop);
    }
    
    // Clique para mover carta selecionada
    zone.addEventListener("click", handleZoneClick);
  });
}

function handleZoneTouch(event) {
  event.preventDefault();
  if (selectedCard) {
    const zoneId = event.currentTarget.id;
    moveSelectedCardTo(zoneId);
  }
}

function handleZoneClick(event) {
  if (selectedCard && !event.target.classList.contains("card")) {
    const zoneId = event.currentTarget.id;
    moveSelectedCardTo(zoneId);
  }
}

function moveSelectedCardTo(targetZone) {
  if (!selectedCard) return;
  
  const success = moveCard(selectedCard.id, selectedCard.source, targetZone);
  if (success) {
    deselectCard();
    renderAll();
  }
}

/******************************************************
 * CONTAGEM DE CARTAS
 ******************************************************/
function updateHandCountMessage() {
  let total = getTotalCards();
  let handInfoEl = document.getElementById("handInfo");
  
  let phase = "";
  if (total === 11) phase = " (Fase de compra)";
  else if (total === 12) phase = " (Fase de descarte)";
  else if (total < 11) phase = " (Faltam cartas)";
  else phase = " (Muitas cartas)";
  
  handInfoEl.textContent = `Total: ${total} cartas${phase}`;
}

function getTotalCards() {
  let groupCount = groups.group1.length + groups.group2.length + groups.group3.length + groups.group4.length;
  return playerHand.length + groupCount;
}

/******************************************************
 * DRAG & DROP (DESKTOP)
 ******************************************************/
function dragStart(event) {
  const cardId = event.target.getAttribute("data-card-id");
  const source = event.target.dataset.source;
  event.dataTransfer.setData("text/plain", JSON.stringify({ cardId, source }));
}

function dragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("over");
}

function dragLeave(event) {
  event.currentTarget.classList.remove("over");
}

function drop(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("over");
  const data = JSON.parse(event.dataTransfer.getData("text/plain"));
  const targetId = event.currentTarget.id;
  moveCard(parseInt(data.cardId), data.source, targetId);
  renderAll();
}

/******************************************************
 * MOVER CARTAS
 ******************************************************/
function moveCard(cardId, from, to) {
  // Validação para descarte
  if (to === "discardPile" || to === "discardCards") {
    let totalBefore = getTotalCards();
    if (totalBefore !== 12) {
      showMessage("Só pode descartar com 12 cartas no total.", "error");
      return false;
    }
  }

  // Remove da origem
  let card = removeCardFromSource(cardId, from);
  if (!card) return false;

  // Adiciona ao destino
  const success = addCardToDestination(card, to, from);
  if (!success) {
    restoreCardToSource(card, from);
    return false;
  }

  // Feedback de sucesso
  if (to === "discardPile" || to === "discardCards") {
    showMessage("Carta descartada!", "success");
  } else {
    showMessage("Carta movida!", "success");
  }

  return true;
}

function removeCardFromSource(cardId, from) {
  if (from === "hand") {
    const idx = playerHand.findIndex(c => c.id === cardId);
    return idx !== -1 ? playerHand.splice(idx, 1)[0] : null;
  } else if (from === "discardPile") {
    const idx = discardPile.findIndex(c => c.id === cardId);
    return idx !== -1 ? discardPile.splice(idx, 1)[0] : null;
  } else if (groups[from]) {
    const idx = groups[from].findIndex(c => c.id === cardId);
    return idx !== -1 ? groups[from].splice(idx, 1)[0] : null;
  }
  return null;
}

function addCardToDestination(card, to, from) {
  if (to === "discardPile" || to === "discardCards") {
    discardPile.push(card);
    return true;
  } else if (to === "playerHand") {
    playerHand.push(card);
    return true;
  } else if (groups[to]) {
    const dropZone = document.getElementById(to);
    const max = parseInt(dropZone.dataset.max);
    if (groups[to].length >= max) {
      showMessage(`Grupo já está completo (${max} cartas).`, "error");
      return false;
    }
    groups[to].push(card);
    return true;
  }
  return false;
}

function restoreCardToSource(card, from) {
  if (from === "hand") {
    playerHand.push(card);
  } else if (from === "discardPile") {
    discardPile.push(card);
  } else if (groups[from]) {
    groups[from].push(card);
  }
}

/******************************************************
 * VERIFICAR BATIDA
 ******************************************************/
function checkWin() {
  if (
    groups.group1.length !== 3 ||
    groups.group2.length !== 3 ||
    groups.group3.length !== 3 ||
    groups.group4.length !== 2
  ) {
    showMessage("Precisa ter 3+3+3+2 cartas nos grupos.", "error");
    return;
  }
  
  let g1 = groups.group1;
  let g2 = groups.group2;
  let g3 = groups.group3;
  let g4 = groups.group4;
  
  // Verifica cartas 1 ou 9
  if (contains19(g1) || contains19(g2) || contains19(g3) || contains19(g4)) {
    showMessage("Cartas 1 e 9 não podem formar grupos válidos.", "error");
    return;
  }
  
  // Verifica combinações válidas
  if (
    (isValidRun(g1) || isValidGroup(g1)) &&
    (isValidRun(g2) || isValidGroup(g2)) &&
    (isValidRun(g3) || isValidGroup(g3)) &&
    isValidPair(g4)
  ) {
    showMessage("🎉 PARABÉNS! VOCÊ BATEU! 🎉", "success");
    // Adiciona efeito visual de vitória
    document.body.style.animation = "victory 1s ease";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 1000);
  } else {
    showMessage("Combinação inválida. Verifique os grupos.", "error");
  }
}

function contains19(cards) {
  return cards.some(c => c.value === 1 || c.value === 9);
}

function isValidRun(cards) {
  if (cards.length !== 3) return false;
  const color = cards[0].color;
  if (!cards.every(c => c.color === color)) return false;
  const sorted = [...cards].sort((a,b) => a.value - b.value);
  return (
    sorted[1].value === sorted[0].value + 1 &&
    sorted[2].value === sorted[1].value + 1
  );
}

function isValidGroup(cards) {
  if (cards.length !== 3) return false;
  const value = cards[0].value;
  if (!cards.every(c => c.value === value)) return false;
  const colorSet = new Set(cards.map(c => c.color));
  return colorSet.size === 3;
}

function isValidPair(cards) {
  if (cards.length !== 2) return false;
  if (cards[0].value === cards[1].value) return true;
  if (cards[0].color === cards[1].color) {
    let diff = Math.abs(cards[0].value - cards[1].value);
    if (diff === 1) return true;
  }
  return false;
}

/******************************************************
 * MODAL DE REGRAS
 ******************************************************/
function setupModal() {
  const modal = document.getElementById("rulesModal");
  const btnRules = document.getElementById("btnRules");
  const closeBtn = document.querySelector(".close");

  btnRules.addEventListener("click", () => {
    modal.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}

/******************************************************
 * INICIALIZAÇÃO
 ******************************************************/
window.addEventListener("load", function() {
  // Registra service worker para PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('ServiceWorker registrado com sucesso:', registration.scope);
      })
      .catch(function(error) {
        console.log('Falha ao registrar ServiceWorker:', error);
      });
  }

  // Configura eventos
  setupZoneEvents();
  setupModal();

  // Botões
  document.getElementById("btnStart").addEventListener("click", startGame);
  document.getElementById("btnRestart").addEventListener("click", resetGameState);
  document.getElementById("btnDraw").addEventListener("click", drawCard);
  document.getElementById("btnCheckWin").addEventListener("click", checkWin);

  // Mensagem inicial
  showMessage("Bem-vindo ao MATRIX Mobile! Toque em 'Iniciar' para começar.", "info");
  
  // Adiciona CSS para animação de vitória
  const style = document.createElement("style");
  style.textContent = `
    @keyframes victory {
      0%, 100% { background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%); }
      50% { background: linear-gradient(135deg, #00ff41 0%, #00cc33 100%); }
    }
  `;
  document.head.appendChild(style);
});

// Previne zoom no double-tap em iOS
document.addEventListener('touchend', function (event) {
  const now = (new Date()).getTime();
  if (now - touchStartTime < 500) {
    event.preventDefault();
  }
}, false);