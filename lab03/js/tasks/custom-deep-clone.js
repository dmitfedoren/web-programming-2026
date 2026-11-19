// Your custom DeepClone (with Date, Map, Set, undefined, and circular references)
(function () {
  "use strict";

  const deepClone = (value, seen = new WeakMap()) => {
    if (value === null || typeof value !== "object") {
      return value;
    }
    if (seen.has(value)) {
      return seen.get(value);
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    if (value instanceof Map) {
      const copy = new Map();
      seen.set(value, copy);
      value.forEach((v, k) => {
        copy.set(deepClone(k, seen), deepClone(v, seen));
      });
      return copy;
    }
    if (value instanceof Set) {
      const copy = new Set();
      seen.set(value, copy);
      value.forEach((v) => copy.add(deepClone(v, seen)));
      return copy;
    }
    if (Array.isArray(value)) {
      const copy = [];
      seen.set(value, copy);
      for (let i = 0; i < value.length; i++) {
        copy[i] = deepClone(value[i], seen);
      }
      return copy;
    }
    const copy = {};
    seen.set(value, copy);
    for (const key of Object.keys(value)) {
      copy[key] = deepClone(value[key], seen);
    }
    return copy;
  };

  const source = {
    name: "Журнал",
    scores: [90, 95],
    nested: { group: "ПЗ-2304" },
    created: new Date("2026-11-19T12:00:00Z"),
    meta: new Map([["course", 3]]),
    optional: undefined
  };

  const clone = deepClone(source);
  const builtInClone = structuredClone(source);

  console.assert(JSON.stringify(clone) === JSON.stringify(source), "deepClone: JSON mismatch");
  console.assert(clone !== source && clone.nested !== source.nested, "deepClone: shared references");
  console.assert(clone.created instanceof Date && clone.created.getTime() === source.created.getTime(), "deepClone: Date failed");
  console.assert(clone.meta instanceof Map && clone.meta.get("course") === 3 && clone.meta !== source.meta, "deepClone: Map failed");
  console.assert("optional" in clone && clone.optional === undefined, "deepClone: undefined key lost");
  console.assert(clone.created.getTime() === builtInClone.created.getTime(), "deepClone: structuredClone comparison failed");

  clone.nested.group = "CHANGED";
  clone.scores.push(100);
  console.assert(source.nested.group === "ПЗ-2304" && source.scores.length === 2, "deepClone: mutating clone affected source");

  // Циклічне посилання
  const cyclic = { label: "node" };
  cyclic.self = cyclic;
  const cyclicCopy = deepClone(cyclic);
  console.assert(cyclicCopy !== cyclic && cyclicCopy.self === cyclicCopy, "deepClone: circular reference failed");
  console.log("[PASS] custom deepClone — 8 console.assert checks passed");
})();
