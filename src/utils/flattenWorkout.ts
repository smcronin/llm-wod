import { GeneratedWorkout, FlattenedWorkout, TimerItem } from '@/types/workout';
import { uuid } from './uuid';

export function flattenWorkout(workout: GeneratedWorkout): FlattenedWorkout {
  const items: TimerItem[] = [];

  // Add warm-up exercises (only if there are any)
  if (workout.warmUp.exercises.length > 0) {
    workout.warmUp.exercises.forEach((exercise, index) => {
      items.push({
        id: uuid(),
        type: 'warmup_exercise',
        name: exercise.name,
        duration: exercise.duration,
        exercise,
        exerciseIndex: index,
      });
    });
  }

  // Add circuits
  workout.circuits.forEach((circuit, circuitIndex) => {
    // Add rest between circuits (except before first circuit)
    if (circuitIndex > 0 && workout.restBetweenCircuits > 0) {
      items.push({
        id: uuid(),
        type: 'circuit_rest',
        name: `Circuit ${circuitIndex} Complete`,
        duration: workout.restBetweenCircuits,
        circuitIndex: circuitIndex - 1,
      });
    }

    for (let round = 0; round < circuit.rounds; round++) {
      circuit.exercises.forEach((exercise, exerciseIndex) => {
        // Add exercise
        items.push({
          id: uuid(),
          type: 'circuit_exercise',
          name: exercise.name,
          duration: exercise.duration,
          exercise,
          circuitIndex,
          roundIndex: round,
          exerciseIndex,
        });

        // Add rest between exercises (except after last)
        if (
          exerciseIndex < circuit.exercises.length - 1 &&
          circuit.restBetweenExercises > 0
        ) {
          items.push({
            id: uuid(),
            type: 'exercise_rest',
            name: 'Rest',
            duration: circuit.restBetweenExercises,
            circuitIndex,
            roundIndex: round,
          });
        }
      });

      // Add rest between rounds (except after last)
      if (round < circuit.rounds - 1 && circuit.restBetweenRounds > 0) {
        items.push({
          id: uuid(),
          type: 'round_rest',
          name: `Round ${round + 1} Complete`,
          duration: circuit.restBetweenRounds,
          circuitIndex,
          roundIndex: round,
        });
      }
    }
  });

  // Add cool-down exercises (only if there are any)
  if (workout.coolDown.exercises.length > 0) {
    workout.coolDown.exercises.forEach((exercise, index) => {
      items.push({
        id: uuid(),
        type: 'cooldown_exercise',
        name: exercise.name,
        duration: exercise.duration,
        exercise,
        exerciseIndex: index,
      });
    });
  }

  const totalDuration = items.reduce((sum, item) => sum + item.duration, 0);

  return {
    workoutId: workout.id,
    items,
    totalDuration,
    totalItems: items.length,
  };
}

export function getItemTypeLabel(type: TimerItem['type']): string {
  switch (type) {
    case 'warmup_exercise':
      return 'WARM UP';
    case 'circuit_exercise':
      return 'WORK';
    case 'cooldown_exercise':
      return 'COOL DOWN';
    case 'exercise_rest':
      return 'REST';
    case 'round_rest':
      return 'ROUND REST';
    case 'circuit_rest':
      return 'CIRCUIT REST';
    default:
      return '';
  }
}

export function isRestItem(type: TimerItem['type']): boolean {
  return type === 'exercise_rest' || type === 'round_rest' || type === 'circuit_rest';
}
