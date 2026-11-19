// Строгий режим (strict mode) — з директивою "use strict"
(function () {
  "use strict";

  const lines = ["=== СТРОГИЙ РЕЖИМ (strict-on.js) ==="];
  const check = (label, fn) => {
    try {
      const res = fn();
      const msg = `[strict] ${label} -> ${res}`;
      console.log(msg);
      lines.push(msg);
    } catch (error) {
      const msg = `[strict] ${label} -> ${error.name}: ${error.message}`;
      console.log(msg);
      lines.push(msg);
    }
  };

  // Помилки виконання (4 ситуації)
  check("1. Неоголошена змінна", () => {
    undeclaredStrictVar = 42;
    return undeclaredStrictVar;
  });
  check("2. this у функції без об’єкта", function () {
    return String(this);
  });
  const frozen = Object.freeze({ port: 8080 });
  check("3. Запис у заморожений об’єкт", () => {
    frozen.port = 3000;
    return frozen.port;
  });
  check("4. delete Object.prototype", () => delete Object.prototype);

  // Помилки розбору (3 ситуації через new Function)
  check("5. Інструкція with", () => new Function('"use strict"; with (Math) return PI;')());
  check("6. Вісімковий літерал 010", () => new Function('"use strict"; return 010;')());
  check("7. Однакові параметри (a, a)", () => new Function("a", "a", '"use strict"; return a;')(1, 2));

  const logEl = document.getElementById("strict-log");
  if (logEl) logEl.textContent += lines.join("\n");
})();
