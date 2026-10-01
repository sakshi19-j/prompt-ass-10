document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('password-input');
  var toggle = document.getElementById('toggle-password');
  var fill = document.getElementById('strength-fill');
  var strengthLabel = document.getElementById('strength-label');
  var scoreLabel = document.getElementById('strength-score');
  var strengthMessage = document.getElementById('strength-message');
  var lengthValue = document.getElementById('length-value');
  var charsetValue = document.getElementById('charset-value');
  var entropyValue = document.getElementById('entropy-value');
  var timeValue = document.getElementById('time-value');
  var checklistCount = document.getElementById('checklist-count');
  var generate = document.getElementById('generate-password');
  var copy = document.getElementById('copy-password');
  var copyStatus = document.getElementById('copy-status');
  var tipsList = document.getElementById('tips-list');
  var checklistKeys = ['length', 'uppercase', 'lowercase', 'digit', 'symbol'];
  var generatedPassword = '';

  function render(result) {
    var checks = {
      length: result.length >= 12,
      uppercase: result.hasUppercase,
      lowercase: result.hasLowercase,
      digit: result.hasDigit,
      symbol: result.hasSymbol
    };
    var complete = 0;
    checklistKeys.forEach(function (key) {
      var item = document.getElementById('check-' + key);
      item.classList.toggle('is-complete', checks[key]);
      if (checks[key]) complete += 1;
    });
    strengthLabel.textContent = result.label;
    scoreLabel.textContent = result.score + '/4';
    fill.style.width = (result.score * 25) + '%';
    fill.dataset.level = result.score;
    fill.parentElement.setAttribute('aria-valuenow', result.score);
    lengthValue.textContent = result.length;
    charsetValue.textContent = result.characterSetSize;
    entropyValue.textContent = result.entropy.toFixed(1) + ' bits';
    timeValue.textContent = result.bruteForceTime;
    checklistCount.textContent = complete + '/5';
    strengthMessage.textContent = result.length === 0 ? 'Type a password to check it locally.' : result.isCommon || result.hasPattern ? 'Random-password estimate only; known or patterned passwords may be guessed much sooner.' : 'Random-password estimate only; real passwords may be less random than this model assumes.';
    tipsList.innerHTML = result.tips.map(function (tip) { return '<li>' + tip + '</li>'; }).join('');
  }

  function randomCharacter(chars) {
    var values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return chars[values[0] % chars.length];
  }

  function shuffle(value) {
    var characters = value.split('');
    var values = new Uint32Array(characters.length);
    crypto.getRandomValues(values);
    for (var index = characters.length - 1; index > 0; index -= 1) {
      var swapIndex = values[index] % (index + 1);
      var temporary = characters[index];
      characters[index] = characters[swapIndex];
      characters[swapIndex] = temporary;
    }
    return characters.join('');
  }

  function generateStrongPassword() {
    var sets = window.PasswordStrength;
    var required = randomCharacter('abcdefghijklmnopqrstuvwxyz') + randomCharacter('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + randomCharacter('0123456789') + randomCharacter("!@#$%^&*()-_=+[]{};:',.<>/?\\|`~");
    var all = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};\':,.<>/?\\|`~';
    for (var index = required.length; index < 16; index += 1) required += randomCharacter(all);
    generatedPassword = shuffle(required);
    input.value = generatedPassword;
    copy.disabled = false;
    copyStatus.textContent = '';
    render(sets.analyzePassword(generatedPassword));
  }

  input.addEventListener('input', function () {
    generatedPassword = '';
    copy.disabled = input.value.length === 0;
    copyStatus.textContent = '';
    render(window.PasswordStrength.analyzePassword(input.value));
  });
  toggle.addEventListener('click', function () {
    var isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? 'Hide' : 'Show';
    toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
  generate.addEventListener('click', generateStrongPassword);
  copy.addEventListener('click', function () {
    if (!input.value) return;
    navigator.clipboard.writeText(input.value).then(function () {
      copyStatus.textContent = 'Copied!';
      window.setTimeout(function () { copyStatus.textContent = ''; }, 1800);
    }).catch(function () {
      copyStatus.textContent = 'Copy unavailable';
    });
  });
  render(window.PasswordStrength.analyzePassword(''));
});
