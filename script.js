// script.js — handles instant feedback, scoring, answers reveal and reset
// Short comments explain the main parts of the code.

// Wait until the DOM is parsed (script is deferred in HTML)
(() => {
  // Grab elements we need
  const quiz = document.getElementById('quiz');
  const questions = quiz.querySelectorAll('.question');
  const scoreBadge = document.getElementById('score');
  const showScoreBtn = document.getElementById('showScore');
  const resetBtn = document.getElementById('reset');
  const finalBox = document.getElementById('final');

  const toggleAnswersBtn = document.getElementById('toggleAnswers');
  const answersBox = document.getElementById('answers');

  // Track how many answered and how many correct
  let totalAnswered = 0;
  let correctCount = 0;

  // Update the score badge (visible top-right)
  function updateScore() {
    scoreBadge.textContent = `Score: ${correctCount} / ${totalAnswered}`;
  }

  // Handle a user's answer for one question (fieldset)
  function handleAnswer(fieldset, chosenValue) {
    // Prevent changing answer after it's been marked
    if (fieldset.dataset.answered === 'true') return;

    const correct = fieldset.dataset.correct; // stored on the element
    const feedback = fieldset.querySelector('.feedback');

    // Mark answered
    fieldset.dataset.answered = 'true';
    totalAnswered += 1;

    // Compare as strings (dataset values are strings)
    if (String(chosenValue) === String(correct)) {
      correctCount += 1;
      feedback.textContent = '✓ Correct!';
      feedback.style.color = 'var(--good)';
      fieldset.classList.add('correct');
    } else {
      feedback.textContent = `✗ Not quite. Correct answer: ${correct}`;
      feedback.style.color = 'var(--bad)';
      fieldset.classList.add('incorrect');
    }

    // Disable all options for this question to lock the answer
    fieldset.querySelectorAll('input[type="radio"]').forEach(i => i.disabled = true);

    updateScore();
  }

  // Attach one listener per question to detect when a radio is chosen
  questions.forEach(fs => {
    fs.addEventListener('change', (e) => {
      const target = e.target;
      if (target && target.matches('input[type="radio"]')) {
        handleAnswer(fs, target.value);
      }
    });
  });

  // Show final score button behaviour
  showScoreBtn.addEventListener('click', () => {
    const total = questions.length;
    if (totalAnswered < total) {
      finalBox.textContent = `You scored ${correctCount} out of ${total}. Try to answer all questions for full feedback.`;
    } else {
      finalBox.textContent = `Great work! Final score: ${correctCount} / ${total}.`;
    }
  });

  // Reset quiz to allow retry
  resetBtn.addEventListener('click', () => {
    totalAnswered = 0;
    correctCount = 0;
    finalBox.textContent = '';
    questions.forEach(fs => {
      fs.dataset.answered = 'false';
      fs.classList.remove('correct', 'incorrect');
      const fb = fs.querySelector('.feedback');
      fb.textContent = '';
      fb.style.color = '';
      fs.querySelectorAll('input[type="radio"]').forEach(i => {
        i.disabled = false;
        i.checked = false;
      });
    });
    updateScore();
  });

  // Toggle practice answers visibility
  toggleAnswersBtn.addEventListener('click', () => {
    const shown = answersBox.style.display === 'block';
    answersBox.style.display = shown ? 'none' : 'block';
    answersBox.setAttribute('aria-hidden', shown ? 'true' : 'false');
    toggleAnswersBtn.textContent = shown ? 'Show answers' : 'Hide answers';
  });

  // Small visual tap feedback for labels (mobile-friendly)
  quiz.addEventListener('click', (e) => {
    const label = e.target.closest('label');
    if (!label) return;
    label.style.background = 'rgba(255,255,255,0.03)';
    setTimeout(() => label.style.background = '', 160);
  });

  // Initialize score display on load
  updateScore();
})();
