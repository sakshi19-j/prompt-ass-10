(function (root) {
  'use strict';

  var CHARACTER_SETS = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    digits: '0123456789',
    symbols: "!@#$%^&*()-_=+[]{};:',.<>/?\\|`~"
  };
  var COMMON_PASSWORDS = [
    '123456', 'password', '123456789', '12345678', 'qwerty', '12345', '1234567', '111111',
    '123123', 'abc123', 'password1', 'iloveyou', 'admin', 'welcome', 'monkey', 'login',
    'letmein', 'dragon', 'football', 'master', 'qwerty123', 'passw0rd'
  ];
  var LABELS = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];

  function hasSequence(password) {
    var lower = password.toLowerCase();
    for (var index = 0; index <= lower.length - 4; index += 1) {
      var chunk = lower.slice(index, index + 4);
      var ascending = true;
      var descending = true;
      for (var offset = 1; offset < chunk.length; offset += 1) {
        var difference = chunk.charCodeAt(offset) - chunk.charCodeAt(offset - 1);
        ascending = ascending && difference === 1;
        descending = descending && difference === -1;
      }
      if (ascending || descending) return true;
    }
    return false;
  }

  function hasRepeatedCharacter(password) {
    return password.length > 0 && /^(.)(?:\1)+$/.test(password);
  }

  function getCharacterSetSize(password) {
    var size = 0;
    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/[0-9]/.test(password)) size += 10;
    if (/[^A-Za-z0-9]/.test(password)) size += 32;
    return size;
  }

  function formatBruteForceTime(seconds) {
    if (!isFinite(seconds) || seconds <= 0) return '-';
    if (seconds < 60) return formatNumber(seconds) + ' seconds';
    var minutes = seconds / 60;
    if (minutes < 60) return formatNumber(minutes) + ' minutes';
    var hours = minutes / 60;
    if (hours < 24) return formatNumber(hours) + ' hours';
    var days = hours / 24;
    if (days < 365) return formatNumber(days) + ' days';
    return formatNumber(days / 365) + ' years';
  }

  function formatNumber(number) {
    if (number < 10) return number.toFixed(1);
    if (number < 1000) return Math.round(number).toString();
    if (number < 1000000) return Math.round(number / 1000) + ' thousand';
    if (number < 1000000000) return Math.round(number / 1000000) + ' million';
    if (number < 1000000000000) return Math.round(number / 1000000000) + ' billion';
    return number.toExponential(1);
  }

  function getTips(password, result) {
    var tips = [];
    if (result.length < 12) tips.push('Use at least 12 characters, ideally a memorable passphrase.');
    if (!result.hasUppercase || !result.hasLowercase) tips.push('Mix uppercase and lowercase letters.');
    if (!result.hasDigit || !result.hasSymbol) tips.push('Add a digit and a symbol in an unpredictable place.');
    if (result.isCommon || result.hasPattern) tips.push('Avoid common passwords, repeated characters, and obvious sequences.');
    if (tips.length === 0) tips.push('Keep it unique and never reuse it across accounts.');
    return tips.slice(0, 3);
  }

  function analyzePassword(password) {
    password = typeof password === 'string' ? password : '';
    var length = password.length;
    var characterSetSize = getCharacterSetSize(password);
    var entropy = characterSetSize > 0 ? length * Math.log2(characterSetSize) : 0;
    var normalized = password.toLowerCase();
    var isCommon = COMMON_PASSWORDS.indexOf(normalized) !== -1;
    var hasPattern = hasRepeatedCharacter(password) || hasSequence(password);
    var hasUppercase = /[A-Z]/.test(password);
    var hasLowercase = /[a-z]/.test(password);
    var hasDigit = /[0-9]/.test(password);
    var hasSymbol = /[^A-Za-z0-9]/.test(password);
    var variety = [hasUppercase, hasLowercase, hasDigit, hasSymbol].filter(Boolean).length;
    var score = 0;

    if (length >= 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (variety >= 3 || entropy >= 55) score += 1;
    if (variety === 4 && length >= 16 && entropy >= 80) score += 1;
    if (isCommon || hasPattern) score = Math.max(0, score - 2);
    score = Math.min(4, score);

    var guesses = entropy > 0 ? Math.pow(2, entropy) : 0;
    var result = {
      password: password,
      length: length,
      characterSetSize: characterSetSize,
      entropy: entropy,
      bruteForceSeconds: guesses / 1000000000,
      bruteForceTime: formatBruteForceTime(guesses / 1000000000),
      hasUppercase: hasUppercase,
      hasLowercase: hasLowercase,
      hasDigit: hasDigit,
      hasSymbol: hasSymbol,
      isCommon: isCommon,
      hasPattern: hasPattern,
      score: score,
      label: LABELS[score]
    };
    result.tips = getTips(password, result);
    return result;
  }

  var api = { analyzePassword: analyzePassword, formatBruteForceTime: formatBruteForceTime, getCharacterSetSize: getCharacterSetSize };
  if (typeof module !== 'undefined') module.exports = api;
  if (root) root.PasswordStrength = api;
}(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this)));
