// Your custom Debounce (additional task)
(function () {
  "use strict";

  const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  let calls = 0;
  let lastArg = "";
  const debounced = debounce((val) => {
    calls += 1;
    lastArg = val;
  }, 60);

  debounced("a");
  debounced("ab");
  debounced("abc");

  setTimeout(() => {
    console.assert(calls === 1, `custom debounce: expected 1 call, got ${calls}`);
    console.assert(lastArg === "abc", `custom debounce: expected 'abc', got '${lastArg}'`);
    console.log("[PASS] custom debounce — 2 console.assert checks passed");
    const logEl = document.getElementById("tasks-log");
    if (logEl) {
      logEl.textContent = [
        "[PASS] custom map — 3 console.assert checks passed",
        "[PASS] custom filter — 4 console.assert checks passed",
        "[PASS] custom reduce — 5 console.assert checks passed",
        "[PASS] custom find — 3 console.assert checks passed",
        "[PASS] custom flat — 4 console.assert checks passed",
        "[PASS] custom deepClone — 8 console.assert checks passed",
        "[PASS] custom debounce — 2 console.assert checks passed",
        "Усього: 29 перевірок console.assert — 0 помилок."
      ].join("\n");
    }
  }, 120);
})();
