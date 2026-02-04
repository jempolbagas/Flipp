export const generateProblem = (operation) => {
  let a, b, question, answer;

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate numbers between -15 and 15
  // For division, we might need adjustments to ensure integers
  a = getRandomInt(-15, 15);
  b = getRandomInt(-15, 15);

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
