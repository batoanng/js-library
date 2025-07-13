export const areOptionValuesEqualValue = <TValue>(left: TValue, right: TValue): boolean =>
  JSON.stringify(left) === JSON.stringify(right);
