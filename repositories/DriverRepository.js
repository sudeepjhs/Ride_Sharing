import Driver from '../entities/Driver';

/**
 * DriverRepository manages the storage and operations for Driver entities.
 */
class DriverRepository {
    #drivers; // Private field to store all drivers.

    constructor() {
        this.#drivers = {}; // Initialize an empty object to store drivers by their ID.
    }

    /**
     * Adds a new driver to the repository.
     * @param {string} id - Unique identifier for the driver.
     * @param {number} x_cord - X-coordinate of the driver's location.
     * @param {number} y_cord - Y-coordinate of the driver's location.
     * @throws {Error} If a driver with the same ID already exists.
     */
    addDriver(id, x_cord, y_cord) {
        if (this._checkDriverId(id)) {
            throw new Error('Driver already exists');
        }
        const driver = new Driver(id, x_cord, y_cord);
        this.#drivers[id] = driver;
    }

    /**
     * Retrieves a driver by their ID.
     * @param {string} driverId - The ID of the driver.
     * @returns {Driver|null} The driver object or null if not found.
     */
    getDriverById(driverId) {
        return this.#drivers[driverId] || null;
    }

    /**
     * Retrieves all drivers in the repository.
     * @returns {Driver[]} An array of all driver objects.
     */
    getAllDrivers() {
        return Object.values(this.#drivers);
    }

    /**
     * Finds drivers by their coordinates.
     * @param {number} x_cord - X-coordinate to search for.
     * @param {number} y_cord - Y-coordinate to search for.
     * @returns {Driver[]} An array of drivers matching the coordinates.
     */
    getDriversByCoordinate(x_cord, y_cord) {
        return Object.values(this.#drivers).filter(
            (driver) => driver.getXCord() === x_cord && driver.getYCord() === y_cord
        );
    }

    /**
     * Updates the coordinates of a driver.
     * @param {string} driverId - The ID of the driver.
     * @param {number} x_cord - New X-coordinate.
     * @param {number} y_cord - New Y-coordinate.
     * @throws {Error} If the driver ID is invalid.
     */
    updateDriverCoordinate(driverId, x_cord, y_cord) {
        if (!this._checkDriverId(driverId)) {
            throw new Error('Invalid Driver ID');
        }
        const driver = this.#drivers[driverId];
        driver.setXCord(x_cord);
        driver.setYCord(y_cord);
    }

    /**
     * Removes a driver by their ID.
     * @param {string} id - The ID of the driver to remove.
     * @throws {Error} If the driver ID is invalid.
     */
    removeDriverById(id) {
        if (!this._checkDriverId(id)) {
            throw new Error('Invalid Driver ID');
        }
        delete this.#drivers[id];
    }

    getDriverAvailability(driverId) {
        if (!this._checkDriverId(driverId)) {
            throw new Error('Invalid Driver ID');
        }
        return this.#drivers[driverId].getAvailability()
    }

    /**
     * Checks if a driver ID exists in the repository.
     * @param {string} id - The ID to check.
     * @returns {boolean} True if the ID exists, false otherwise.
     */
    _checkDriverId(id) {
        return this.#drivers.hasOwnProperty(id);
    }
}

export default DriverRepository;
