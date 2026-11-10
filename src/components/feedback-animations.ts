import type { AnimationObject } from 'lottie-react-native';

export type FeedbackAnimationName =
  | 'loading'
  | 'empty'
  | 'deposit'
  | 'withdrawal'
  | 'success'
  | 'signIn'
  | 'budget';

export const feedbackAnimationSources: Record<FeedbackAnimationName, AnimationObject> = {
  loading: require('../../assets/animaciones/Loading sand clock.json'),
  empty: require('../../assets/animaciones/No Data Found.json'),
  deposit: require('../../assets/animaciones/Saving Money.json'),
  withdrawal: require('../../assets/animaciones/ATM.json'),
  success: require('../../assets/animaciones/Succes 1.json'),
  signIn: require('../../assets/animaciones/Sign In Success.json'),
  budget: require('../../assets/animaciones/Wallet _ Money Added.json'),
};

export const feedbackAnimationSpeeds: Record<FeedbackAnimationName, number> = {
  loading: 1,
  empty: 1,
  deposit: 1.5,
  withdrawal: 1.5,
  success: 2,
  signIn: 3,
  budget: 2,
};
