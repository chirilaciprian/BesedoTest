function setModalUrl(params) {
    const url = new URL(window.location.href);
    url.search = "";
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            url.searchParams.set(key, value);
        }
    });
    history.pushState(params, "", url);
}

function clearModalUrl() {
    if (!window.location.search) return;
    const url = new URL(window.location.href);
    url.search = "";
    history.pushState({}, "", url);
}

function getModalParams() {
    const params = new URLSearchParams(window.location.search);
    const modal = params.get("modal");
    if (!modal) return null;

    const rawId = params.get("id");
    return {
        modal,
        id: rawId !== null ? (isNaN(Number(rawId)) ? rawId : Number(rawId)) : null,
    };
}

export { setModalUrl, clearModalUrl, getModalParams };