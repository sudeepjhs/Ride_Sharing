const Rider = require('../entities/Rider.js');

/**
 * RiderRepository manages the storage and operations for Rider entities.
 */
class RiderRepository {
    #riders; // Private field to store all riders.

    constructor() {
        this.#riders = {}; // Initialize an empty object to store riders by their ID.
    }

    /**
     * Adds a new rider to the repository.
     * @param {string} id - Unique identifier for the rider.
     * @param {number} x_cord - X-coordinate of the rider's location.
     * @param {number} y_cord - Y-coordinate of the rider's location.
     * @throws {Error} If a rider with the same ID already exists.
     */
    addRider(id, x_cord, y_cord) {
        if (this._checkRiderId(id)) {
            throw new Error('Rider already exists');
        }
        const rider = new Rider(id, x_cord, y_cord);
        this.#riders[id] = rider;
    }

    /**
     * Retrieves a rider by their ID.
     * @param {string} riderId - The ID of the rider.
     * @returns {Rider|null} The rider object or null if not found.
     */
    getRiderById(riderId) {
        return this.#riders[riderId] || null;
    }

    /**
     * Retrieves all riders in the repository.
     * @returns {Rider[]} An array of all rider objects.
     */
    getAllRiders() {
        return Object.values(this.#riders);
    }

    /**
     * Finds riders by their coordinates.
     * @param {number} x_cord - X-coordinate to search for.
     * @param {number} y_cord - Y-coordinate to search for.
     * @returns {Rider[]} An array of riders matching the coordinates.
     */
    getRidersByCoordinate(x_cord, y_cord) {
        return Object.values(this.#riders).filter(
            (rider) => rider.getXCord() === x_cord && rider.getYCord() === y_cord
        );
    }

    /**
     * Updates the coordinates of a rider.
     * @param {string} riderId - The ID of the rider.
     * @param {number} x_cord - New X-coordinate.
     * @param {number} y_cord - New Y-coordinate.
     * @throws {Error} If the rider ID is invalid.
     */
    updateRiderCoordinate(riderId, x_cord, y_cord) {
        if (!this.#riders.hasOwnProperty(riderId)) {
            throw new Error('Invalid Rider ID');
        }
        const rider = this.#riders[riderId];
        rider.setXCord(x_cord);
        rider.setYCord(y_cord);
    }

    /**
     * Removes a rider by their ID.
     * @param {string} id - The ID of the rider to remove.
     * @throws {Error} If the rider ID is invalid.
     */
    removeRiderById(id) {
        if (!this.#riders.hasOwnProperty(id)) {
            throw new Error('Invalid Rider ID');
        }
        delete this.#riders[id];
    }

    /**
     * Checks if a rider ID exists in the repository.
     * @param {string} id - The ID to check.
     * @returns {boolean} True if the ID exists, false otherwise.
     */
    _checkRiderId(id) {
        return this.#riders.hasOwnProperty(id);
    }
}

module.exports = RiderRepository;
