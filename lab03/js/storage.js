// Модуль роботи з localStorage для «Журналу оцінок»
(function (App) {
  "use strict";

  const STORAGE_KEY = "lab03-gradebook-items";

  const DEFAULT_ITEMS = [
    {
      id: "rec-101",
      student: "Федоренко Дмитро Олегович",
      subject: "Основи WEB-технологій",
      score: 96,
      date: "2026-11-10",
      verified: true
    },
    {
      id: "rec-102",
      student: "Коваленко Ірина Сергіївна",
      subject: "Бази даних",
      score: 88,
      date: "2026-11-12",
      verified: true
    },
    {
      id: "rec-103",
      student: "Мельник Андрій Вікторович",
      subject: "Алгоритми та структури даних",
      score: 79,
      date: "2026-11-14",
      verified: false
    },
    {
      id: "rec-104",
      student: "Бондаренко Олена Петрівна",
      subject: "Основи WEB-технологій",
      score: 92,
      date: "2026-11-16",
      verified: true
    },
    {
      id: "rec-105",
      student: "Ткаченко Максим Ігорович",
      subject: "Комп’ютерні мережі",
      score: 84,
      date: "2026-11-17",
      verified: false
    }
  ];

  const isValidRecord = (item) =>
    item !== null &&
    typeof item === "object" &&
    typeof item.id === "string" &&
    typeof item.student === "string" &&
    typeof item.subject === "string" &&
    typeof item.score === "number" &&
    !Number.isNaN(item.score) &&
    typeof item.date === "string" &&
    typeof item.verified === "boolean";

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) {
        save(DEFAULT_ITEMS);
        return DEFAULT_ITEMS.map((item) => ({ ...item }));
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(isValidRecord);
    } catch (error) {
      console.warn("Пошкоджені дані у localStorage, повернено порожній список:", error.message);
      return [];
    }
  };

  const save = (items) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Помилка запису у localStorage:", error.message);
    }
  };

  const clear = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Помилка очищення localStorage:", error.message);
    }
  };

  App.storage = {
    STORAGE_KEY,
    load,
    save,
    clear
  };
})(window.App = window.App || {});
