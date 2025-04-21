import { strict as assert } from 'assert';
import RideService from './services/RideSharingService.js';

describe('Ride Sharing Service (ESM)', () => {
  let service;

  beforeEach(() => {
    service = new RideService();

    // Seed drivers
    service.driverService.addDriver('driver1', 0, 0);
    service.driverService.addDriver('driver1', 10, 10);

    // Seed riders
    service.riderService.addRider('rider1', 3, 4); // 5km from driver1
    service.riderService.addRider('rider2', 20, 20); // No match
  });

  describe('Matching Logic', () => {
    it('matches rider1 with driver1 (within 5km)', () => {
      const matches = service.findDriverNearRider('rider1');
      assert.equal(matches.length, 1);
      assert.equal(matches[0], 'driver1');
    });

    it('returns empty list for rider2 (no nearby drivers)', () => {
      const matches = service.findDriverNearRider('rider2');
      assert.equal(matches.length, 0);
    });
  });

  describe('Ride Flow', () => {
    it('starts a ride and marks driver as unavailable', () => {
      service.findDriverNearRider('rider1');
      service.startRide('ride1', 1, 'rider1');
      const driver = service.driverService.getDriverById('driver1');
      assert.equal(driver.getAvailability(), false);
    });

    it('ends a ride and calculates correct bill', () => {
      service.startRide('ride1', 1, 'rider1');
      service.endRide('ride1', 6, 8, 10); // 5km from start, 10 minutes
      const ride = service.rideRepository.getRideById('ride1');
      assert.equal(ride.getDistance(), 5.00);
      const expectedAmount = parseFloat(((50 + 6.5 * 5 + 2 * 10) * 1.2).toFixed(2));
      assert.equal(ride.getBill(), expectedAmount);
    });
  });

  describe('Error Handling', () => {
    it('does not start ride if no matching drivers', () => {
      service.findDriverNearRider('rider2');
      service.startRide('ride2', 1, 'rider2');
      const ride = service.rideRepository.getRideById('ride2');
      assert.equal(ride, undefined);
    });

    it('does not print bill if ride not completed', () => {
      service.startRide('ride3', 1, 'rider1');
      const ride = service.rideRepository.getRideById('ride3');
      assert.notEqual(ride, undefined);
      assert.equal(ride.getStatus(), 'active');
    });
  });
});
