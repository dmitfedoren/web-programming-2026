// Нестрогий режим (sloppy mode) — без директиви "use strict"
(function () {
  const lines = ["=== НЕСТРОГИЙ РЕЖИМ (strict-off.js) ==="];
  const check = (label, fn) => {
    try {
      const res = fn();
      const msg = `[sloppy] ${label} -> ${res}`;
      console.log(msg);
      lines.push(msg);
    } catch (error) {
      const msg = `[sloppy] ${label} -> ${error.name}: ${error.message}`;
      console.log(msg);
      lines.push(msg);
    }
  };

  // Помилки виконання (4 ситуації)
  check("1. Неоголошена змінна", () => {
    undeclaredDemoVar = 42;
    return undeclaredDemoVar;
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
  check("5. Інструкція with", () => new Function("with (Math) return PI;")());
  check("6. Вісімковий літерал 010", () => new Function("return 010;")());
  check("7. Однакові параметри (a, a)", () => new Function("a", "a", "return a;")(1, 2));

  const logEl = document.getElementById("strict-log");
  if (logEl) logEl.textContent += lines.join("\n") + "\n\n";
})();
