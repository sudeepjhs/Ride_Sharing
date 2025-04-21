const User = require("./User.js");
const { validateId, validateCoordinates } = require("../utils/Validation.js");

// The Driver class extends the User class, representing a driver in the ride-sharing system.
class Driver extends User {
    /**
     * Constructor to initialize a Driver instance.
     * @param {string} id - Unique identifier for the driver.
     * @param {number} x_cord - X-coordinate of the driver's location.
     * @param {number} y_cord - Y-coordinate of the driver's location.
     */
    constructor(id, x_cord, y_cord) {
        validateId(id);
        validateCoordinates(x_cord, y_cord);
        // Call the parent User class constructor to initialize common properties.
        super(id, x_cord, y_cord);
        this.available = true;
    }

    setAvailability(available) {
        this.available = available;
    }

    getAvailability() {
        return this.available;
    }
}

module.exports = Driver; // Export the Driver class for use in other modules.
