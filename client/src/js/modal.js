const modalContainer = document.getElementById("modal");

let previousActiveElement = null;
let currentModal = null;
let currentOnClose = null;

const FOCUSABLE_SELECTOR = `
    button:not([disabled]),
    [href],
    input:not([disabled]),
    select:not([disabled]),
    textarea:not([disabled]),
    [tabindex]:not([tabindex="-1"])
`;

function createModal({ title, content }) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "modal-title");

    const header = document.createElement("div");
    header.className = "modal-header";

    const heading = document.createElement("h2");
    heading.className = "modal-title";
    heading.id = "modal-title";
    heading.textContent = title;

    header.append(heading);

    const closeButton = document.createElement("button");

    closeButton.type = "button";
    closeButton.className = "modal-close";
    closeButton.setAttribute("aria-label", "Close modal");
    closeButton.textContent = "×";

    closeButton.addEventListener("click", closeModal);

    header.append(closeButton);


    const body = document.createElement("div");
    body.className = "modal-body";

    if (content instanceof Node) {
        body.append(content);
    } else {
        body.innerHTML = content;
    }

    modal.append(header, body);
    overlay.append(modal);

    return { overlay, modal };
}

function lockBodyScroll() {
    const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
}

function unlockBodyScroll() {
    document.body.style.paddingRight = "";
    document.body.style.overflow = "";
}


function openModal(options) {
    previousActiveElement = document.activeElement;

    lockBodyScroll();

    const { overlay, modal } = createModal(options);

    currentModal = modal;
    currentOnClose = options.onClose ?? null;

    modalContainer.innerHTML = "";
    modalContainer.append(overlay);

    requestAnimationFrame(() => {
        overlay.classList.add("is-open");
    });

    setupOutsideClick(overlay, modal);

    document.addEventListener("keydown", handleKeyDown);

    const firstFocusableElement = getFocusableElements(modal)[0];

    if (firstFocusableElement) {
        firstFocusableElement.focus();
    }

    return {
        modal,
        overlay
    };
}


function closeModal({ silent = false } = {}) {
    const overlay = currentModal?.closest(".modal-overlay");
    const onCloseCallback = currentOnClose;

    unlockBodyScroll();

    if (!overlay) {
        return;
    }

    overlay.classList.remove("is-open");

    let cleanedUp = false;
    const cleanup = () => {
        if (cleanedUp) return;
        cleanedUp = true;
        modalContainer.innerHTML = "";
        currentModal = null;
    };

    overlay.addEventListener(
        "transitionend",
        (event) => {
            if (event.target === overlay) {
                cleanup();
            }
        }
    );

    // Fallback in case transitionend is interrupted
    setTimeout(cleanup, 250);

    document.removeEventListener("keydown", handleKeyDown);

    if (
        previousActiveElement &&
        typeof previousActiveElement.focus === "function"
    ) {
        previousActiveElement.focus();
    }

    previousActiveElement = null;
    currentOnClose = null;

    if (!silent) {
        onCloseCallback?.();
    }
}


function setupOutsideClick(overlay, modal) {
    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            closeModal();
        }
    });
}


function handleKeyDown(event) {
    if (!currentModal) {
        return;
    }

    if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
        return;
    }

    if (event.key === "Tab") {
        trapFocus(event);
    }
}


function trapFocus(event) {
    const focusableElements = getFocusableElements(currentModal);

    if (focusableElements.length === 0) {
        event.preventDefault();
        return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!focusableElements.includes(document.activeElement)) {
        event.preventDefault();
        if (event.shiftKey) {
            lastElement.focus();
        } else {
            firstElement.focus();
        }
        return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
        return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}


function getFocusableElements(container) {
    return [...container.querySelectorAll(FOCUSABLE_SELECTOR)];
}


export {
    openModal,
    closeModal
};