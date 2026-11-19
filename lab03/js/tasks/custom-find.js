// Your custom Find
(function () {
  "use strict";

  const find = (arr, fn) => {
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) {
        return arr[i];
      }
    }
    return undefined;
  };

  const arr = [
    { id: 1, score: 74 },
    { id: 2, score: 95 },
    { id: 3, score: 98 }
  ];
  const snapshot = JSON.stringify(arr);

  const builtIn = arr.find((item) => item.score >= 90);
  const custom = find(arr, (item) => item.score >= 90);

  console.assert(builtIn === custom, "custom find: matched element differs");
  console.assert(
    find(arr, (item) => item.score > 100) === undefined,
    "custom find: missing element should return undefined"
  );
  console.assert(
    JSON.stringify(arr) === snapshot,
    "custom find: input array should not be mutated"
  );
  console.log("[PASS] custom find — 3 console.assert checks passed");
})();
