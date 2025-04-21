const RiderRepository = require("../repositories/RiderRepository.js");
const { validateCoordinates, validateId } = require("../utils/Validation.js");

/**
 * RiderService handles business logic for Rider entities.
 */
class RiderService {
    constructor(riderRepository = new RiderRepository()) {
        this.riderRepository = riderRepository;
    }

    /**
     * Adds a new rider to the repository.
     * @param {string} id - Unique identifier for the rider.
     * @param {number} x_cord - X-coordinate of the rider's location.
     * @param {number} y_cord - Y-coordinate of the rider's location.
     * @throws {Error} If validation fails or the rider already exists.
     */
    addRider(id, x_cord, y_cord) {
        validateId(id);
        validateCoordinates(x_cord, y_cord);
        this.riderRepository.addRider(id, x_cord, y_cord);
    }

    /**
     * Retrieves a rider by their ID.
     * @param {string} riderId - The ID of the rider.
     * @returns {Rider} The rider object.
     * @throws {Error} If the rider is not found.
     */
    getRiderById(riderId) {
        validateId(riderId);
        const rider = this.riderRepository.getRiderById(riderId);
        if (!rider) throw new Error("Rider not found");
        return rider;
    }

    /**
     * Retrieves all riders.
     * @returns {Rider[]} An array of all rider objects.
     */
    getAllRiders() {
        return this.riderRepository.getAllRiders();
    }

    /**
     * Updates the coordinates of a rider.
     * @param {string} riderId - The ID of the rider.
     * @param {number} x_cord - New X-coordinate.
     * @param {number} y_cord - New Y-coordinate.
     * @throws {Error} If validation fails or the rider is not found.
     */
    updateRiderCoordinates(riderId, x_cord, y_cord) {
        validateId(riderId);
        validateCoordinates(x_cord, y_cord);
        this.riderRepository.updateRiderCoordinate(riderId, x_cord, y_cord);
    }

    /**
     * Removes a rider by their ID.
     * @param {string} riderId - The ID of the rider to remove.
     * @throws {Error} If the rider is not found.
     */
    removeRiderById(riderId) {
        validateId(riderId);
        this.riderRepository.removeRiderById(riderId);
    }
}

module.exports = RiderService;
