// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PointsTracker is Ownable {

    struct Location {
        string longitude;
        string latitude;
    }

    // the addresses that are allowed to allocate points
    mapping (address => bool) public adminGroup;

    // map of contributed points by user to a location hash
    mapping(bytes32 => mapping(address => uint32)) public locationToUserPoints;
    mapping(bytes32 => uint32) public locationTotalPoints;

    // potentially in the future points can be used to trade for digital assets 
    mapping(address => uint32) public userTotalPoints;

    event AllocatePoints (
        Location location,
        address user,
        uint32 points
    );

    constructor() {}

    modifier isAdminGroup {
        require(adminGroup[msg.sender] == true, 'User does not have the permissions to perform this action');
        _;
    }

    function addAdmin(address user) external onlyOwner {
        adminGroup[user] = true;
    }

    function removeAdmin(address admin) external onlyOwner {
        delete adminGroup[admin];
    }

    function allocatePoints(Location memory location, address toUser, uint32 points) external isAdminGroup {
        bytes32 hashedLocation = keccak256(abi.encode(location));

        locationToUserPoints[hashedLocation][toUser] += points;
        locationTotalPoints[hashedLocation] += points;
        userTotalPoints[toUser] += points;

        emit AllocatePoints(location, toUser, points);
    }
}