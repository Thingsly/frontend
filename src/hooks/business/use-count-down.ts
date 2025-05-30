import { computed, onScopeDispose, ref } from 'vue';
import { useBoolean } from '@sa/hooks';

/**
 * Countdown Timer
 *
 * @param second - The countdown duration (in seconds)
 */
export default function useCountDown(second: number) {
  if (second <= 0 || second % 1 !== 0) {
    throw new Error('Countdown duration must be a positive integer!');
  }

  const { bool: isComplete, setTrue, setFalse } = useBoolean(false);

  const counts = ref(0);
  const isCounting = computed(() => Boolean(counts.value));

  let intervalId: any;

  /**
   * Start the countdown
   *
   * @param updateSecond - (Optional) Overrides the initial countdown duration
   */
  function start(updateSecond: number = second) {
    if (!counts.value) {
      setFalse();
      counts.value = updateSecond;
      intervalId = setInterval(() => {
        counts.value -= 1;
        if (counts.value <= 0) {
          clearInterval(intervalId);
          setTrue();
        }
      }, 1000);
    }
  }

  /** Stop the countdown */
  function stop() {
    intervalId = clearInterval(intervalId);
    counts.value = 0;
  }

  onScopeDispose(stop);

  return {
    counts,
    isCounting,
    start,
    stop,
    isComplete
  };
}
