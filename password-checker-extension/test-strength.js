const assert = require('node:assert/strict');
const { analyzePassword } = require('./strength.js');

const samples = [
  { name: 'empty', password: '', check: result => result.score === 0 && result.entropy === 0 },
  { name: 'common password', password: 'password', check: result => result.isCommon && result.score <= 1 },
  { name: 'numeric sequence', password: '123456', check: result => result.isCommon && result.hasPattern },
  { name: 'mixed memorable sample', password: 'Tr0ub4dor&3', check: result => result.hasUppercase && result.hasLowercase && result.hasDigit && result.hasSymbol && result.entropy > 0 },
  { name: 'sixteen-character random', password: 'G7!qL2@vP9#xR4$m', check: result => result.length === 16 && result.score >= 3 },
  { name: 'repeated character', password: 'aaaaaaaaaaaa', check: result => result.hasPattern && result.score <= 1 },
  { name: 'sequence pattern', password: 'abcdEFGH1234', check: result => result.hasPattern },
  { name: 'strong varied password', password: 'vN8$kP2!rT6@xQ9#', check: result => result.characterSetSize === 94 && result.label === 'Very Strong' }
];

let failures = 0;
for (const sample of samples) {
  try {
    assert.equal(sample.check(analyzePassword(sample.password)), true);
    console.log(`PASS: ${sample.name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL: ${sample.name} - ${error.message}`);
  }
}
console.log(`${samples.length - failures}/${samples.length} tests passed`);
process.exitCode = failures === 0 ? 0 : 1;
