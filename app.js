const suits = ["♠","♥","♣","♦"];
const values = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];
const main = document.getElementById("playing-cards");

const themeBtn = document.getElementById("theme-toggle");
const shuffleBtn = document.getElementById("shuffle-deck");
const dealBtn = document.getElementById("deal-hands");
const resetBtn = document.getElementById("reset-deck");

let deck = [];
let hands = [];
let cardElements = [];

// INITIAL MODE
document.body.classList.add("dark");

// THEME TOGGLE
themeBtn.addEventListener("click", ()=>{
  if(document.body.classList.contains("dark")){
    document.body.classList.replace("dark","light");
    themeBtn.textContent="☀︎";
  }else{
    document.body.classList.replace("light","dark");
    themeBtn.textContent="☾";
  }
  updateCardColors();
});

// SHUFFLE BUTTON
shuffleBtn.addEventListener("click", ()=>{
  if(hands.length>0) shuffleHands();
  else shuffleDeck();
});

// DEAL HANDS
dealBtn.addEventListener("click", ()=> dealHands(4,5));

// RESET BUTTON
resetBtn.addEventListener("click", resetDeck);

// GENERATE DECK
function generateDeck(){
  deck=[];
  suits.forEach(suit=> values.forEach(val=> deck.push({suit,val})));
  deck.push({suit:"🃏",val:"Joker"});
  deck.push({suit:"🃏",val:"Joker"});
}

// CREATE CARD ELEMENT
function createCardElement(card){
  const cardEl=document.createElement("div");
  cardEl.classList.add("card");

  if(card.suit==="♠") cardEl.classList.add("spades");
  if(card.suit==="♥") cardEl.classList.add("hearts");
  if(card.suit==="♣") cardEl.classList.add("clubs");
  if(card.suit==="♦") cardEl.classList.add("diamonds");

  const color = ["♥","♦"].includes(card.suit) ? "red" : "black";

  cardEl.innerHTML=`
    <div class="card-inner">
      <div class="card-front">
        <div class="left ${color}">${card.suit} ${card.val}</div>
        <div class="middle ${color}"><span>${card.suit}</span></div>
        <div class="right ${color}">${card.suit} ${card.val}</div>
      </div>
      <div class="card-back">🂠</div>
    </div>
  `;

  main.appendChild(cardEl);
  return cardEl;
}

// INITIALIZE DECK
generateDeck();
cardElements = deck.map(createCardElement);
stackDeck();
updateCardColors();

// STACK CARDS IN CENTER
function stackDeck(){
  cardElements.forEach((c,i)=>{
    c.style.position="absolute";
    c.style.left="50%";
    c.style.top="50%";
    c.style.transform="translate(-50%,-50%) rotate("+i*0.5+"deg)";
    c.style.zIndex=i;
  });
}

// SHUFFLE DECK AROUND PAGE
function shuffleDeck(){
  cardElements.forEach((c,i)=>{
    const left = Math.random()*(window.innerWidth-150);
    const top = Math.random()*(window.innerHeight-150);
    c.style.left = left+"px";
    c.style.top = top+"px";
    c.style.transform = "rotate("+Math.random()*360+"deg)";
  });
}

// UPDATE CARD COLORS BASED ON MODE
function updateCardColors(){
  const isLight = document.body.classList.contains("light");
  cardElements.forEach(c=>{
    const spans = c.querySelectorAll(".black, .red");
    spans.forEach(span=>{
      if(span.classList.contains("black")) span.style.color = isLight ? "white" : "black";
      if(span.classList.contains("red")) span.style.color = "red";
    });
  });
}

// DEAL HANDS
function dealHands(numHands=4,maxCards=5){
  hands=[];
  main.innerHTML="";
  const cardsToDeal = Math.min(deck.length,numHands*maxCards);
  hands = Array.from({length:numHands},()=>[]);
  for(let i=0;i<cardsToDeal;i++) hands[i%numHands].push(deck[i]);

  hands.forEach((hand,index)=>{
    const container=document.createElement("div");
    container.classList.add("hand-container");

    const label=document.createElement("div");
    label.classList.add("hand-label");
    label.textContent=`Hand ${index+1}`;
    container.appendChild(label);

    const handDiv=document.createElement("div");
    handDiv.classList.add("hand");

    hand.forEach((card,i)=>{
      const cardEl=createCardElement(card);
      cardEl.style.position="relative";
      cardEl.style.opacity=0;
      cardEl.style.transform="translateY(-50px)";
      handDiv.appendChild(cardEl);
      setTimeout(()=>{
        cardEl.style.opacity=1;
        cardEl.style.transform="translateY(0)";
      },i*100);
    });

    container.appendChild(handDiv);
    main.appendChild(container);
  });

  updateCardColors();
}

// SHUFFLE CARDS IN HANDS ONLY
function shuffleHands(){
  const handDivs=document.querySelectorAll('.hand');
  handDivs.forEach(hand=>{
    const cards=[...hand.children];
    cards.sort(()=>Math.random()-0.5);
    cards.forEach(c=>hand.appendChild(c));
  });
}

// RESET
function resetDeck(){
  main.innerHTML="";
  hands=[];
  cardElements = deck.map(createCardElement);
  stackDeck();
  updateCardColors();
}