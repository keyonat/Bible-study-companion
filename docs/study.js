// docs/study.js

document.addEventListener('DOMContentLoaded', () => {
  const textarea   = document.getElementById('passage');
  const analyzeBtn = document.getElementById('analyzeBtn');

  const resultsBox = document.getElementById('results');
  const summaryEl  = document.getElementById('summary');
  const themesEl   = document.getElementById('themes');
  const questionEl = document.getElementById('question');

  function renderThemes(items = []) {
    themesEl.innerHTML = '';
    items.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      themesEl.appendChild(li);
    });
  }

  function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    analyzeBtn.textContent = isLoading ? 'Analyzing…' : 'Analyze';
  }

  analyzeBtn.addEventListener('click', async () => {
    const text = (textarea.value || '').trim();
    if (!text) {
      alert('Please paste a verse or short passage.');
      return;
    }

    setLoading(true);
    summaryEl.textContent = 'Thinking…';
    renderThemes([]);
    questionEl.textContent = '';
    resultsBox.style.display = 'block';

    try {
      // Call your Netlify Function (same origin on Netlify)
      const res = await fetch('/.netlify/functions/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        summaryEl.textContent =
          `There was a problem contacting the AI service (status ${res.status}).`;
        console.error('Function error:', res.status, detail);
        return;
      }

      const data = await res.json(); // { summary, themes, question }

      summaryEl.textContent = data.summary || '—';
      renderThemes(Array.isArray(data.themes) ? data.themes : []);
      questionEl.textContent = data.question || '—';
    } catch (err) {
      console.error(err);
      summaryEl.textContent = 'Network error contacting the AI service.';
    } finally {
      setLoading(false);
    }
  });
});
