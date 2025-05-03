// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract VotingSystem {
    address private owner;
    uint256 private positionCount;
    uint256 public candidateCount;

    struct Position {
        uint256 id;
        string name;
        bool exists;
    }

    struct Voter {
        string name;
        address voterAddress;
        bool isRegistered;
    }

    struct Candidate {
        uint256 id;
        string name;
        uint256 positionId;
        uint256 voteCount;
    }

    mapping(uint256 => Position) private positions;
    mapping(address => Voter) private voters;
    mapping(uint256 => Candidate) private candidates;
    mapping(string => uint256) private candidateNameToId;
    mapping(address => mapping(uint256 => bool)) private hasVotedInPosition;

    address[] private voterAddresses;

    constructor() {
        owner = msg.sender;
        positionCount = 0;
        candidateCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function createPosition(string memory _name) public onlyOwner {
        positionCount++;
        positions[positionCount] = Position(positionCount, _name, true);
    }

    function registerVoter(string memory _name, address _voterAddress) public onlyOwner {
        require(!voters[_voterAddress].isRegistered, "Voter already registered");
        voters[_voterAddress] = Voter(_name, _voterAddress, true);
        voterAddresses.push(_voterAddress);
    }

    function updateVoter(address _voterAddress, string memory _newName) public onlyOwner {
        require(voters[_voterAddress].isRegistered, "Voter not found");
        voters[_voterAddress].name = _newName;
    }

    function deleteVoter(address _voterAddress) public onlyOwner {
        require(voters[_voterAddress].isRegistered, "Voter not found");
        delete voters[_voterAddress];
    }

    function addCandidate(string memory _name, uint256 _positionId) public onlyOwner {
        require(positions[_positionId].exists, "Position does not exist");
        require(candidateNameToId[_name] == 0, "Candidate already registered");

        candidateCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, _positionId, 0);
        candidateNameToId[_name] = candidateCount;
    }

    function updateCandidate(uint256 _candidateId, string memory _newName) public onlyOwner {
        require(candidates[_candidateId].id != 0, "Candidate not found");
        delete candidateNameToId[candidates[_candidateId].name];
        candidates[_candidateId].name = _newName;
        candidateNameToId[_newName] = _candidateId;
    }

    function deleteCandidate(uint256 _candidateId) public onlyOwner {
        require(candidates[_candidateId].id != 0, "Candidate not found");
        delete candidateNameToId[candidates[_candidateId].name];
        delete candidates[_candidateId];
    }

    function updatePosition(uint256 _positionId, string memory _newName) public onlyOwner {
        require(positions[_positionId].exists, "Position not found");
        positions[_positionId].name = _newName;
    }

    function deletePosition(uint256 _positionId) public onlyOwner {
        require(positions[_positionId].exists, "Position not found");
        delete positions[_positionId];
    }

    function voteByName(string memory _candidateName) public {
        require(voters[msg.sender].isRegistered, "Voter is not registered");

        uint256 candidateId = candidateNameToId[_candidateName];
        require(candidateId != 0, "Candidate does not exist");

        uint256 positionId = candidates[candidateId].positionId;
        require(!hasVotedInPosition[msg.sender][positionId], "Already voted in this position");

        hasVotedInPosition[msg.sender][positionId] = true;
        candidates[candidateId].voteCount++;
    }

    function getResults(uint256 _positionId) public view returns (Candidate[] memory) {
        require(positions[_positionId].exists, "Position does not exist");

        uint256 count = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].positionId == _positionId) {
                count++;
            }
        }

        Candidate[] memory result = new Candidate[](count);
        uint256 index = 0;
        for (uint256 i = 1; i <= candidateCount; i++) {
            if (candidates[i].positionId == _positionId) {
                result[index] = candidates[i];
                index++;
            }
        }
        return result;
    }

    function getAllVoters() public view onlyOwner returns (Voter[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            if (voters[voterAddresses[i]].isRegistered) {
                count++;
            }
        }

        Voter[] memory voterList = new Voter[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            if (voters[voterAddresses[i]].isRegistered) {
                voterList[index] = voters[voterAddresses[i]];
                index++;
            }
        }
        return voterList;
    }

    function getAllCandidatesWithPositionNames() public view returns (
        string[] memory candidateNames,
        string[] memory positionNames,
        uint256[] memory voteCounts
    ) {
        candidateNames = new string[](candidateCount);
        positionNames = new string[](candidateCount);
        voteCounts = new uint256[](candidateCount);

        for (uint256 i = 1; i <= candidateCount; i++) {
            candidateNames[i - 1] = candidates[i].name;
            positionNames[i - 1] = positions[candidates[i].positionId].name;
            voteCounts[i - 1] = candidates[i].voteCount;
        }
    }

    function getAllCandidates() private  view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }

    function getAllPositions() public view returns (Position[] memory) {
        Position[] memory positionList = new Position[](positionCount);
        for (uint256 i = 1; i <= positionCount; i++) {
            positionList[i - 1] = positions[i];
        }
        return positionList;
    }
}
