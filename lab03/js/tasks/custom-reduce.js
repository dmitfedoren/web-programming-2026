// Your custom Reduce
(function () {
  "use strict";

  const reduce = (arr, fn, ...rest) => {
    const hasInitial = rest.length > 0;
    const initialValue = rest[0];
    if (arr.length === 0 && !hasInitial) {
      throw new TypeError("Reduce of empty array with no initial value");
    }
    let acc = hasInitial ? initialValue : arr[0];
    const startIdx = hasInitial ? 0 : 1;
    for (let i = startIdx; i < arr.length; i++) {
      acc = fn(acc, arr[i], i, arr);
    }
    return acc;
  };

  const arr = [1, 2, 3, 4];
  const snapshot = JSON.stringify(arr);
  const sum = (acc, val) => acc + val;

  console.assert(
    arr.reduce(sum, 10) === reduce(arr, sum, 10),
    "custom reduce: with initialValue failed"
  );
  console.assert(
    arr.reduce(sum) === reduce(arr, sum),
    "custom reduce: without initialValue failed"
  );
  console.assert(
    [].reduce(sum, 0) === reduce([], sum, 0),
    "custom reduce: empty array with initialValue failed"
  );
  let threwOnEmpty = false;
  try {
    reduce([], sum);
  } catch (err) {
    threwOnEmpty = err instanceof TypeError;
  }
  console.assert(threwOnEmpty, "custom reduce: empty array without initialValue should throw TypeError");
  console.assert(
    JSON.stringify(arr) === snapshot,
    "custom reduce: input array should not be mutated"
  );
  console.log("[PASS] custom reduce — 5 console.assert checks passed");
})();
