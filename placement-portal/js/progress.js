var preparationGroups = [
  { topic: 'Aptitude foundations', tasks: ['Complete one timed aptitude quiz', 'Review mistakes from your last quiz', 'Practice percentages, ratios, and averages'] },
  { topic: 'Technical preparation', tasks: ['Solve five coding questions', 'Revise core DBMS and OS concepts', 'Explain one project without notes'] },
  { topic: 'Interview readiness', tasks: ['Update and proofread your resume', 'Practice your two-minute introduction', 'Prepare three questions for an interviewer'] },
  { topic: 'Communication', tasks: ['Practice one group discussion topic', 'Record and review a mock answer', 'Complete a full mock interview'] },
  { topic: 'Final review', tasks: ['Research your target company', 'Plan your interview-day logistics', 'Get a full night of sleep before the interview'] }
];

document.addEventListener('DOMContentLoaded', function () {
  var checklist = document.getElementById('checklist');
  if (!checklist) return;
  var storageKey = 'placeprep-checklist';
  var saved = JSON.parse(localStorage.getItem(storageKey) || '{}');

  // Renders grouped checklist items using saved completion states.
  function renderChecklist() {
    checklist.innerHTML = preparationGroups.map(function (group, groupIndex) { return '<section class="checklist-group card"><h2>' + group.topic + '</h2><div class="task-list">' + group.tasks.map(function (task, taskIndex) { var id = 'task-' + groupIndex + '-' + taskIndex; var checked = saved[id] ? ' checked' : ''; return '<label class="task-item" for="' + id + '"><input id="' + id + '" type="checkbox" data-task="' + id + '"' + checked + '><span class="custom-check" aria-hidden="true">&#10003;</span><span>' + task + '</span></label>'; }).join('') + '</div></section>'; }).join('');
    checklist.querySelectorAll('input[type="checkbox"]').forEach(function (input) { input.addEventListener('change', function () { saved[input.dataset.task] = input.checked; localStorage.setItem(storageKey, JSON.stringify(saved)); updateProgress(); }); });
    updateProgress();
  }

  // Updates the percentage and progress bar after each task change.
  function updateProgress() {
    var total = preparationGroups.reduce(function (sum, group) { return sum + group.tasks.length; }, 0);
    var completed = Object.keys(saved).filter(function (key) { return saved[key]; }).length;
    var percentage = Math.round((completed / total) * 100);
    document.getElementById('progress-percent').textContent = percentage + '%';
    document.getElementById('progress-count').textContent = completed + ' of ' + total + ' tasks complete';
    document.getElementById('progress-bar').style.width = percentage + '%';
  }

  document.getElementById('reset-progress').addEventListener('click', function () { saved = {}; localStorage.removeItem(storageKey); renderChecklist(); });
  renderChecklist();
});
