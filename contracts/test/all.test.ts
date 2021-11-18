import { expect } from './chai-setup';
import { ethers, deployments, getUnnamedAccounts, getNamedAccounts } from 'hardhat';
import { PointsTracker } from '../typechain';
import { setupUsers } from './utils';

const abiCoder = new ethers.utils.AbiCoder();

const setup = deployments.createFixture(async () => {
  await deployments.fixture('deployAll');

  const PointsTracker = await ethers.getContract("PointsTracker") as PointsTracker;

  const users = await setupUsers(await getUnnamedAccounts(), { PointsTracker });
  return {
    users,
    PointsTracker
  };
});

describe('Points Tracker', function () {

  let users: any;
  let PointsTracker: PointsTracker;
  let deployer: string;
  const points = 100;

  const location1 = {
    longitude: '1239.4',
    latitude: '1212.3'
  };
  const encodedLocation1 = ethers.utils.keccak256(
    abiCoder.encode(['tuple(string, string)'], [[location1.longitude, location1.latitude]])
  );

  const location2 = {
    longitude: '129.4',
    latitude: '12.3'
  };
  const encodedLocation2 = ethers.utils.keccak256(
    abiCoder.encode(['tuple(string, string)'], [[location2.longitude, location2.latitude]])
  );

  before(async () => {
    const namedAccounts = await getNamedAccounts();
    deployer = namedAccounts.deployer;
    const result = await setup();
    users = result.users;
    PointsTracker = result.PointsTracker;
  })

  it('add admin not by owner fails', async function () {

    await expect(users[0].PointsTracker.addAdmin(users[0].address)).revertedWith('Ownable: caller is not the owner')

  });

  it('add admin by owner passes', async function () {

    const newAdmin = users[0].address;
    await PointsTracker.addAdmin(newAdmin, { from: deployer });
    expect(await PointsTracker.adminGroup(newAdmin)).equals(true);

  });

  it('remove admin not by owner fails', async function () {

    await expect(users[0].PointsTracker.removeAdmin(users[0].address)).revertedWith('Ownable: caller is not the owner')

  });

  it('remove admin by owner passes', async function () {

    const removeAdmin = users[0].address;
    expect(await PointsTracker.adminGroup(removeAdmin)).equals(true);

    await PointsTracker.removeAdmin(removeAdmin, { from: deployer });
    expect(await PointsTracker.adminGroup(removeAdmin)).equals(false);

  });

  it('add points for user fails if not admin', async function () {

    const allocateToUser = users[0].address;

    expect(await PointsTracker.adminGroup(deployer)).equals(false);
    await expect(PointsTracker.allocatePoints(location1, allocateToUser, points, { from: deployer })).to.revertedWith('User does not have the permissions to perform this action')
  });

  it('add points for user at a location', async function () {
    await PointsTracker.addAdmin(deployer, { from: deployer });

    const allocateToUser = users[0].address;

    await expect(PointsTracker.allocatePoints(location1, allocateToUser, points, { from: deployer })).to.emit(PointsTracker, 'AllocatePoints')
      .withArgs([location1.longitude, location1.latitude], allocateToUser, points);

    expect(await PointsTracker.userTotalPoints(allocateToUser)).equals(points);
    expect(await PointsTracker.locationToUserPoints(encodedLocation1, allocateToUser)).equals(points);
    expect(await PointsTracker.locationTotalPoints(encodedLocation1)).equals(points);

  });

  it('add more points for same user at a location doubles totals', async function () {
    await PointsTracker.addAdmin(deployer, { from: deployer });

    const allocateToUser = users[0].address;

    await expect(PointsTracker.allocatePoints(location1, allocateToUser, points, { from: deployer })).to.emit(PointsTracker, 'AllocatePoints')
      .withArgs([location1.longitude, location1.latitude], allocateToUser, points);

    expect(await PointsTracker.userTotalPoints(allocateToUser)).equals(2 * points);
    expect(await PointsTracker.locationToUserPoints(encodedLocation1, allocateToUser)).equals(2 * points);
    expect(await PointsTracker.locationTotalPoints(encodedLocation1)).equals(2 * points);

  });

  it('add points for different user at same location', async function () {
    await PointsTracker.addAdmin(deployer, { from: deployer });

    const allocateToUser = users[1].address;

    await expect(PointsTracker.allocatePoints(location1, allocateToUser, points, { from: deployer })).to.emit(PointsTracker, 'AllocatePoints')
      .withArgs([location1.longitude, location1.latitude], allocateToUser, points);

    expect(await PointsTracker.userTotalPoints(allocateToUser)).equals(points);
    expect(await PointsTracker.locationToUserPoints(encodedLocation1, allocateToUser)).equals(points);
    expect(await PointsTracker.locationTotalPoints(encodedLocation1)).equals(3 * points);

  });

  it('add points for same user at different location', async function () {
    await PointsTracker.addAdmin(deployer, { from: deployer });

    const allocateToUser = users[1].address;

    await expect(PointsTracker.allocatePoints(location2, allocateToUser, points, { from: deployer })).to.emit(PointsTracker, 'AllocatePoints')
      .withArgs([location2.longitude, location2.latitude], allocateToUser, points);

    expect(await PointsTracker.userTotalPoints(allocateToUser)).equals(2 * points);
    expect(await PointsTracker.locationToUserPoints(encodedLocation2, allocateToUser)).equals(points);
    expect(await PointsTracker.locationTotalPoints(encodedLocation2)).equals(points);

  });

});
