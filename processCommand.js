const RideSharingService = require("./services/RideSharingService.js");
const DriverService = require("./services/DriverService.js");
const RiderService = require("./services/RiderService.js");
const DriverRepository = require("./repositories/DriverRepository.js");
const RiderRepository = require("./repositories/RiderRepository.js");

class ProcessCommand {
    constructor() {
        this.rideSharingService = new RideSharingService(
            new RiderService(new RiderRepository()),
            new DriverService(new DriverRepository())
        );

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
            console.error(`Invalid command: ${command}`);
            return;
        }
        try {
            handler(args);
        } catch (error) {
            console.error(`Error processing command "${command}": ${error.message}`);
        }
    }

    #handleAddDriver(args) {
        if (args.length !== 3) {
            throw new Error("Invalid argument count for ADD_DRIVER");
        }
        const [driverId, xStr, yStr] = args;
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        this.rideSharingService.driverService.addDriver(driverId, x, y);
    }

    #handleAddRider(args) {
        if (args.length !== 3) {
            throw new Error("Invalid argument count for ADD_RIDER");
        }
        const [riderId, xStr, yStr] = args;
        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        this.rideSharingService.riderService.addRider(riderId, x, y);
    }

    #handleMatch(args) {
        if (args.length !== 1) {
            throw new Error("Invalid argument count for MATCH");
        }
        const [riderId] = args;
        this.rideSharingService.findDriverNearRider(riderId);
    }

    #handleStartRide(args) {
        if (args.length !== 3) {
            throw new Error("Invalid argument count for START_RIDE");
        }
        const [rideId, nStr, riderId] = args;
        const n = parseInt(nStr);
        this.rideSharingService.startRide(rideId, n, riderId);
    }

    #handleStopRide(args) {
        if (args.length !== 4) {
            throw new Error("Invalid argument count for STOP_RIDE");
        }
        const [rideId, endXStr, endYStr, timeTakenStr] = args;
        const endX = parseFloat(endXStr);
        const endY = parseFloat(endYStr);
        const timeTaken = parseFloat(timeTakenStr);
        this.rideSharingService.endRide(rideId, endX, endY, timeTaken);
    }

    #handleBill(args) {
        if (args.length !== 1) {
            throw new Error("Invalid argument count for BILL");
        }
        const [rideId] = args;
        this.rideSharingService.printBill(rideId);
    }
}

module.exports = ProcessCommand;
