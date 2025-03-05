// For exercise-wrapper.tsx
"use client"

import { useState } from "react"
import {
  ExerciseFeedback,
  MultipleChoiceSingle,
  MultipleChoiceExerciseGroup,
  TrueFalseExerciseSingle,
  TrueFalseExerciseGroup,
  FillInBlankSingle,
  FillInBlankExerciseGroup
} from "../../schema"
import TrueFalseExerciseComponent from "./true-false-exercise"
import MultipleChoiceExerciseComponent from "./multiple-choice-exercise"
import FillInBlankExerciseComponent from "./fill-blank-exercise"

export interface ExerciseWrapperProps {
  exercise: TrueFalseExerciseSingle | MultipleChoiceSingle | FillInBlankSingle |
  TrueFalseExerciseGroup | MultipleChoiceExerciseGroup | FillInBlankExerciseGroup;
  questionNumber: number;
}

export default function ExerciseWrapper({ exercise, questionNumber }: ExerciseWrapperProps) {
  const [feedback, setFeedback] = useState<ExerciseFeedback | null>(null);

  // Extract the first exercise from the array if it exists
  const exerciseItem = 'exercises' in exercise ? exercise.exercises[0] : exercise;

  // Handle answer submission for true/false exercises
  const handleTrueFalseSubmit = (answer: boolean) => {
    const typedExercise = exerciseItem as TrueFalseExerciseSingle;
    const isCorrect = answer === typedExercise.isTrue;

    setFeedback({
      isCorrect,
      feedback: isCorrect ?
        "Correct! You understand this concept well." :
        "Incorrect. Review the explanation to better understand this concept."
    });
  };

  // Handle answer submission for multiple-choice exercises
  const handleMultipleChoiceSubmit = (selectedIndex: number) => {
    const typedExercise = exerciseItem as MultipleChoiceSingle;
    const isCorrect = selectedIndex === typedExercise.correctOptionIndex;

    setFeedback({
      isCorrect,
      feedback: isCorrect ?
        "Correct! You selected the right answer." :
        `Incorrect. The correct answer was: ${typedExercise.options[typedExercise.correctOptionIndex]}`
    });
  };

  // Add this function to handle fill-in-blank submissions
  const handleFillInBlankSubmit = (answer: string) => {
    const typedExercise = exerciseItem as FillInBlankSingle;

    // Simple exact match check
    const isCorrect = answer.toLowerCase() === typedExercise.correctAnswer.toLowerCase();

    setFeedback({
      isCorrect,
      feedback: isCorrect ?
        "Correct! You filled in the blank correctly." :
        "Incorrect. Try looking at the explanation to understand the right answer."
    });
  };

  // Reset feedback to allow retrying
  const resetFeedback = () => {
    setFeedback(null);
  };

  return (
    <div>
      {exerciseItem?.type === 'true-false' && (
        <TrueFalseExerciseComponent
          exercise={exerciseItem as TrueFalseExerciseSingle}
          onSubmit={handleTrueFalseSubmit}
          feedback={feedback}
          onReset={resetFeedback}
          questionNumber={questionNumber}
        />
      )}

      {exerciseItem?.type === 'multiple-choice' && (
        <MultipleChoiceExerciseComponent
          exercise={exerciseItem as MultipleChoiceSingle}
          onSubmit={handleMultipleChoiceSubmit}
          feedback={feedback}
          onReset={resetFeedback}
          questionNumber={questionNumber}
        />
      )}

      {exerciseItem?.type === 'fill-in-blank' && (
        <FillInBlankExerciseComponent
          exercise={exerciseItem as FillInBlankSingle}
          onSubmit={handleFillInBlankSubmit}
          feedback={feedback}
          onReset={resetFeedback}
          questionNumber={questionNumber}
        />
      )}
    </div>
  )
}