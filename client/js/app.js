import { getUsers, createUser, updateUser, deleteUser } from "./api.js";
import { renderTable } from "./table.js";
import { closeModal } from "./modal.js";
import { openAddModal, openEditModal, openDeleteModal } from "./record-modals.js";
import { getModalParams } from "./url-state.js";

let items = [];
let columns = [];

try {
  items = await getUsers();
  if (items && items.length > 0) {
    columns = Object.keys(items[0]).filter((key) => key !== "id");
  }
} catch (error) {
  console.error("Failed to fetch initial data:", error);
}

function refreshTable() {
  renderTable(columns, items, {
    onEdit: (item) => openEditModal(item, columns, {
      onSubmit: async (data) => {
        const updated = await updateUser(item.id, data);
        handleUpdated({ ...updated, id: item.id });
      }
    }),
    onDelete: (item) => openDeleteModal(item, {
      onSubmit: async () => {
        await deleteUser(item.id);
        handleDeleted(item.id);
      }
    }),
  });
}

function handleCreated(created) {
  items.push(created);
  refreshTable();
}

function handleUpdated(updated) {
  const index = items.findIndex((i) => i.id === updated.id);
  if (index === -1) return;
  items[index] = updated;
  refreshTable();
}

function handleDeleted(deletedId) {
  items = items.filter((i) => i.id !== deletedId);
  refreshTable();
}

refreshTable();

document.getElementById("add-record").addEventListener("click", () => {
  openAddModal(columns, {
    onSubmit: async (data) => {
      const created = await createUser(data);
      handleCreated(created);
    }
  });
});

function restoreFromUrl() {
  const params = getModalParams();
  if (!params) return;

  if (params.modal === "add") {
    openAddModal(columns, {
      fromUrl: true,
      onSubmit: async (data) => {
        const created = await createUser(data);
        handleCreated(created);
      }
    });
    return;
  }

  const item = items.find((i) => String(i.id) === String(params.id));
  if (!item) return;

  if (params.modal === "edit") {
    openEditModal(item, columns, {
      fromUrl: true,
      onSubmit: async (data) => {
        const updated = await updateUser(item.id, data);
        handleUpdated({ ...updated, id: item.id });
      }
    });
  }
  if (params.modal === "delete") {
    openDeleteModal(item, {
      fromUrl: true,
      onSubmit: async () => {
        await deleteUser(item.id);
        handleDeleted(item.id);
      }
    });
  }
}

restoreFromUrl();

window.addEventListener("popstate", () => {
  closeModal({ silent: true });
  restoreFromUrl();
});