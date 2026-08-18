let query = "";

function setSearchQuery(value) {
    query = value.trim().toLowerCase();
}

function getSearchQuery() {
    return query;
}

function filterItems(items, columns) {
    if (!query) return items;
    return items.filter((item) =>
        columns.some((column) =>
            String(item[column] ?? "").toLowerCase().includes(query)
        )
    );
}

export { setSearchQuery, getSearchQuery, filterItems };