export const PASSWORD_RULES = [
  {
    id: 'length',
    label: 'At least 8 characters long',
    test: (value) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'At least one uppercase letter (A-Z)',
    test: (value) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'At least one lowercase letter (a-z)',
    test: (value) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'At least one number (0-9)',
    test: (value) => /\d/.test(value),
  },
  {
    id: 'symbol',
    label: 'At least one special character (!@#$%^&*)',
    test: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

export const getPasswordRuleResults = (value) =>
  PASSWORD_RULES.map((rule) => ({
    ...rule,
    passed: rule.test(value),
  }));

export const isPasswordStrong = (value) =>
  getPasswordRuleResults(value).every((rule) => rule.passed);

export const getPasswordStrength = (value) => {
  const results = getPasswordRuleResults(value || '');
  const passedCount = results.filter((rule) => rule.passed).length;

  if (!value) {
    return { label: 'Not Set', tone: 'muted', passedCount, total: results.length };
  }

  if (passedCount <= 2) {
    return { label: 'Weak', tone: 'weak', passedCount, total: results.length };
  }

  if (passedCount <= 4) {
    return { label: 'Fair', tone: 'fair', passedCount, total: results.length };
  }

  return { label: 'Strong', tone: 'strong', passedCount, total: results.length };
};
