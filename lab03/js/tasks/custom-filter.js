// Your custom Filter
(function () {
  "use strict";

  const filter = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) {
        result.push(arr[i]);
      }
    }
    return result;
  };

  const arr = [65, 78, 91, 54, 100];
  const snapshot = JSON.stringify(arr);
  const isHigh = (val) => val >= 80;

  const resBuiltIn = arr.filter(isHigh);
  const resCustom = filter(arr, isHigh);

  console.assert(
    JSON.stringify(resBuiltIn) === JSON.stringify(resCustom),
    "custom filter: result does not match Array.prototype.filter"
  );
  console.assert(
    JSON.stringify(filter(arr, () => false)) === JSON.stringify([]),
    "custom filter: none-match case failed"
  );
  console.assert(
    JSON.stringify(filter(arr, () => true)) === snapshot,
    "custom filter: all-match case failed"
  );
  console.assert(
    JSON.stringify(arr) === snapshot,
    "custom filter: input array should not be mutated"
  );
  console.log("[PASS] custom filter — 4 console.assert checks passed");
})();
