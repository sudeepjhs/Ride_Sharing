const assert = require('assert');
const RideSharingService = require('./services/RideSharingService');

describe('RideSharingService', function() {
    let rideSharingService;
    let riderServiceMock;
    let driverServiceMock;
    let rideRepositoryMock;

    beforeEach(function() {
        riderServiceMock = {
            getRiderById: function(id) {
                if (id === 'rider1') {
                    return {
                        getXCord: () => 0,
                        getYCord: () => 0
                    };
                }
                return null;
            }
        };

        driverServiceMock = {
            getAllDrivers: function() {
                return [
                    { getAvailability: () => true, getXCord: () => 3, getYCord: () => 4, getId: () => 'driver1' },
                    { getAvailability: () => true, getXCord: () => 10, getYCord: () => 10, getId: () => 'driver2' },
                    { getAvailability: () => false, getXCord: () => 1, getYCord: () => 1, getId: () => 'driver3' }
                ];
            },
            getDriverById: function(id) {
                if (id === 'driver1') {
                    return {
                        getAvailability: () => true,
                        setAvailability: function() { this.available = false; },
                        available: true,
                        getId: () => 'driver1'
                    };
                }
                return null;
            }
        };

        rideRepositoryMock = {
            rides: {},
            getRideById: function(id) {
                return this.rides[id] || null;
            },
            addRide: function(id, ride) {
                this.rides[id] = ride;
            }
        };

        rideSharingService = new RideSharingService(
            riderServiceMock,
            driverServiceMock,
            rideRepositoryMock
        );
    });

    describe('#findDriverNearRider', function() {
        it('should return matched drivers within 5 units radius', function() {
            const result = rideSharingService.findDriverNearRider('rider1');
            assert.deepStrictEqual(result, ['driver1']);
        });

        it('should throw error if rider is invalid', function() {
            assert.throws(() => {
                rideSharingService.findDriverNearRider('invalidRider');
            }, /INVALID_RIDER/);
        });
    });

    describe('#startRide', function() {
        it('should start a ride with valid inputs', function() {
            rideSharingService.matchedRides = {
                'rider1': [{ driverId: 'driver1', distance: 5 }]
            };

            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.startRide('ride1', 1, 'rider1');

            assert(consoleMessages.includes('RIDE_STARTED ride1'));
            console.log = originalConsoleLog;
        });

        it('should not start ride with invalid rider', function() {
            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.startRide('ride1', 1, 'invalidRider');

            assert(consoleMessages.includes('INVALID_RIDE'));

            console.log = originalConsoleLog;
        });
    });

    describe('#endRide', function() {
        it('should end a ride and calculate bill', function() {
            const ride = {
                getStatus: () => 'active',
                setEndCoordinates: function(x, y) { this.endX = x; this.endY = y; },
                setTimeTaken: function(time) { this.timeTaken = time; },
                setBill: function(bill) { this.bill = bill; },
                setStatus: function(status) { this.status = status; },
                getDriverId: () => 'driver1',
                start: { x: 0, y: 0 }
            };
            rideRepositoryMock.rides['ride1'] = ride;

            const driver = {
                setAvailability: function() { this.available = true; },
                available: false
            };
            driverServiceMock.getDriverById = function(id) {
                if (id === 'driver1') return driver;
                return null;
            };

            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.endRide('ride1', 3, 4, 10);

            assert.strictEqual(ride.endX, 3);
            assert.strictEqual(ride.endY, 4);
            assert.strictEqual(ride.timeTaken, 10);
            assert.strictEqual(ride.status, 'completed');
            assert.strictEqual(driver.available, true);
            assert(consoleMessages.includes('RIDE_STOPPED ride1'));

            console.log = originalConsoleLog;
        });

        it('should not end ride if ride is invalid or not active', function() {
            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.endRide('invalidRide', 0, 0, 0);

            assert(consoleMessages.includes('INVALID_RIDE'));

            console.log = originalConsoleLog;
        });
    });

    describe('#printBill', function() {
        it('should print bill for completed ride', function() {
            const ride = {
                getStatus: () => 'completed',
                getBill: () => 100,
                getDriverId: () => 'driver1'
            };
            rideRepositoryMock.rides['ride1'] = ride;

            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.printBill('ride1');

            assert(consoleMessages.includes('BILL ride1 driver1 100.00'));

            console.log = originalConsoleLog;
        });

        it('should not print bill if ride is invalid or not completed', function() {
            const consoleMessages = [];
            const originalConsoleLog = console.log;
            console.log = (msg) => consoleMessages.push(msg);

            rideSharingService.printBill('invalidRide');

            assert(consoleMessages.includes('INVALID_RIDE'));

            rideRepositoryMock.rides['ride1'] = { getStatus: () => 'active' };

            rideSharingService.printBill('ride1');

            assert(consoleMessages.includes('RIDE_NOT_COMPLETED'));

            console.log = originalConsoleLog;
        });
    });
});
