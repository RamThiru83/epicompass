import type { ComponentType } from 'react';

/** Every interactive receives these props. Call onReached(true) when the learner reaches the card's target state. */
export interface InteractiveProps {
  onReached?: (reached: boolean, detail?: string) => void;
  /** Optional per-card overrides from content (ExploreStep.props). */
  config?: Record<string, unknown>;
}

export type InteractiveComponent = ComponentType<InteractiveProps>;

export interface InteractiveMeta {
  id: string;
  title: string;
  chapter: number;
  component: InteractiveComponent;
}
