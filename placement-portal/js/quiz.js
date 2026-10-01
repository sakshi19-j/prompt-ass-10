var quizQuestions = [
  { category: 'Quantitative', question: 'A train travels 360 km in 4 hours. What is its average speed?', options: ['80 km/h', '90 km/h', '100 km/h', '120 km/h'], answer: 1, explanation: 'Average speed is distance divided by time: 360 / 4 = 90 km/h.' },
  { category: 'Logical Reasoning', question: 'Find the next number: 2, 6, 12, 20, 30, ?', options: ['36', '40', '42', '44'], answer: 2, explanation: 'The differences are 4, 6, 8, 10, so the next difference is 12: 30 + 12 = 42.' },
  { category: 'Verbal', question: 'Choose the word closest in meaning to "concise".', options: ['Accurate', 'Brief', 'Complex', 'Formal'], answer: 1, explanation: 'Concise means expressing something clearly in few words, or brief.' },
  { category: 'Quantitative', question: 'What is 20% of 250?', options: ['25', '40', '50', '60'], answer: 2, explanation: '20% is one fifth, and 250 / 5 = 50.' },
  { category: 'Logical Reasoning', question: 'If all Bloops are Razzies and all Razzies are Lazzies, which must be true?', options: ['All Lazzies are Bloops', 'All Bloops are Lazzies', 'No Bloops are Lazzies', 'Some Razzies are not Bloops'], answer: 1, explanation: 'The relationship is transitive: Bloops belong to Razzies, which belong to Lazzies.' },
  { category: 'Verbal', question: 'Select the grammatically correct sentence.', options: ['She have completed the task.', 'She has complete the task.', 'She has completed the task.', 'She completed has the task.'], answer: 2, explanation: 'The present perfect uses has plus the past participle: has completed.' },
  { category: 'Quantitative', question: 'A product marked at 800 is sold at a 15% discount. What is the selling price?', options: ['660', '680', '700', '720'], answer: 1, explanation: 'The discount is 120, so the selling price is 800 - 120 = 680.' },
  { category: 'Logical Reasoning', question: 'Which one does not belong in the group?', options: ['Square', 'Triangle', 'Circle', 'Cube'], answer: 3, explanation: 'Cube is a three-dimensional solid; the other choices are two-dimensional shapes.' },
  { category: 'Verbal', question: 'Complete the analogy: Book is to Reading as Fork is to ____.', options: ['Writing', 'Eating', 'Cooking', 'Cutting'], answer: 1, explanation: 'A book is used for reading, while a fork is commonly used for eating.' },
  { category: 'Quantitative', question: 'If 5 workers finish a job in 12 days, how many days would 10 workers take at the same rate?', options: ['3', '5', '6', '8'], answer: 2, explanation: 'Doubling the workers halves the time: 12 / 2 = 6 days.' }
];

document.addEventListener('DOMContentLoaded', function () {
  var questionIndex = 0;
  var score = 0;
  var selectedAnswer = null;
  var answersGiven = [];
  var questionText = document.getElementById('question-text');
  if (!questionText) return;
  var count = document.getElementById('question-count');
  var category = document.getElementById('quiz-category');
  var progress = document.getElementById('quiz-progress');
  var options = document.getElementById('answer-options');
  var feedback = document.getElementById('feedback');
  var nextButton = document.getElementById('next-button');
  var questionArea = document.getElementById('question-area');
  var result = document.getElementById('quiz-result');

  // Renders the current question and resets its answer state.
  function renderQuestion() {
    var item = quizQuestions[questionIndex];
    selectedAnswer = null;
    count.textContent = 'Question ' + (questionIndex + 1) + ' of ' + quizQuestions.length;
    category.textContent = item.category;
    progress.style.width = ((questionIndex / quizQuestions.length) * 100) + '%';
    questionText.textContent = item.question;
    options.innerHTML = '';
    feedback.textContent = '';
    feedback.className = 'feedback';
    nextButton.disabled = true;
    nextButton.textContent = 'Check answer \u2192';
    item.options.forEach(function (option, index) {
      var button = document.createElement('button');
      button.type = 'button';
      button.className = 'answer-option';
      button.textContent = option;
      button.addEventListener('click', function () { selectAnswer(index, button); });
      options.appendChild(button);
    });
  }

  // Stores an answer and gives immediate visual feedback.
  function selectAnswer(index, button) {
    if (selectedAnswer !== null) return;
    var item = quizQuestions[questionIndex];
    selectedAnswer = index;
    answersGiven[questionIndex] = index;
    document.querySelectorAll('.answer-option').forEach(function (option) { option.disabled = true; });
    button.classList.add(index === item.answer ? 'correct' : 'incorrect');
    if (index !== item.answer) document.querySelectorAll('.answer-option')[item.answer].classList.add('correct');
    if (index === item.answer) { score += 1; feedback.textContent = 'Correct. ' + item.explanation; feedback.classList.add('success'); } else { feedback.textContent = 'Not quite. ' + item.explanation; feedback.classList.add('error'); }
    nextButton.disabled = false;
    nextButton.textContent = questionIndex === quizQuestions.length - 1 ? 'See results \u2192' : 'Next question \u2192';
    progress.style.width = (((questionIndex + 1) / quizQuestions.length) * 100) + '%';
  }

  // Advances the quiz or displays the final review.
  nextButton.addEventListener('click', function () { if (questionIndex < quizQuestions.length - 1) { questionIndex += 1; renderQuestion(); } else { showResults(); } });

  // Builds a review list so every answer can be revisited.
  function showResults() {
    questionArea.hidden = true;
    document.querySelector('.quiz-header').hidden = true;
    document.querySelector('.progress-track').hidden = true;
    result.hidden = false;
    result.innerHTML = '<p class="eyebrow">Quiz complete</p><h2>You scored ' + score + ' / ' + quizQuestions.length + '</h2><p class="result-message">Review the answers below and use them to guide your next practice session.</p><div class="review-list">' + quizQuestions.map(function (item, index) { var choice = answersGiven[index]; return '<article class="review-item"><strong>' + (index + 1) + '. ' + item.question + '</strong><span class="review-answer">Correct answer: ' + item.options[item.answer] + '</span><p>' + item.explanation + '</p><small>Your answer: ' + (choice === undefined ? 'Not answered' : item.options[choice]) + '</small></article>'; }).join('') + '</div><button id="restart-quiz" class="button button-primary" type="button">Restart quiz</button>';
    document.getElementById('restart-quiz').addEventListener('click', function () { window.location.reload(); });
  }
  renderQuestion();
});
