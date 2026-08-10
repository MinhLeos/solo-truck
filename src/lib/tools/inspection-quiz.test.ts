import { describe, expect, it } from 'vitest';
import { scoreQuiz, QUIZ_QUESTIONS } from './inspection-quiz';

describe('scoreQuiz', () => {
  it('is "ready" with a perfect score', () => {
    const result = scoreQuiz(new Array(QUIZ_QUESTIONS.length).fill(true));
    expect(result.score).toBe(QUIZ_QUESTIONS.length);
    expect(result.band).toBe('ready');
  });

  it('is "almost_there" at 9 or more but not perfect', () => {
    const answers = new Array(QUIZ_QUESTIONS.length).fill(true);
    answers[0] = false;
    answers[1] = false;
    const result = scoreQuiz(answers);
    expect(result.score).toBe(QUIZ_QUESTIONS.length - 2);
    expect(result.band).toBe('almost_there');
  });

  it('is "at_risk" below 9', () => {
    const answers = new Array(QUIZ_QUESTIONS.length).fill(false);
    const result = scoreQuiz(answers);
    expect(result.score).toBe(0);
    expect(result.band).toBe('at_risk');
  });
});
