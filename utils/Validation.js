/**
 * Validates a unique identifier.
 * @param {string} id - The ID to validate.
 * @throws {Error} If the ID is invalid.
 */
export function validateId(id) {
    if (!id || typeof id !== "string" || id.trim() === "") {
        throw new Error("Invalid ID: ID must be a non-empty string.");
    }
}

/**
 * Validates coordinates.
 * @param {number} x_cord - The X-coordinate to validate.
 * @param {number} y_cord - The Y-coordinate to validate.
 * @throws {Error} If the coordinates are invalid.
 */
export function validateCoordinates(x_cord, y_cord) {
    if (typeof x_cord !== "number" || typeof y_cord !== "number") {
        throw new Error("Invalid coordinates: Both X and Y must be numbers.");
    }
    if (x_cord < 0 || y_cord < 0) {
        throw new Error("Invalid coordinates: X and Y must be non-negative.");
    }
}