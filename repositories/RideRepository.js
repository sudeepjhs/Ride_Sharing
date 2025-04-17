/**
 * RideRepository manages the storage and operations for Ride entities.
 */
class RideRepository {
    #rides; // Private field to store all rides.

    constructor() {
        this.#rides = {}; // Initialize an empty object to store rides by their ID.
    }

    /**
     * Adds a new ride to the repository.
     * @param {string} rideId - Unique identifier for the ride.
     * @param {Ride} rideData - The ride data to store.
     */
    addRide(rideId, rideData) {
        if (this.#rides[rideId]) {
            throw new Error("Ride already exists");
        }
        this.#rides[rideId] = rideData;
    }

    /**
     * Retrieves a ride by its ID.
     * @param {string} rideId - The ID of the ride.
     * @returns {Ride|null} The ride object or null if not found.
     */
    getRideById(rideId) {
        return this.#rides[rideId] || null;
    }

    /**
     * Retrieves all rides.
     * @returns {Ride[]} An array of all ride objects.
     */
    getAllRides() {
        return Object.values(this.#rides);
    }

    /**
     * Removes a ride by its ID.
     * @param {string} rideId - The ID of the ride to remove.
     */
    removeRideById(rideId) {
        if (!this.#rides[rideId]) {
            throw new Error("Ride not found");
        }
        delete this.#rides[rideId];
    }
}

export default RideRepository;