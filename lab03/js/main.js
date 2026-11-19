// Точка входу застосунку «Журнал оцінок»
(function (App) {
  "use strict";

  const state = {
    items: App.storage.load(),
    search: "",
    subjectFilter: "all",
    statusFilter: "all",
    sortBy: "score-desc",
    editingId: null
  };

  const listEl = document.getElementById("grade-list");
  const dateInput = document.getElementById("date-input");
  if (dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }

  const syncUI = () => {
    const visible = App.events.getFilteredAndSorted(state);
    App.render.list(listEl, visible, state.editingId);
    App.render.stats(state.items, visible);
  };

  App.events.bind(state, syncUI);
  syncUI();
})(window.App);
