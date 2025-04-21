
/**
 * The Ride class represents a ride in the ride-sharing system.
 */
class Ride {
    constructor(id, startX, startY, riderId, driverId) {
        this.id = id; // Unique identifier for the ride.
        this.start = { x: startX, y: startY }; // Starting coordinates of the ride.
        this.end = {}; // Ending coordinates of the ride.
        this.riderId = riderId; // ID of the rider.
        this.driverId = driverId; // ID of the driver.
        this.timeTaken = null; // Time taken for the ride.
        this.bill = null; // Bill for the ride.
        this.status = 'active'; // Status of the ride: 'active' or 'completed'
    }

    /**
     * Sets the ending coordinates of the ride.
     * @param {number} endX - X-coordinate of the destination.
     * @param {number} endY - Y-coordinate of the destination.
     */
    setEndCoordinates(endX, endY) {
        this.end = { x: endX, y: endY };
    }

    /**
     * Retrieves the ending coordinates of the ride.
     * @returns {Object} The ending coordinates.
     */
    getEndCoordinates() {
        return this.end;
    }

    /**
     * Sets the time taken for the ride.
     * @param {number} time - The time taken for the ride.
     */
    setTimeTaken(time) {
        this.timeTaken = time;
    }

    /**
     * Retrieves the time taken for the ride.
     * @returns {number|null} The time taken for the ride.
     */
    getTimeTaken() {
        return this.timeTaken;
    }

    /**
     * Sets the bill for the ride.
     * @param {number} bill - The bill amount.
     */
    setBill(bill) {
        this.bill = bill;
    }

    /**
     * Retrieves the bill for the ride.
     * @returns {number|null} The bill amount.
     */
    getBill() {
        return this.bill;
    }

    /**
     * Sets the status of the ride.
     * @param {string} status - The status ('active' or 'completed').
     */
    setStatus(status) {
        this.status = status;
    }

    /**
     * Retrieves the status of the ride.
     * @returns {string} The status of the ride.
     */
    getStatus() {
        return this.status;
    }

    /**
     * Retrieves the ride's unique identifier.
     * @returns {string} The ride ID.
     */
    getId() {
        return this.id;
    }

    /**
     * Retrieves the rider's ID.
     * @returns {string} The rider ID.
     */
    getRiderId() {
        return this.riderId;
    }

    /**
     * Retrieves the driver's ID.
     * @returns {string} The driver ID.
     */
    getDriverId() {
        return this.driverId;
    }
}

module.exports= Ride;
