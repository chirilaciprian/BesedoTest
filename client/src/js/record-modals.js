import { openModal, closeModal } from "./modal.js";
import { buildForm, getFormData } from "./form-builder.js";
import { setModalUrl, clearModalUrl } from "./url-state.js";

function openFormModal(title, columns, item, modalType, onSubmit, fromUrl) {
    const form = buildForm(columns, item);
    if (!fromUrl) setModalUrl(item ? { modal: modalType, id: item.id } : { modal: modalType });

    const errorBanner = document.createElement("div");
    errorBanner.className = "modal-error-banner";
    errorBanner.style.display = "none";
    errorBanner.style.color = "var(--color-danger, red)";
    errorBanner.style.marginBottom = "1rem";
    errorBanner.style.padding = "0.5rem";
    errorBanner.style.backgroundColor = "var(--color-danger-light, #fee2e2)";
    errorBanner.style.borderRadius = "4px";
    errorBanner.style.fontSize = "0.875rem";
    form.insertBefore(errorBanner, form.firstChild);

    openModal({ title, content: form, onClose: clearModalUrl });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        errorBanner.style.display = "none";
        errorBanner.textContent = "";

        const { data, valid } = getFormData(form, columns);
        if (!valid) return;

        const saveButton = form.querySelector(".modal-button-primary");
        saveButton.disabled = true;

        try {
            await onSubmit(data);
            closeModal();
        } catch (err) {
            console.error(err);
            errorBanner.textContent = err.message || "An error occurred while saving. Please try again.";
            errorBanner.style.display = "block";
            saveButton.disabled = false;
        }
    });

    form.querySelector('[data-action="cancel"]').addEventListener("click", closeModal);
}

function openAddModal(columns, { onSubmit, fromUrl = false } = {}) {
    openFormModal("Add Record", columns, null, "add", onSubmit, fromUrl);
}

function openEditModal(item, columns, { onSubmit, fromUrl = false } = {}) {
    openFormModal("Edit Record", columns, item, "edit", onSubmit, fromUrl);
}

function openDeleteModal(item, { onSubmit, fromUrl = false } = {}) {
    if (!fromUrl) setModalUrl({ modal: "delete", id: item.id });

    const content = document.createElement("div");
    content.className = "modal-confirm";

    const label = [item.firstName, item.lastName].filter(Boolean).join(" ") || `#${item.id}`;

    content.innerHTML = `
    <div class="modal-error-banner" style="display: none; color: var(--color-danger, red); margin-bottom: 1rem; padding: 0.5rem; background-color: var(--color-danger-light, #fee2e2); border-radius: 4px; font-size: 0.875rem;"></div>
    <p>Are you sure you want to delete <strong id="delete-record-name"></strong>? This action cannot be undone.</p>
    <div class="modal-actions">
      <button type="button" class="modal-button-secondary" data-action="cancel">Cancel</button>
      <button type="button" class="modal-button-danger" data-action="confirm">Delete</button>
    </div>
  `;
    
    content.querySelector('#delete-record-name').textContent = label;
    const errorBanner = content.querySelector('.modal-error-banner');

    openModal({ title: "Delete Record", content, onClose: clearModalUrl });

    content.querySelector('[data-action="cancel"]').addEventListener("click", closeModal);

    content.querySelector('[data-action="confirm"]').addEventListener("click", async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        errorBanner.style.display = "none";

        try {
            await onSubmit();
            closeModal();
        } catch (err) {
            console.error(err);
            errorBanner.textContent = err.message || "Failed to delete record. Please try again.";
            errorBanner.style.display = "block";
            button.disabled = false;
        }
    });
}

export { openAddModal, openEditModal, openDeleteModal };