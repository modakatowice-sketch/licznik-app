let count = 0;

const countEl = document.getElementById('count');
const incrementBtn = document.getElementById('increment');
const resetBtn = document.getElementById('reset');

incrementBtn.addEventListener('click', () => {
  count++;
  countEl.textContent = count;
});

resetBtn.addEventListener('click', () => {
  count = 0;
  countEl.textContent = count;
});
