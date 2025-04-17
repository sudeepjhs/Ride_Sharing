// The User class represents a generic user in the ride-sharing system.
// It serves as a base class for specific user types like Driver and Rider.
class User {
    #id; // Private field to store the unique identifier of the user.

    /**
     * Constructor to initialize a User instance.
     * @param {string} id - Unique identifier for the user.
     * @param {number} x_cord - X-coordinate of the user's location.
     * @param {number} y_cord - Y-coordinate of the user's location.
     */
    constructor(id, x_cord, y_cord) {
        this.#id = id; // Assign the private ID field.
        this.x_cord = x_cord; // Initialize the X-coordinate.
        this.y_cord = y_cord; // Initialize the Y-coordinate.
    }

    /**
     * Retrieves the X-coordinate of the user's location.
     * @returns {number} - The X-coordinate.
     */
    getXCord() {
        return this.x_cord;
    }

    /**
     * Retrieves the Y-coordinate of the user's location.
     * @returns {number} - The Y-coordinate.
     */
    getYCord() {
        return this.y_cord;
    }

    /**
     * Updates the X-coordinate of the user's location.
     * @param {number} cord - The new X-coordinate.
     */
    setXCord(cord) {
        this.x_cord = cord;
    }

    /**
     * Updates the Y-coordinate of the user's location.
     * @param {number} cord - The new Y-coordinate.
     */
    setYCord(cord) {
        this.y_cord = cord;
    }

    /**
     * Retrieves the user's unique identifier.
     * @returns {string} - The user's ID.
     */
    getId() {
        return this.#id;
    }
}

export default User; // Export the User class for use in other modules.