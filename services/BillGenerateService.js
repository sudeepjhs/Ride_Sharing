class BillGenerationService {
    constructor() {
        this.baseFare = 50;
        this.serviceTax = 0.2;
        this.timeFare = 2;
        this.distanceFare = 6.5;
    }
    /**
     * Calculates the total bill for a ride based on distance, time, and base fare.
     * @param {number} distance - The distance traveled during the ride.
     * @param {number} timeTaken - The time taken for the ride.
     * @returns {number} The total bill amount.
     */
    calculateBill(distance, timeTaken) {
        const distanceFare = this.distanceFare * distance;
        const timeFare = this.timeFare * timeTaken;
        const subtotal = this.baseFare + distanceFare + timeFare;
        return parseFloat((subtotal + (subtotal * this.serviceTax)).toFixed(2)); // Including 20% service tax
    }

    /**
     * Formats the bill details for display.
     * @param {string} rideId - The ID of the ride.
     * @param {string} driverId - The ID of the driver.
     * @param {number} billAmount - The total bill amount.
     * @returns {string} The formatted bill string.
     */
    static formatBill(rideId, driverId, billAmount) {
        return `BILL ${rideId} ${driverId} ${billAmount.toFixed(2)}`;
    }
}

module.exports = BillGenerationService;