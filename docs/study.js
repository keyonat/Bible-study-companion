// docs/study.js
// Wires the Analyze button to your Netlify Function and fills the UI.

document.addEventListener('DOMContentLoaded', () => {
  // Grab elements
  const textarea   = document.getElementById('passage');
  const btn        = document.getElementById('analyzeBtn');
  const resultsBox = document.getElementById('results');
  const summaryEl  = document.getElementById('summary');
  const themesUl   = document.getElementById('themesList'); // must be a <ul>
  const questionEl = document.getElementById('question');

  // Simple helpers
  function setLoading(isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    if (isLoading) {
      btn.dataset.label = btn.textContent;
      btn.textContent = 'Analyzing…';
    } else {
      btn.textContent = btn.dataset.label || 'Analyze';
    }
  }

  function renderThemes(themes) {
    themesUl.innerHTML = '';
    if (!Array.isArray(themes) || themes.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No themes returned.';
      themesUl.appendChild(li);
      return;
    }
    themes.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      themesUl.appendChild(li);
    });
  }

  // Click handler
  btn.addEventListener('click', async () => {
    const text = (textarea.value || '').trim();
    if (!text) {
      alert('Please paste a verse or short passage.');
      textarea.focus();
      return;
    }

    // Reset UI + show loading
    setLoading(true);
    summaryEl.textContent = 'Thinking…';
    renderThemes([]);
    questionEl.textContent = '';
    resultsBox.style.display = 'block';

    try {
    // Call your Netlify Function (works on your *.netlify.app domain)
    const endpoint = `${window.location.origin}/.netlify/functions/ai`;
    const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    });

      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        summaryEl.textContent = 'There was a problem contacting the AI service.';
        console.error('Function error:', res.status, detail);
        return;
      }

      const data = await res.json();

      // Fill UI
      summaryEl.textContent = data.summary || 'No summary returned.';
      renderThemes(data.themes);
      questionEl.textContent = data.question || 'No reflection question returned.';

      // Scroll results into view
      resultsBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (err) {
      console.error(err);
      summaryEl.textContent = 'Unexpected error. Please try again.';
    } finally {
      setLoading(false);
    }
  });
});
