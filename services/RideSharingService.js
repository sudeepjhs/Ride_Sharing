const DriverService = require("./DriverService");
const RiderService = require("./RiderService");
const RideRepository = require("../repositories/RideRepository");
const Ride = require("../entities/Ride");

/**
 * RideSharingService handles the business logic for managing rides.
 */
class RideSharingService {
    constructor(
        riderService = new RiderService(),
        driverService = new DriverService(),
        rideRepository = new RideRepository()
    ) {
        this.riderService = riderService;
        this.driverService = driverService;
        this.rideRepository = rideRepository;
        this.matchedRides = {}
    }

    /**
     * Finds drivers near a rider within a 5-unit radius.
     * @param {string} riderId - The ID of the rider.
     * @returns {string[]} An array of driver IDs sorted by proximity.
     * @throws {Error} If the rider is invalid or no drivers are available.
     */
    findDriverNearRider(riderId) {
        const rider = this.riderService.getRiderById(riderId);
        if (!rider) throw new Error("INVALID_RIDER");

        const drivers = this.driverService.getAllDrivers();
        let availableDrivers = [];

        for (const driver of drivers) {
            if (!driver.getAvailability()) continue;

            const distance = this._calculateDistance(
                rider.getXCord(),
                rider.getYCord(),
                driver.getXCord(),
                driver.getYCord()
            );

            if (distance <= 5) {
                availableDrivers.push({ driverId: driver.getId(), distance });
            }
        }

        if (availableDrivers.length === 0) {
            console.log("NO_DRIVERS_AVAILABLE");
            return [];
        }

        // Sort by distance ascending, then by driverId lex order if tie
        availableDrivers.sort((a, b) => {
            if (a.distance === b.distance) {
                return a.driverId.localeCompare(b.driverId);
            }
            return a.distance - b.distance;
        });

        // Keep only top 5
        availableDrivers = availableDrivers.slice(0, 5);

        this.matchedRides[riderId] = availableDrivers;

        const driverIds = availableDrivers.map(d => d.driverId);
        console.log("DRIVERS_MATCHED " + driverIds.join(" "));
        return driverIds;
    }

    /**
     * Starts a ride for a rider with the Nth matched driver.
     * @param {string} rideId - The ID of the ride.
     * @param {number} n - The index (1-based) of the matched driver to start ride with.
     * @param {string} riderId - The ID of the rider.
     */
    startRide(rideId, n, riderId) {
        const rider = this.riderService.getRiderById(riderId);
        if (!rider) {
            console.log("INVALID_RIDE");
            return;
        }

        const matchedDrivers = this.matchedRides[riderId];
        if (!matchedDrivers || matchedDrivers.length < n || n < 1) {
            console.log("INVALID_RIDE");
            return;
        }

        const driverId = matchedDrivers[n - 1].driverId;
        const driver = this.driverService.getDriverById(driverId);
        if (!driver || !driver.getAvailability()) {
            console.log("INVALID_RIDE");
            return;
        }

        // Check if rideId already exists
        if (this.rideRepository.getRideById(rideId)) {
            console.log("INVALID_RIDE");
            return;
        }

        driver.setAvailability(false); // Mark driver as unavailable

        const ride = new Ride(
            rideId,
            rider.getXCord(),
            rider.getYCord(),
            riderId,
            driverId
        );
        ride.setStatus('active');

        this.rideRepository.addRide(ride.getId(), ride);
        console.log("RIDE_STARTED " + rideId);
    }

    /**
     * Ends an active ride.
     * @param {string} rideId - The ID of the ride.
     * @param {number} endX - X-coordinate of the destination.
     * @param {number} endY - Y-coordinate of the destination.
     * @param {number} timeTaken - Time taken for the ride.
     */
    endRide(rideId, endX, endY, timeTaken) {
        const ride = this.rideRepository.getRideById(rideId);
        if (!ride || ride.getStatus() !== 'active') {
            console.log("INVALID_RIDE");
            return;
        }

        const driver = this.driverService.getDriverById(ride.getDriverId());
        ride.setEndCoordinates(endX, endY);
        ride.setTimeTaken(timeTaken);

        // Calculate bill using formula:
        // Base fare ₹50 + ₹6.5 per km + ₹2 per minute + 20% service tax
        const distance = this._calculateDistance(
            ride.start.x,
            ride.start.y,
            endX,
            endY
        );
        const baseFare = 50;
        const distanceFare = 6.5 * distance;
        const timeFare = 2 * timeTaken;
        const subtotal = baseFare + distanceFare + timeFare;
        const totalBill = parseFloat((subtotal * 1.2).toFixed(2));

        ride.setBill(totalBill);
        ride.setStatus('completed');

        driver.setAvailability(true); // Mark driver as available again.
        console.log("RIDE_STOPPED " + rideId);
    }

    /**
     * Prints the bill for a ride.
     * @param {string} rideId - The ID of the ride.
     */
    printBill(rideId) {
        const ride = this.rideRepository.getRideById(rideId);
        if (!ride) {
            console.log("INVALID_RIDE");
            return;
        }
        if (ride.getStatus() !== 'completed') {
            console.log("RIDE_NOT_COMPLETED");
            return;
        }
        const bill = ride.getBill();
        const driverId = ride.getDriverId();
        console.log(`BILL ${rideId} ${driverId} ${bill.toFixed(2)}`);
    }

    /**
     * Calculates the distance between two points.
     * @param {number} x1 - X-coordinate of the first point.
     * @param {number} y1 - Y-coordinate of the first point.
     * @param {number} x2 - X-coordinate of the second point.
     * @param {number} y2 - Y-coordinate of the second point.
     * @returns {number} The distance between the two points.
     */
    _calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2));
    }
}

module.exports = RideSharingService;
