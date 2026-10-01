var codingQuestions = [
  { topic: 'Arrays', difficulty: 'Easy', title: 'Find the largest and smallest element in an array.', prompt: 'Walk through a single-pass approach and explain its time complexity.' },
  { topic: 'Arrays', difficulty: 'Medium', title: 'Find the missing number from a sequence of 1 to n.', prompt: 'Compare the arithmetic-sum and XOR approaches.' },
  { topic: 'Arrays', difficulty: 'Hard', title: 'Find the maximum sum subarray.', prompt: 'Explain how Kadane\'s algorithm tracks a local and global best.' },
  { topic: 'Strings', difficulty: 'Easy', title: 'Check whether a string is a palindrome.', prompt: 'Consider a two-pointer solution and how you handle case and spaces.' },
  { topic: 'Strings', difficulty: 'Medium', title: 'Find the first non-repeating character.', prompt: 'Describe the frequency map and the order-preserving second pass.' },
  { topic: 'Strings', difficulty: 'Hard', title: 'Find the longest substring without repeating characters.', prompt: 'Use a sliding window and justify when its left edge moves.' },
  { topic: 'DBMS', difficulty: 'Easy', title: 'Explain the difference between DELETE, TRUNCATE, and DROP.', prompt: 'Compare scope, rollback behavior, and table structure.' },
  { topic: 'DBMS', difficulty: 'Medium', title: 'Write a query to find the second-highest salary.', prompt: 'Discuss a subquery solution and what happens with duplicate salaries.' },
  { topic: 'DBMS', difficulty: 'Hard', title: 'Design indexes for a frequently filtered orders table.', prompt: 'Explain selectivity, composite indexes, and the write trade-off.' },
  { topic: 'OOP', difficulty: 'Easy', title: 'Explain encapsulation with a practical example.', prompt: 'Show how access control protects an object\'s internal state.' },
  { topic: 'OOP', difficulty: 'Medium', title: 'Compare composition and inheritance.', prompt: 'Give a case where composition makes a design easier to change.' },
  { topic: 'OOP', difficulty: 'Hard', title: 'Design a thread-safe singleton and discuss its trade-offs.', prompt: 'Cover lazy initialization, synchronization, and testability.' },
  { topic: 'OS', difficulty: 'Easy', title: 'What is the difference between a process and a thread?', prompt: 'Compare memory, scheduling, and communication.' },
  { topic: 'OS', difficulty: 'Medium', title: 'Explain virtual memory and page faults.', prompt: 'Describe how the operating system maps virtual to physical memory.' },
  { topic: 'OS', difficulty: 'Hard', title: 'Explain the necessary conditions for deadlock.', prompt: 'Name all four conditions and one strategy for preventing deadlocks.' }
];

document.addEventListener('DOMContentLoaded', function () {
  var list = document.getElementById('coding-list');
  if (!list) return;
  var search = document.getElementById('coding-search');
  var topic = document.getElementById('topic-filter');
  var difficulty = document.getElementById('difficulty-filter');
  var count = document.getElementById('results-count');
  var empty = document.getElementById('no-results');

  // Filters the question bank whenever a control changes.
  function renderQuestions() {
    var query = search.value.trim().toLowerCase();
    var matches = codingQuestions.filter(function (item) {
      var searchable = (item.title + ' ' + item.prompt + ' ' + item.topic).toLowerCase();
      return (!query || searchable.indexOf(query) !== -1) && (topic.value === 'all' || item.topic === topic.value) && (difficulty.value === 'all' || item.difficulty === difficulty.value);
    });
    count.textContent = matches.length + ' question' + (matches.length === 1 ? '' : 's');
    empty.hidden = matches.length !== 0;
    list.innerHTML = matches.map(function (item, index) { return '<article class="coding-card card"><div class="coding-card-top"><span class="question-index">' + String(index + 1).padStart(2, '0') + '</span><span class="difficulty ' + item.difficulty.toLowerCase() + '">' + item.difficulty + '</span></div><p class="tag">' + item.topic + '</p><h2>' + item.title + '</h2><p>' + item.prompt + '</p></article>'; }).join('');
  }
  [search, topic, difficulty].forEach(function (control) { control.addEventListener('input', renderQuestions); control.addEventListener('change', renderQuestions); });
  renderQuestions();
});
