// Your custom Flat(depth)
(function () {
  "use strict";

  const flat = (arr, depth = 1) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (Array.isArray(item) && depth > 0) {
        const inner = flat(item, depth - 1);
        for (let j = 0; j < inner.length; j++) {
          result.push(inner[j]);
        }
      } else {
        result.push(item);
      }
    }
    return result;
  };

  const nested = [1, [2, [3, [4, 5]]], 6];
  const snapshot = JSON.stringify(nested);

  console.assert(
    JSON.stringify(nested.flat(1)) === JSON.stringify(flat(nested, 1)),
    "custom flat: depth 1 failed"
  );
  console.assert(
    JSON.stringify(nested.flat(2)) === JSON.stringify(flat(nested, 2)),
    "custom flat: depth 2 failed"
  );
  console.assert(
    JSON.stringify(nested.flat(Infinity)) === JSON.stringify(flat(nested, Infinity)),
    "custom flat: depth Infinity failed"
  );
  console.assert(
    JSON.stringify(nested) === snapshot,
    "custom flat: input array should not be mutated"
  );
  console.log("[PASS] custom flat — 4 console.assert checks passed");
})();
