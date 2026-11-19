// Модуль обробників подій, делегування, валідації та фільтрації/упорядкування
(function (App) {
  "use strict";

  // Власна функція debounce для поля пошуку
  const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => fn(...args), delay);
    };
  };

  const getFilteredAndSorted = (state) => {
    const query = state.search.trim().toLowerCase();

    const filtered = state.items.filter((item) => {
      const bySubject =
        state.subjectFilter === "all" || item.subject === state.subjectFilter;
      const byStatus =
        state.statusFilter === "all" ||
        (state.statusFilter === "verified" && item.verified) ||
        (state.statusFilter === "pending" && !item.verified);
      const byQuery =
        query === "" ||
        item.student.toLowerCase().includes(query) ||
        item.subject.toLowerCase().includes(query);
      return bySubject && byStatus && byQuery;
    });

    // Сортування виконується на копії масиву без мутації оригіналу
    const copy = [...filtered];
    switch (state.sortBy) {
      case "score-asc":
        copy.sort((a, b) => a.score - b.score);
        break;
      case "student-asc":
        copy.sort((a, b) => a.student.localeCompare(b.student, "uk"));
        break;
      case "date-desc":
        copy.sort((a, b) => b.date.localeCompare(a.date));
        break;
      case "score-desc":
      default:
        copy.sort((a, b) => b.score - a.score);
        break;
    }

    return copy;
  };

  const validateField = (field, errorEl) => {
    field.setCustomValidity("");

    const val = field.value.trim();
    if (field.name === "student") {
      if (val.length === 0) {
        field.setCustomValidity("Вкажіть ПІБ студента.");
      } else if (val.length < 3) {
        field.setCustomValidity("ПІБ має містити щонайменше 3 символи.");
      } else if (!/^[А-ЯІЇЄҐа-яіїєґA-Za-z'’\-\.\s]+$/.test(val)) {
        field.setCustomValidity("ПІБ може містити лише літери, пробіли, дефіс і крапки.");
      }
    } else if (field.name === "subject") {
      if (field.validity.valueMissing) {
        field.setCustomValidity("Оберіть дисципліну зі списку.");
      }
    } else if (field.name === "score") {
      const num = Number(val);
      if (val === "" || field.validity.valueMissing) {
        field.setCustomValidity("Введіть оцінку від 0 до 100.");
      } else if (Number.isNaN(num) || num < 0 || num > 100 || !Number.isInteger(num)) {
        field.setCustomValidity("Оцінка має бути цілим числом від 0 до 100.");
      }
    } else if (field.name === "date") {
      if (field.validity.valueMissing) {
        field.setCustomValidity("Оберіть дату оцінювання.");
      }
    }

    if (!field.checkValidity()) {
      errorEl.textContent = field.validationMessage;
      field.setAttribute("aria-invalid", "true");
      return false;
    }

    errorEl.textContent = "";
    field.removeAttribute("aria-invalid");
    return true;
  };

  const bind = (state, syncUI) => {
    const form = document.forms.gradeForm;
    const listEl = document.getElementById("grade-list");
    const searchInput = document.getElementById("search-input");
    const filterSubject = document.getElementById("filter-subject");
    const filterStatus = document.getElementById("filter-status");
    const sortSelect = document.getElementById("sort-select");
    const clearBtn = document.getElementById("clear-storage-btn");

    const fields = [
      { el: form.elements.student, err: document.getElementById("error-student") },
      { el: form.elements.subject, err: document.getElementById("error-subject") },
      { el: form.elements.score, err: document.getElementById("error-score") },
      { el: form.elements.date, err: document.getElementById("error-date") }
    ];

    // Валідація та додавання нового запису
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      let firstInvalid = null;
      fields.forEach(({ el, err }) => {
        const ok = validateField(el, err);
        if (!ok && !firstInvalid) {
          firstInvalid = el;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const data = new FormData(form);
      const id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `rec-${Date.now()}`;

      state.items = [
        {
          id,
          student: String(data.get("student")).trim(),
          subject: String(data.get("subject")),
          score: Number(data.get("score")),
          date: String(data.get("date")),
          verified: false
        },
        ...state.items
      ];

      App.storage.save(state.items);
      form.reset();
      form.elements.date.value = new Date().toISOString().slice(0, 10);
      fields.forEach(({ el, err }) => {
        err.textContent = "";
        el.removeAttribute("aria-invalid");
      });
      syncUI();
    });

    // Делегування подій: один обробник click на контейнері списку
    listEl.addEventListener("click", (event) => {
      const btn = event.target.closest("button[data-action]");
      if (!btn || !listEl.contains(btn)) return;

      const row = btn.closest(".grade-item");
      if (!row) return;

      const id = row.dataset.id;
      const action = btn.dataset.action;

      if (action === "delete") {
        state.items = state.items.filter((item) => item.id !== id);
        if (state.editingId === id) state.editingId = null;
        App.storage.save(state.items);
        syncUI();
        return;
      }

      if (action === "toggle") {
        state.items = state.items.map((item) =>
          item.id === id ? { ...item, verified: !item.verified } : item
        );
        App.storage.save(state.items);
        syncUI();
        return;
      }

      if (action === "edit") {
        state.editingId = id;
        syncUI();
        const input = listEl.querySelector(`.grade-item[data-id="${id}"] .grade-item__edit-input`);
        if (input) input.focus();
        return;
      }

      if (action === "cancel-edit") {
        state.editingId = null;
        syncUI();
        return;
      }

      if (action === "save-edit") {
        const input = row.querySelector(".grade-item__edit-input");
        const errEl = row.querySelector('[data-role="edit-error"]');
        const nextScore = Number(input.value);

        if (input.value.trim() === "" || Number.isNaN(nextScore) || nextScore < 0 || nextScore > 100 || !Number.isInteger(nextScore)) {
          errEl.textContent = "Ціле число 0–100";
          input.setAttribute("aria-invalid", "true");
          input.focus();
          return;
        }

        state.items = state.items.map((item) =>
          item.id === id ? { ...item, score: nextScore } : item
        );
        state.editingId = null;
        App.storage.save(state.items);
        syncUI();
      }
    });

    // Пошук з debounce (300 мс)
    searchInput.addEventListener(
      "input",
      debounce((event) => {
        state.search = event.target.value;
        syncUI();
      }, 300)
    );

    filterSubject.addEventListener("change", (event) => {
      state.subjectFilter = event.target.value;
      syncUI();
    });

    filterStatus.addEventListener("change", (event) => {
      state.statusFilter = event.target.value;
      syncUI();
    });

    sortSelect.addEventListener("change", (event) => {
      state.sortBy = event.target.value;
      syncUI();
    });

    clearBtn.addEventListener("click", () => {
      App.storage.clear();
      state.items = [];
      state.editingId = null;
      App.storage.save(state.items);
      syncUI();
    });
  };

  App.events = {
    debounce,
    getFilteredAndSorted,
    bind
  };
})(window.App = window.App || {});
