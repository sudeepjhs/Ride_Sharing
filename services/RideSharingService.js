import DriverService from "./DriverService";
import RiderService from "./RiderService";
import RideRepository from "../repositories/RideRepository";
import Ride from "../entities/Ride";

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
        const availableDrivers = [];

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

        availableDrivers.sort((a, b) => a.distance - b.distance);
        this.matchedRides[riderId] = availableDrivers
        return availableDrivers.map((d) => d.driverId);
    }

    /**
     * Starts a ride for a rider with a matched driver.
     * @param {string} riderId - The ID of the rider.
     * @throws {Error} If the rider or driver is invalid or unavailable.
     */
    startRide(riderId) {
        const rider = this.riderService.getRiderById(riderId);
        if (!rider) throw new Error("INVALID_RIDER");
        const driver = this.driverService.getDriverById(this.matchedRides[riderId].)
        const ride = new Ride(
            `${riderId}-${driverId}`,
            rider.getXCord(),
            rider.getYCord(),
            riderId,
            driverId
        );

        this.rideRepository.addRide(ride.getId(), ride);
    }

    /**
     * Ends an active ride for a rider.
     * @param {string} rideId - The ID of the ride.
     * @param {number} endX - X-coordinate of the ride's destination.
     * @param {number} endY - Y-coordinate of the ride's destination.
     * @param {number} timeTaken - Time taken for the ride.
     * @throws {Error} If the ride is not active.
     */
    endRide(rideId, endX, endY, timeTaken) {
        const ride = this.rideRepository.getRideById(rideId);
        if (!ride) throw new Error("NO_ACTIVE_RIDE");

        const driver = this.driverService.getDriverById(ride.getDriverId());
        ride.setEndCoordinates(endX, endY);
        ride.setTimeTaken(timeTaken);

        driver.setAvailability(true); // Mark the driver as available again.
        this.rideRepository.removeRideById(rideId); // Remove the ride from active rides.
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

export default RideSharingService;