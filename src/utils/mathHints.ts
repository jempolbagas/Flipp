import { Operation, Problem } from './mathLogic';

export interface HintData {
    exampleProblem: Problem;
    steps: string[];
}

// Generate a random integer between min and max (inclusive)
const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const generateHint = (currentOperation: Operation): HintData => {
    let a: number, b: number, question: string = '', answer: number = 0;
    const steps: string[] = [];

    // Use smaller numbers for examples to make it easier to follow
    const min = -5;
    const max = 5;

    switch (currentOperation) {
        case 'add':
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
            question = `${a} + ${b}`;
            answer = a + b;

            steps.push(`Start at <strong>${a}</strong> on the number line.`);
            if (b >= 0) {
                steps.push(`Move <strong>${b}</strong> steps to the <strong>right</strong> (adding a positive).`);
            } else {
                steps.push(`Move <strong>${Math.abs(b)}</strong> steps to the <strong>left</strong> (adding a negative is like subtracting).`);
            }
            steps.push(`You land on <strong>${answer}</strong>.`);
            break;

        case 'sub':
            a = getRandomInt(min, max);
            b = getRandomInt(min, max);
            question = `${a} - ${b}`;
            answer = a - b;

            steps.push(`Start at <strong>${a}</strong>.`);
            if (b >= 0) {
                steps.push(`Move <strong>${b}</strong> steps to the <strong>left</strong> (subtracting a positive).`);
            } else {
                steps.push(`Move <strong>${Math.abs(b)}</strong> steps to the <strong>right</strong>.`);
                steps.push(`(Subtracting a negative <strong>${b}</strong> is like adding <strong>${Math.abs(b)}</strong>!)`);
            }
            steps.push(`You land on <strong>${answer}</strong>.`);
            break;

        case 'mul':
            // Keep it very simple for multiplication examples
            a = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
            b = getRandomInt(1, 4) * (Math.random() > 0.5 ? 1 : -1);
            question = `${a} × ${b}`;
            answer = a * b;

            if (a > 0) {
                steps.push(`Think of this as <strong>${a}</strong> groups of <strong>${b}</strong>.`);
                steps.push(`Add <strong>${b}</strong> together <strong>${a}</strong> times.`);
            } else {
                steps.push(`Multiplying by a negative flips the sign!`);
                steps.push(`First do <strong>${Math.abs(a)} × ${b} = ${Math.abs(a) * b}</strong>.`);
                steps.push(`Then flip the sign to get <strong>${answer}</strong>.`);
            }
            break;

        case 'div':
            // Ensure clean division
            b = getRandomInt(-4, 4); // Divisor
            if (b === 0) b = 1;
            const result = getRandomInt(-4, 4); // Result
            a = result * b; // Dividend

            question = `${a} ÷ ${b}`;
            answer = result;

            steps.push(`Ask: "How many <strong>${b}</strong>s fit into <strong>${a}</strong>?"`);
            if ((a < 0 && b > 0) || (a > 0 && b < 0)) {
                steps.push(`Since the signs are different, the answer must be <strong>negative</strong>.`);
            } else {
                steps.push(`Since the signs are the same, the answer must be <strong>positive</strong>.`);
            }
            steps.push(`${Math.abs(a)} ÷ ${Math.abs(b)} is ${Math.abs(answer)}.`);
            steps.push(`So the answer is <strong>${answer}</strong>.`);
            break;
    }

    return {
        exampleProblem: { question, answer },
        steps
    };
};
