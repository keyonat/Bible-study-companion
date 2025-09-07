// study.js — simple on-page "mock AI" so you can test the flow safely

function mockSummarize(text) {
  // Very simple "summary": first 1–2 sentences or first ~200 chars
  const clean = text.trim().replace(/\s+/g, ' ');
  const sentences = clean.split(/(?<=[.!?])\s+/);
  if (sentences.length > 1) return sentences.slice(0, 2).join(' ');
  return clean.slice(0, 200) + (clean.length > 200 ? '…' : '');
}

function mockThemes(text) {
  const t = text.toLowerCase();
  const themes = new Set();

  // super simple keyword-based tags
  if (/(love|kindness|mercy)/.test(t)) themes.add('Love & Mercy');
  if (/(faith|believe|trust)/.test(t)) themes.add('Faith & Trust');
  if (/(fear|enemy|trouble|valley)/.test(t)) themes.add('Comfort in Trials');
  if (/(hope|promise|covenant)/.test(t)) themes.add('Hope & Promise');
  if (/(wisdom|understanding|instruction)/.test(t)) themes.add('Wisdom & Guidance');
  if (/(righteous|justice|holy|sin)/.test(t)) themes.add('Holiness & Righteousness');
  if (/(shepherd|king|lord|god|jesus|spirit)/.test(t)) themes.add('God’s Character');

  // fallback
  if (themes.size === 0) themes.add('Reflection & Application');

  return Array.from(themes).slice(0, 4);
}

function mockReflectionQuestion(text) {
  // Tiny heuristic prompt
  if (/shepherd/i.test(text)) return 'Where have you seen God guiding you like a shepherd this week?';
  if (/love/i.test(text)) return 'How can you show this kind of love to someone today?';
  if (/fear/i.test(text)) return 'What is one fear you can hand over to God right now?';
  if (/wisdom|understanding/i.test(text)) return 'What decision are you facing that needs wisdom?';
  return 'What is one small action you can take today to live out this passage?';
}

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('passage');
  const btn = document.getElementById('analyzeBtn');
  const results = document.getElementById('results');
  const summaryEl = document.getElementById('summary');
  const themesEl = document.getElementById('themes');
  const questionEl = document.getElementById('question');

  btn.addEventListener('click', () => {
    const text = (textarea.value || '').trim();
    if (!text) {
      alert('Please paste a verse or short passage.');
      textarea.focus();
      return;
    }

    // "Process" the text
    const summary = mockSummarize(text);
    const themes = mockThemes(text);
    const question = mockReflectionQuestion(text);

    // Update UI
    summaryEl.textContent = summary;
    themesEl.innerHTML = '';
    themes.forEach(th => {
      const li = document.createElement('li');
      li.textContent = '• ' + th;
      themesEl.appendChild(li);
    });
    questionEl.textContent = question;

    results.style.display = 'block';
    // Scroll into view nicely
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
