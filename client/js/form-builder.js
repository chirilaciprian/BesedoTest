function formatLabel(column) {
  if (!column) return "";
  return column
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^\w/, (c) => c.toUpperCase());
}

function inputTypeForColumn(column) {
  if (/email/i.test(column)) return "email";
  if (/phone/i.test(column)) return "tel";
  if (/url|website/i.test(column)) return "url";
  return "text";
}

function buildForm(columns, item = {}) {
  const form = document.createElement("form");
  form.className = "modal-form";
  form.noValidate = true;
  columns.forEach((column) => {
    const group = document.createElement("div");
    group.className = "form-group";

    const label = document.createElement("label");
    label.setAttribute("for", `field-${column}`);
    label.textContent = formatLabel(column);

    const input = document.createElement("input");
    input.id = `field-${column}`;
    input.name = column;
    input.type = inputTypeForColumn(column);
    input.value = item?.[column] ?? "";
    input.required = true;

    const error = document.createElement("span");
    error.className = "form-error";
    error.id = `error-${column}`;
    input.setAttribute("aria-describedby", error.id);

    group.append(label, input, error);
    form.append(group);
  });

  const actions = document.createElement("div");
  actions.className = "modal-actions";
  actions.innerHTML = `
    <button type="button" class="modal-button-secondary" data-action="cancel">Cancel</button>
    <button type="submit" class="modal-button-primary">Save</button>
  `;
  form.append(actions);

  form.querySelectorAll("input").forEach((input) => {
    input.addEventListener("input", () => clearFieldError(form, input.name));
  });

  return form;
}

function clearFieldError(form, column) {
  const error = form.querySelector(`#error-${column}`);
  const input = form.querySelector(`[name="${column}"]`);
  if (error) error.textContent = "";
  if (input) {
    input.classList.remove("is-invalid", "input-invalid");
    input.removeAttribute("aria-invalid");
  }
}

function validateForm(form, columns) {
  let valid = true;
  let firstInvalid = null;

  columns.forEach((column) => {
    const input = form.querySelector(`[name="${column}"]`);
    const error = form.querySelector(`#error-${column}`);
    const value = input.value.trim();

    clearFieldError(form, column);

    if (!value) {
      error.textContent = `${formatLabel(column)} is required.`;
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      valid = false;
      firstInvalid ??= input;
      return;
    }

    if (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error.textContent = "Enter a valid email address.";
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      valid = false;
      firstInvalid ??= input;
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return valid;
}

function getFormData(form, columns) {
  const valid = validateForm(form, columns);
  const data = {};
  columns.forEach((column) => {
    data[column] = form.querySelector(`[name="${column}"]`).value.trim();
  });
  return { data, valid };
}

export { buildForm, getFormData, formatLabel };