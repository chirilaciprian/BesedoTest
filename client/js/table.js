import {
  sortItems,
  handleSort,
  getSortDirection
} from "./table-sort.js";
import { setSearchQuery, filterItems } from "./table-search.js";

const thead = document.getElementById("records-table-header");
const tbody = document.getElementById("records-table-body");
const searchInput = document.getElementById("records-search");

let currentColumns = [];
let currentItems = [];
let currentCallbacks = {};

function formatColumnTitle(column) {
  if (!column) return "";
  return column
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function createSortIcon(sortDirection) {
  const wrapper = document.createElement("span");
  wrapper.className = `sort-icon-container ${sortDirection ? `is-${sortDirection}` : "is-idle"}`;
  wrapper.setAttribute("aria-hidden", "true");

  wrapper.innerHTML = `
    <svg class="sort-icon" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor">
      <path class="sort-arrow sort-arrow-up" d="M4 6.5L8 2.5L12 6.5" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="sort-arrow sort-arrow-down" d="M4 9.5L8 13.5L12 9.5" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
  return wrapper;
}

function renderTableHeader(columns) {
  if (thead.children.length > 0) {
    columns.forEach((column, index) => {
      const th = thead.querySelector(`tr`).children[index];
      const sortDirection = getSortDirection(column);

      th.classList.remove("th-sorted-asc", "th-sorted-desc");
      if (sortDirection === "asc") {
        th.classList.add("th-sorted-asc");
        th.setAttribute("aria-sort", "ascending");
      } else if (sortDirection === "desc") {
        th.classList.add("th-sorted-desc");
        th.setAttribute("aria-sort", "descending");
      } else {
        th.setAttribute("aria-sort", "none");
      }

      const sortIconContainer = th.querySelector('.sort-icon-container');
      if (sortIconContainer) {
        sortIconContainer.className = `sort-icon-container ${sortDirection ? 'is-' + sortDirection : "is-idle"}`;
      }
    });
    return;
  }

  const row = document.createElement("tr");

  columns.forEach((column) => {
    const th = document.createElement("th");
    const sortDirection = getSortDirection(column);

    th.classList.add("th-sortable");
    if (sortDirection === "asc") {
      th.classList.add("th-sorted-asc");
      th.setAttribute("aria-sort", "ascending");
    } else if (sortDirection === "desc") {
      th.classList.add("th-sorted-desc");
      th.setAttribute("aria-sort", "descending");
    } else {
      th.setAttribute("aria-sort", "none");
    }

    th.setAttribute("tabindex", "0");
    th.setAttribute("role", "columnheader");
    th.setAttribute("title", `Sort by ${formatColumnTitle(column)}`);

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "th-content";

    const label = document.createElement("span");
    label.className = "th-label";
    label.textContent = formatColumnTitle(column);

    const sortIcon = createSortIcon(sortDirection);

    contentWrapper.append(label, sortIcon);
    th.append(contentWrapper);

    th.addEventListener("click", () => {
      handleTableSort(column);
    });

    th.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleTableSort(column);
      }
    });

    row.append(th);
  });

  const actionsTh = document.createElement("th");
  actionsTh.className = "th-actions";
  actionsTh.textContent = "Actions";
  actionsTh.setAttribute("scope", "col");
  row.append(actionsTh);

  thead.innerHTML = "";
  thead.append(row);
}

function renderTableBody(items, columns, { onEdit, onDelete }) {
  tbody.innerHTML = "";

  if (items.length === 0) {
    const emptyRow = document.createElement("tr");
    const emptyCell = document.createElement("td");
    emptyCell.className = "table-empty-cell";
    emptyCell.colSpan = columns.length + 1;
    emptyCell.innerHTML = `
      <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <p class="empty-text">No records found</p>
        <span class="empty-subtext">Try refining your search query</span>
      </div>
    `;
    emptyRow.append(emptyCell);
    tbody.append(emptyRow);
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach((item) => {
    const row = document.createElement("tr");

    columns.forEach((column) => {
      const td = document.createElement("td");
      td.className = `td-${column}`;
      td.setAttribute("data-label", formatColumnTitle(column));
      td.textContent = item[column] ?? "—";
      row.append(td);
    });

    const actionsTd = document.createElement("td");
    actionsTd.className = "td-actions";
    actionsTd.setAttribute("data-label", "Actions");

    const actionsGroup = document.createElement("div");
    actionsGroup.className = "actions-button-group";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "btn-table-action btn-table-edit";
    editButton.setAttribute("aria-label", `Edit record ${[item.firstName, item.lastName].filter(Boolean).join(' ') || item.id}`);
    editButton.innerHTML = `
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
        </svg>
        <span>Edit</span>
      `;
    editButton.addEventListener("click", () => {
      onEdit(item);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn-table-action btn-table-delete";
    deleteButton.setAttribute("aria-label", `Delete record ${[item.firstName, item.lastName].filter(Boolean).join(' ') || item.id}`);
    deleteButton.innerHTML = `
        <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        <span>Delete</span>
      `;
    deleteButton.addEventListener("click", () => {
      onDelete(item);
    });

    actionsGroup.append(editButton, deleteButton);
    actionsTd.append(actionsGroup);
    row.append(actionsTd);
    fragment.append(row);
  });

  tbody.append(fragment);
}

const recordBadge = document.getElementById("record-count");

function updateRecordCount(filteredCount, totalCount) {
  if (!recordBadge) return;
  if (filteredCount === totalCount) {
    recordBadge.textContent = `${totalCount} ${totalCount === 1 ? "record" : "records"}`;
  } else {
    recordBadge.textContent = `${filteredCount} of ${totalCount} records`;
  }
}

function updateTable() {
  const filteredItems = filterItems(currentItems, currentColumns);
  const sortedItems = sortItems(filteredItems);
  updateRecordCount(filteredItems.length, currentItems.length);
  renderTableHeader(currentColumns);
  renderTableBody(
    sortedItems,
    currentColumns,
    currentCallbacks
  );
}

function handleTableSort(column) {
  handleSort(column);
  updateTable();
}

function handleTableSearch(value) {
  setSearchQuery(value);
  updateTable();
}

searchInput?.addEventListener("input", (event) => {
  handleTableSearch(event.target.value);
});

function renderTable(columns, items, callbacks) {
  currentColumns = columns;
  currentItems = [...items];
  currentCallbacks = callbacks;
  updateTable();
}

export {
  renderTable
};