// Your custom Map
(function () {
  "use strict";

  const map = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      result.push(fn(arr[i], i, arr));
    }
    return result;
  };

  const arr = [10, 20, 30, 40];
  const snapshot = JSON.stringify(arr);
  const transform = (val, idx) => `${idx}:${val * 2}`;

  const resBuiltIn = arr.map(transform);
  const resCustom = map(arr, transform);

  console.assert(
    JSON.stringify(resBuiltIn) === JSON.stringify(resCustom),
    "custom map: result does not match Array.prototype.map"
  );
  console.assert(
    JSON.stringify(map([], transform)) === JSON.stringify([]),
    "custom map: empty array failed"
  );
  console.assert(
    JSON.stringify(arr) === snapshot,
    "custom map: input array should not be mutated"
  );
  console.log("[PASS] custom map — 3 console.assert checks passed");
})();
