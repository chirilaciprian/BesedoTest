import { describe, test, expect, beforeEach } from "vitest";
import {
    setSearchQuery,
    getSearchQuery,
    filterItems,
} from "../src/js/table-search.js";

describe("table-search", () => {
    const items = [
        {
            name: "John Doe",
            email: "john@example.com",
            city: "London",
        },
        {
            name: "Jane Smith",
            email: "jane@example.com",
            city: "Paris",
        },
        {
            name: "Bob Johnson",
            email: "bob@example.com",
            city: "London",
        },
    ];

    const columns = ["name", "email", "city"];

    beforeEach(() => {
        setSearchQuery("");
    });

    test("returns all items when search query is empty", () => {
        expect(filterItems(items, columns)).toEqual(items);
    });

    test("filters items by matching text", () => {
        setSearchQuery("John");

        expect(filterItems(items, columns)).toEqual([
            items[0],
            items[2],
        ]);
    });

    test("search is case-insensitive", () => {
        setSearchQuery("LONDON");

        expect(filterItems(items, columns)).toEqual([
            items[0],
            items[2],
        ]);
    });

    test("searches across all columns", () => {
        setSearchQuery("paris");

        expect(filterItems(items, columns)).toEqual([items[1]]);
    });

    test("returns an empty array when there are no matches", () => {
        setSearchQuery("Berlin");

        expect(filterItems(items, columns)).toEqual([]);
    });

    test("trims whitespace from the search query", () => {
        setSearchQuery("  John  ");

        expect(getSearchQuery()).toBe("john");
        expect(filterItems(items, columns)).toEqual([
            items[0],
            items[2],
        ]);
    });

    test("handles null and undefined values", () => {
        const data = [
            { name: "John", email: null },
            { name: "Jane", email: undefined },
        ];

        setSearchQuery("john");

        expect(filterItems(data, ["name", "email"])).toEqual([data[0]]);
    });
});