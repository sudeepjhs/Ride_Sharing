const DriverRepository = require("../repositories/DriverRepository.js");
const { validateCoordinates, validateId } = require("../utils/Validation.js");

/**
 * DriverService handles business logic for Driver entities.
 */
class DriverService {
    constructor(driverRepository = new DriverRepository()) {
        this.driverRepository = driverRepository;
    }

    /**
     * Adds a new driver to the repository.
     * @param {string} id - Unique identifier for the driver.
     * @param {number} x_cord - X-coordinate of the driver's location.
     * @param {number} y_cord - Y-coordinate of the driver's location.
     * @throws {Error} If validation fails or the driver already exists.
     */
    addDriver(id, x_cord, y_cord) {
        validateId(id);
        validateCoordinates(x_cord, y_cord);
        this.driverRepository.addDriver(id, x_cord, y_cord);
    }

    /**
     * Retrieves a driver by their ID.
     * @param {string} driverId - The ID of the driver.
     * @returns {Driver} The driver object.
     * @throws {Error} If the driver is not found.
     */
    getDriverById(driverId) {
        validateId(driverId);
        const driver = this.driverRepository.getDriverById(driverId);
        if (!driver) throw new Error("Driver not found");
        return driver;
    }

    /**
     * Retrieves all drivers.
     * @returns {Driver[]} An array of all driver objects.
     */
    getAllDrivers() {
        return this.driverRepository.getAllDrivers();
    }

    /**
     * Updates the coordinates of a driver.
     * @param {string} driverId - The ID of the driver.
     * @param {number} x_cord - New X-coordinate.
     * @param {number} y_cord - New Y-coordinate.
     * @throws {Error} If validation fails or the driver is not found.
     */
    updateDriverCoordinates(driverId, x_cord, y_cord) {
        validateId(driverId);
        validateCoordinates(x_cord, y_cord);
        this.driverRepository.updateDriverCoordinate(driverId, x_cord, y_cord);
    }

    /**
     * Removes a driver by their ID.
     * @param {string} driverId - The ID of the driver to remove.
     * @throws {Error} If the driver is not found.
     */
    removeDriverById(driverId) {
        validateId(driverId);
        this.driverRepository.removeDriverById(driverId);
    }
}

module.exports = DriverService;
