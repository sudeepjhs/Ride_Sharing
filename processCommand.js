const { validateId, validateCoordinates } = require("./utils/Validation.js");
const RideSharingService = require("./services/RideSharingService.js");
const DriverService = require("./services/DriverService.js");
const RiderService = require("./services/RiderService.js");
const DriverRepository = require("./repositories/DriverRepository.js");
const RiderRepository = require("./repositories/RiderRepository.js");

const ERROR_MESSAGES = {
    INVALID_COMMAND: "Invalid command",
    INVALID_ARG_COUNT: "Invalid argument count for",
    INVALID_ARG_TYPE: "Invalid argument type for",
};

class ProcessCommand {
    constructor(
        rideSharingService = new RideSharingService(
            new RiderService(new RiderRepository()),
            new DriverService(new DriverRepository())
        )
    ) {
        this.rideSharingService = rideSharingService;

        this.commandHandlers = {
            "ADD_DRIVER": this.#handleAddDriver.bind(this),
            "ADD_RIDER": this.#handleAddRider.bind(this),
            "MATCH": this.#handleMatch.bind(this),
            "START_RIDE": this.#handleStartRide.bind(this),
            "STOP_RIDE": this.#handleStopRide.bind(this),
            "BILL": this.#handleBill.bind(this),
        };
    }

    process(command, args) {
        const handler = this.commandHandlers[command.toUpperCase()];
        if (!handler) {
            console.error(`${ERROR_MESSAGES.INVALID_COMMAND}: ${command}`);
            return;
        }
        try {
            this.#validateArgsCount(command, args);
            handler(args);
        } catch (error) {
            console.error(`Error processing command "${command}": ${error.message}`);
        }
    }

    #validateArgsCount(command, args) {
        const expectedCounts = {
            "ADD_DRIVER": 3,
            "ADD_RIDER": 3,
            "MATCH": 1,
            "START_RIDE": 3,
            "STOP_RIDE": 4,
            "BILL": 1,
        };
        if (args.length !== expectedCounts[command.toUpperCase()]) {
            throw new Error(`${ERROR_MESSAGES.INVALID_ARG_COUNT} ${command}`);
        }
    }

    #handleAddDriver(args) {
        const [driverId, xStr, yStr] = args;
        validateId(driverId);
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        if (isNaN(x) || isNaN(y)) {
            throw new Error(`${ERROR_MESSAGES.INVALID_ARG_TYPE} coordinates`);
        }
        this.rideSharingService.driverService.addDriver(driverId, x, y);
    }

    #handleAddRider(args) {
        const [riderId, xStr, yStr] = args;
        validateId(riderId);
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        if (isNaN(x) || isNaN(y)) {
            throw new Error(`${ERROR_MESSAGES.INVALID_ARG_TYPE} coordinates`);
        }
        this.rideSharingService.riderService.addRider(riderId, x, y);
    }

    #handleMatch(args) {
        const [riderId] = args;
        validateId(riderId);
        this.rideSharingService.findDriverNearRider(riderId);
    }

    #handleStartRide(args) {
        const [rideId, nStr, riderId] = args;
        validateId(rideId);
        const n = parseInt(nStr);
        if (isNaN(n) || n < 1) {
            throw new Error(`${ERROR_MESSAGES.INVALID_ARG_TYPE} ride index`);
        }
        validateId(riderId);
        this.rideSharingService.startRide(rideId, n, riderId);
    }

    #handleStopRide(args) {
        const [rideId, endXStr, endYStr, timeTakenStr] = args;
        validateId(rideId);
        const endX = parseFloat(endXStr);
        const endY = parseFloat(endYStr);
        const timeTaken = parseFloat(timeTakenStr);
        if (isNaN(endX) || isNaN(endY) || isNaN(timeTaken)) {
            throw new Error(`${ERROR_MESSAGES.INVALID_ARG_TYPE} stop ride parameters`);
        }
        this.rideSharingService.endRide(rideId, endX, endY, timeTaken);
    }

    #handleBill(args) {
        const [rideId] = args;
        validateId(rideId);
        this.rideSharingService.printBill(rideId);
    }
}

module.exports = ProcessCommand;
