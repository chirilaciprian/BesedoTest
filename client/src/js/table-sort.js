let currentSort = {
    column: null,
    direction: null
};

function sortItems(items) {
    if (!currentSort.column || !currentSort.direction) {
        return items;
    }

    const column = currentSort.column;
    const direction = currentSort.direction;

    return [...items].sort((a, b) => {
        const valueA = a[column];
        const valueB = b[column];

        if (valueA == null && valueB == null) {
            return 0;
        }

        if (valueA == null) {
            return -1;
        }

        if (valueB == null) {
            return 1;
        }

        if (
            typeof valueA === "number" &&
            typeof valueB === "number"
        ) {
            return direction === "asc"
                ? valueA - valueB
                : valueB - valueA;
        }

        const result = String(valueA).localeCompare(
            String(valueB),
            undefined,
            {
                numeric: true,
                sensitivity: "base"
            }
        );

        return direction === "asc"
            ? result
            : -result;
    });
}

function handleSort(column) {
    if (currentSort.column !== column) {
        currentSort.column = column;
        currentSort.direction = "asc";
    } else if (currentSort.direction === "asc") {
        currentSort.direction = "desc";
    } else {
        currentSort.column = null;
        currentSort.direction = null;
    }

    return {
        ...currentSort
    };
}

function getSortState() {
    return {
        ...currentSort
    };
}

function getSortDirection(column) {
    if (currentSort.column !== column) {
        return null;
    }
    return currentSort.direction;
}

function getSortIndicator(column) {
    if (currentSort.column !== column) {
        return "none";
    }
    return currentSort.direction;
}

export {
    sortItems,
    handleSort,
    getSortState,
    getSortDirection,
    getSortIndicator
};