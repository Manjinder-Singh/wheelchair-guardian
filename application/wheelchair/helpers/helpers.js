export function momentAfterTimePeriod(timePeriod, interval) {
  switch (interval) {
    case 'ONE_WEEK':
      return timePeriod.add(1, 'w');
    case 'TWO_WEEK':
      return timePeriod.add(2, 'w');
    case 'ONE_MONTH':
      return timePeriod.add(1, 'M');
    case 'TWO_MONTS':
      return timePeriod.add(2, 'M');
    case 'ONE_MIN':
      return timePeriod.add(1, 'm');
    case 'FIVE_SEC':
      return timePeriod.add(5, 's');
    default:
      break;
  }
}
