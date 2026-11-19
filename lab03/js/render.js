// Модуль формування DOM-розмітки (виключно createElement, append, textContent)
(function (App) {
  "use strict";

  const createEl = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  };

  const buildItemNode = (item, isEditing) => {
    const li = createEl(
      "li",
      `grade-item ${item.verified ? "grade-item--verified" : "grade-item--pending"}`
    );
    li.dataset.id = item.id;

    const info = createEl("div", "grade-item__info");
    const studentEl = createEl("div", "grade-item__student", item.student);

    const meta = createEl("div", "grade-item__meta");
    const subjectEl = createEl("span", "", item.subject);
    const dateEl = createEl("span", "", `Дата: ${item.date}`);
    const scoreBadge = createEl("span", "badge badge--score", `${item.score} / 100`);
    const statusBadge = createEl(
      "span",
      `badge ${item.verified ? "badge--verified" : "badge--pending"}`,
      item.verified ? "Зараховано" : "На перевірці"
    );

    meta.append(subjectEl, dateEl, scoreBadge, statusBadge);
    info.append(studentEl, meta);

    if (isEditing) {
      const editRow = createEl("div", "grade-item__edit-row");
      const editLabel = createEl("label", "field__label", "Нова оцінка (0–100):");
      const editInput = createEl("input", "grade-item__edit-input");
      editInput.type = "number";
      editInput.min = "0";
      editInput.max = "100";
      editInput.step = "1";
      editInput.value = String(item.score);
      editInput.setAttribute("aria-label", `Нова оцінка для ${item.student}`);

      const saveBtn = createEl("button", "button button--primary", "Зберегти");
      saveBtn.type = "button";
      saveBtn.dataset.action = "save-edit";

      const cancelBtn = createEl("button", "button button--secondary", "Скасувати");
      cancelBtn.type = "button";
      cancelBtn.dataset.action = "cancel-edit";

      const editErr = createEl("span", "field__error", "");
      editErr.dataset.role = "edit-error";

      editRow.append(editLabel, editInput, saveBtn, cancelBtn, editErr);
      info.append(editRow);
    }

    const actions = createEl("div", "grade-item__actions");

    const toggleBtn = createEl(
      "button",
      `button ${item.verified ? "button--secondary" : "button--success"}`,
      item.verified ? "Зняти зарахування" : "Зарахувати"
    );
    toggleBtn.type = "button";
    toggleBtn.dataset.action = "toggle";

    const editBtn = createEl("button", "button button--secondary", "Редагувати");
    editBtn.type = "button";
    editBtn.dataset.action = "edit";

    const deleteBtn = createEl("button", "button button--danger", "Видалити");
    deleteBtn.type = "button";
    deleteBtn.dataset.action = "delete";

    actions.append(toggleBtn, editBtn, deleteBtn);
    li.append(info, actions);

    return li;
  };

  const renderList = (container, visibleItems, editingId) => {
    container.replaceChildren();

    if (visibleItems.length === 0) {
      const empty = createEl(
        "li",
        "empty-state",
        "Записів не знайдено. Додайте нову оцінку або змініть параметри фільтрації."
      );
      container.append(empty);
      return;
    }

    const fragment = document.createDocumentFragment();
    visibleItems.forEach((item) => {
      fragment.append(buildItemNode(item, item.id === editingId));
    });
    container.append(fragment);
  };

  const renderStats = (allItems, visibleItems) => {
    const totalEl = document.getElementById("stat-total");
    const filteredEl = document.getElementById("stat-filtered");
    const verifiedEl = document.getElementById("stat-verified");
    const averageEl = document.getElementById("stat-average");

    const verifiedCount = visibleItems.filter((item) => item.verified).length;
    const scores = visibleItems.map((item) => item.score);
    const avg =
      scores.length > 0
        ? (scores.reduce((sum, val) => sum + val, 0) / scores.length).toFixed(1)
        : "0.0";

    totalEl.textContent = String(allItems.length);
    filteredEl.textContent = String(visibleItems.length);
    verifiedEl.textContent = String(verifiedCount);
    averageEl.textContent = avg;
  };

  App.render = {
    list: renderList,
    stats: renderStats
  };
})(window.App = window.App || {});
