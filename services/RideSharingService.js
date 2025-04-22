const DriverService = require("./DriverService");
const RiderService = require("./RiderService");
const RideRepository = require("../repositories/RideRepository");
const Ride = require("../entities/Ride");
const BillGenerationService = require("./BillGenerateService");
const {
    ERROR_MESSAGES,
    RIDE_STATUS,
    DISTANCE_THRESHOLD,
    MAX_MATCHED_DRIVERS,
    DECIMAL_PLACES,
} = require("../constants");

class RideSharingService {
    constructor(
        riderService = new RiderService(),
        driverService = new DriverService(),
        rideRepository = new RideRepository()
    ) {
        this.riderService = riderService;
        this.driverService = driverService;
        this.rideRepository = rideRepository;
        this.billService = new BillGenerationService();
        this.matchedRides = {};
    }

    findDriverNearRider(riderId) {
        const rider = this.riderService.getRiderById(riderId);
        if (!rider) throw new Error(ERROR_MESSAGES.INVALID_RIDER);

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

            if (distance <= DISTANCE_THRESHOLD) {
                availableDrivers.push({ driverId: driver.getId(), distance });
            }
        }

        if (availableDrivers.length === 0) {
            console.log(ERROR_MESSAGES.NO_DRIVERS_AVAILABLE);
            return [];
        }

        availableDrivers.sort((a, b) => {
            if (a.distance === b.distance) {
                return a.driverId.localeCompare(b.driverId);
            }
            return a.distance - b.distance;
        });

        availableDrivers = availableDrivers.slice(0, MAX_MATCHED_DRIVERS);

        this.matchedRides[riderId] = availableDrivers;

        const driverIds = availableDrivers.map((d) => d.driverId);
        console.log(ERROR_MESSAGES.DRIVERS_MATCHED + " " + driverIds.join(" "));
        return driverIds;
    }

    startRide(rideId, n, riderId) {
        const rider = this.riderService.getRiderById(riderId);
        if (!rider) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }

        const matchedDrivers = this.matchedRides[riderId];
        if (!matchedDrivers || matchedDrivers.length < n || n < 1) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }

        const driverId = matchedDrivers[n - 1].driverId;
        const driver = this.driverService.getDriverById(driverId);
        if (!driver || !driver.getAvailability()) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }

        if (this.rideRepository.getRideById(rideId)) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }

        driver.setAvailability(false);

        const ride = new Ride(
            rideId,
            rider.getXCord(),
            rider.getYCord(),
            riderId,
            driverId
        );
        ride.setStatus(RIDE_STATUS.ACTIVE);

        this.rideRepository.addRide(ride.getId(), ride);
        console.log(ERROR_MESSAGES.RIDE_STARTED + " " + rideId);
    }

    endRide(rideId, endX, endY, timeTaken) {
        const ride = this.rideRepository.getRideById(rideId);
        if (!ride || ride.getStatus() !== RIDE_STATUS.ACTIVE) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }

        const driver = this.driverService.getDriverById(ride.getDriverId());
        ride.setEndCoordinates(endX, endY);
        ride.setTimeTaken(timeTaken);

        const distance = this._calculateDistance(
            ride.start.x,
            ride.start.y,
            endX,
            endY
        );
        const totalBill = this.billService.calculateBill(distance, timeTaken);
        ride.setBill(totalBill);
        ride.setStatus(RIDE_STATUS.COMPLETED);

        driver.setAvailability(true);
        console.log(ERROR_MESSAGES.RIDE_STOPPED + " " + rideId);
    }

    printBill(rideId) {
        const ride = this.rideRepository.getRideById(rideId);
        if (!ride) {
            console.log(ERROR_MESSAGES.INVALID_RIDE);
            return;
        }
        if (ride.getStatus() !== RIDE_STATUS.COMPLETED) {
            console.log(ERROR_MESSAGES.RIDE_NOT_COMPLETED);
            return;
        }
        const bill = ride.getBill();
        const driverId = ride.getDriverId();
        console.log(BillGenerationService.formatBill(rideId, driverId, bill));
    }

    _calculateDistance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(DECIMAL_PLACES));
    }
}

module.exports = RideSharingService;
