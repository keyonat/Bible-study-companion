document.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const passageEl = document.getElementById("passage");
  const summaryEl = document.getElementById("summary");
  const themesList = document.getElementById("themesList");
  const questionEl = document.getElementById("question");
  const resultsBox = document.getElementById("results");

  function setLoading(isLoading) {
    if (isLoading) {
      analyzeBtn.disabled = true;
      analyzeBtn.textContent = "Analyzing...";
    } else {
      analyzeBtn.disabled = false;
      analyzeBtn.textContent = "Analyze";
    }
  }

  function renderThemes(themes) {
    themesList.innerHTML = "";
    if (Array.isArray(themes)) {
      themes.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        themesList.appendChild(li);
      });
    }
  }

  analyzeBtn.addEventListener("click", async () => {
    const text = passageEl.value.trim();
    if (!text) {
      alert("Please enter a verse or passage.");
      return;
    }

    // Reset UI + show loading
    setLoading(true);
    summaryEl.textContent = "Thinking...";
    renderThemes([]);
    questionEl.textContent = "";
    resultsBox.style.display = "block";

    try {
      // Call mock AI response for now
      const mockData = {
        summary: `You entered: "${text}"`,
        themes: ["Faith", "Trust", "Encouragement"],
        question: "How can you apply this verse today?",
      };

      // Simulate a small delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Display results
      summaryEl.textContent = mockData.summary;
      renderThemes(mockData.themes);
      questionEl.textContent = mockData.question;
    } catch (err) {
      console.error("Unexpected error:", err);
      summaryEl.textContent = "Something went wrong.";
    } finally {
      setLoading(false);
    }
  });
});
