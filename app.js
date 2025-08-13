// Klucz w localStorage
const KEY = 'smile-tracker-v1';

// Elementy DOM
const todayEl       = document.getElementById('today');
const yesBtn        = document.getElementById('yesBtn');
const noBtn         = document.getElementById('noBtn');
const todayStatusEl = document.getElementById('todayStatus');

const daysTotalEl = document.getElementById('daysTotal');
const yesCountEl  = document.getElementById('yesCount');
const noCountEl   = document.getElementById('noCount');
const yesPctEl    = document.getElementById('yesPct');
const yesStreakEl = document.getElementById('yesStreak');

const last7El     = document.getElementById('last7');
const resetBtn    = document.getElementById('resetBtn');

// Narzędzia daty
function fmt(d){ return d.toISOString().slice(0,10); } // YYYY-MM-DD
function todayStr(){ return fmt(new Date()); }
function addDays(date, delta){
  const d = new Date(date); d.setDate(d.getDate()+delta); return d;
}

// Odczyt/zapis
function load(){
  try{
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { answers: {} };
  }catch(e){
    return { answers: {} };
  }
}
function save(state){ localStorage.setItem(KEY, JSON.stringify(state)); }

// Logika statystyk
function computeStats(state){
  const ans = state.answers || {};
  const keys = Object.keys(ans).sort(); // rosnąco po dacie

  let yes = 0, no = 0;
  for(const k of keys){ ans[k] === 'yes' ? yes++ : no++; }

  const totalDays = keys.length;
  const pct = totalDays ? Math.round((yes/totalDays)*100) : 0;

  // Passa 'yes' od dzisiaj wstecz
  let streak = 0;
  let cursor = new Date();
  while(true){
    const k = fmt(cursor);
    if(ans[k] === 'yes'){
      streak++;
      cursor = addDays(cursor, -1);
    }else{
      break;
    }
  }

  return { totalDays, yes, no, pct, streak };
}

// Render
function render(){
  const state = load();
  const ans = state.answers || {};
  const t = todayStr();

  // nagłówek z datą
  const d = new Date();
  todayEl.textContent = d.toLocaleDateString('pl-PL', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  // status dnia
  if(ans[t] === 'yes'){
    todayStatusEl.textContent = 'Dziś: TAK. Piękny uśmiech! 🟢';
  }else if(ans[t] === 'no'){
    todayStatusEl.textContent = 'Dziś: NIE. Może zaraz znajdzie się powód do uśmiechu? 🔵';
  }else{
    todayStatusEl.textContent = 'Brak odpowiedzi na dziś.';
  }

  // statystyki
  const s = computeStats(state);
  daysTotalEl.textContent = s.totalDays;
  yesCountEl.textContent  = s.yes;
  noCountEl.textContent   = s.no;
  yesPctEl.textContent    = `${s.pct}%`;
  yesStreakEl.textContent = s.streak;

  // ostatnie 7 dni (od dzisiaj wstecz)
  last7El.innerHTML = '';
  for(let i=6;i>=0;i--){
    const day = addDays(new Date(), -i);
    const key = fmt(day);
    const val = ans[key];
    const sym = val === 'yes' ? '🟢' : (val === 'no' ? '🔵' : '⚪');

    const li = document.createElement('li');
    li.innerHTML = `<span class="sym">${sym}</span><span class="dt">${day.toLocaleDateString('pl-PL', {day:'2-digit', month:'2-digit'})}</span>`;
    last7El.appendChild(li);
  }
}

// Zdarzenia
yesBtn.addEventListener('click', () => {
  const state = load();
  state.answers[todayStr()] = 'yes';
  save(state);
  render();
});

noBtn.addEventListener('click', () => {
  const state = load();
  state.answers[todayStr()] = 'no';
  save(state);
  render();
});

resetBtn.addEventListener('click', () => {
  if(confirm('Na pewno wyczyścić wszystkie dane uśmiechów?')){
    localStorage.removeItem(KEY);
    render();
  }
});

// Start
render();
