const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

export const money = (value) => usd.format(value);

/** Rounds to cents to avoid floating point drift (0.1 + 0.2). */
export const cents = (value) => Math.round(value * 100) / 100;

export const pluralize = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
