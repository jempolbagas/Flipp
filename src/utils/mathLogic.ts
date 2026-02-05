export type Operation = 'add' | 'sub' | 'mul' | 'div';

export interface Problem {
  question: string;
  answer: number;
}

export const generateProblem = (operation: Operation, min: number = -15, max: number = 15): Problem => {
  let a: number, b: number, question: string = '', answer: number = 0;

  const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate numbers based on input range
  // For division, we might need adjustments to ensure integers
  a = getRandomInt(min, max);
  b = getRandomInt(min, max);

  switch (operation) {
    case 'add':
      question = `${a} + ${b}`;
      answer = a + b;
      break;
    case 'sub':
      question = `${a} - ${b}`;
      answer = a - b;
      break;
    case 'mul':
      question = `${a} × ${b}`;
      answer = a * b;
      break;
    case 'div':
      // Division: c / a = b  (where c is dividend, a is divisor)
      // We want the answer (b) and divisor (a) to be integers.
      // So we generate a and b, then calculate c = a * b.
      // Question becomes: c ÷ a = ?
      // Avoid division by zero for 'a'
      if (a === 0) a = 1;

      const dividend = a * b;
      question = `${dividend} ÷ ${a}`;
      answer = b;
      break;
    default:
      question = '0 + 0';
      answer = 0;
  }

  return { question, answer: Number(answer) };
};
