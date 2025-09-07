// docs/study.js
// Handles Analyze button, switches between local mock and Netlify function

document.addEventListener('DOMContentLoaded', () => {
  const textarea   = document.getElementById('passage');
  const analyzeBtn = document.getElementById('analyzeBtn');

  const resultsBox = document.getElementById('results');
  const summaryEl  = document.getElementById('summary');
  const themesEl   = document.getElementById('themes');
  const questionEl = document.getElementById('question');

  // Helper: render bullet themes
  function renderThemes(items = []) {
    themesEl.innerHTML = '';
    items.forEach(t => {
      const li = document.createElement('li');
      li.textContent = t;
      themesEl.appendChild(li);
    });
  }

  // Helper: button loading state
  function setLoading(isLoading) {
    analyzeBtn.disabled = isLoading;
    analyzeBtn.textContent = isLoading ? 'Analyzing…' : 'Analyze';
  }

  // Mock AI (for local testing without Netlify)
  function mockAnalyzeText(text) {
    return {
      summary: `Mock summary: ${text.slice(0, 50)}...`,
      themes: ["Faith", "Obedience", "Reflection"],
      question: "What is one way you can apply this today?"
    };
  }

  // Button handler
  analyzeBtn.addEventListener('click', async () => {
    const text = (textarea.value || '').trim();
    if (!text) {
      alert('Please paste a verse or short passage.');
      return;
    }

    // Reset UI
    setLoading(true);
    summaryEl.textContent = 'Thinking…';
    renderThemes([]);
    questionEl.textContent = '';
    resultsBox.style.display = 'block';

    try {
      // Decide: local vs Netlify
      const isLocal = location.protocol === 'file:' || location.hostname === 'localhost';

      if (isLocal) {
        // ✅ LOCAL TESTING: always mock
        const data = mockAnalyzeText(text);
        summaryEl.textContent = data.summary || '';
        renderThemes(data.themes);
        questionEl.textContent = data.question || '';
      } else {
        // ✅ NETLIFY DEPLOY: call your function
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
        summaryEl.textContent = data.summary || '';
        renderThemes(Array.isArray(data.themes) ? data.themes : []);
        questionEl.textContent = data.question || '';
      }
    } catch (err) {
      console.error(err);
      summaryEl.textContent = 'Unexpected error. Please try again.';
    } finally {
      setLoading(false);
    }
  });
});
