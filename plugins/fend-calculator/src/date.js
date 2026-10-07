const _pad2 = (n) => String(n).padStart(2, "0");

const _formatFendDate = (date) => {
  return `@${date.getFullYear()}-${_pad2(date.getMonth() + 1)}-${_pad2(
    date.getDate(),
  )}`;
};

const _formatFendDateTime = (date) => {
  return `${_formatFendDate(date)} ${_pad2(date.getHours())}:${_pad2(
    date.getMinutes(),
  )}`;
};

const _addDays = (date, days) => {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out;
};

export const dateCommands = (expression, now = new Date()) => {
  const aliases = [
    [/\b(?:@)?tomorrow\b/gi, () => _formatFendDate(_addDays(now, 1))],
    [/\b(?:@)?yesterday\b/gi, () => _formatFendDate(_addDays(now, -1))],
    [/\b(?:@)?today\b/gi, () => _formatFendDate(now)],
    [/\b(?:@)?now\b/gi, () => _formatFendDateTime(now)],
  ];

  let result = expression;
  for (const [pattern, replacement] of aliases) {
    result = result.replace(pattern, replacement);
  }

  return result;
};
