// For exercise-wrapper.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import {
  ExerciseFeedback,
  TrueFalseExerciseSingle,
  MultipleChoiceSingle,
  TrueFalseExerciseGroup,
  MultipleChoiceExerciseGroup
} from "../../schema"
import TrueFalseExerciseComponent from "./true-false-exercise"
import MultipleChoiceExerciseComponent from "./multiple-choice-exercise"

export interface ExerciseWrapperProps {
  exercise: TrueFalseExerciseSingle | MultipleChoiceSingle | TrueFalseExerciseGroup | MultipleChoiceExerciseGroup;
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
    </div>
  )
}