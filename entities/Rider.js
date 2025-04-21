const User = require("./User.js");

// The Rider class extends the User class, representing a rider in the ride-sharing system.
class Rider extends User {
    /**
     * Constructor to initialize a Rider instance.
     * @param {string} id - Unique identifier for the rider.
     * @param {number} x_cord - X-coordinate of the rider's location.
     * @param {number} y_cord - Y-coordinate of the rider's location.
     */
    constructor(id, x_cord, y_cord) {
        // Call the parent User class constructor to initialize common properties.
        super(id, x_cord, y_cord);
    }

    /**
     * Retrieves the rider's unique identifier.
     * @returns {string} - The rider's ID.
     */
    getRiderId() {
        return this.getId(); // Reuse the getId method from the User class.
    }
}

module.exports = Rider; // Export the Rider class for use in other modules.
