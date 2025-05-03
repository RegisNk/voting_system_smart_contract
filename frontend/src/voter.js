import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VotingSystemABI from './VotingSystemABI.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const [positions, setPositions] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);

  const [menu, setMenu] = useState('positions');
  const [message, setMessage] = useState({ type: '', text: '' });

  const [positionName, setPositionName] = useState('');
  const [editPositionId, setEditPositionId] = useState(null);
  const [newPositionName, setNewPositionName] = useState('');

  const [candidateName, setCandidateName] = useState('');
  const [selectedPositionId, setSelectedPositionId] = useState('');
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [newCandidateName, setNewCandidateName] = useState('');

  const [voterName, setVoterName] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [editVoterAddress, setEditVoterAddress] = useState(null);
  const [newVoterName, setNewVoterName] = useState('');

  const [voteCandidateName, setVoteCandidateName] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert('MetaMask is required');
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, VotingSystemABI, signer);
      const address = await signer.getAddress();

      setProvider(browserProvider);
      setSigner(signer);
      setContract(contract);
      setAccount(address);

      loadData(contract);
    };
    init();
  }, []);

  const loadData = async (contractInstance = contract) => {
    if (!contractInstance) return;
    try {
      const positions = await contractInstance.getAllPositions();
      setPositions(positions);

      const [names, posNames, voteCounts] = await contractInstance.getAllCandidatesWithPositionNames();
      const candList = names.map((name, i) => ({
        name,
        position: posNames[i],
        votes: voteCounts[i].toString(),
        id: i + 1
      }));
      setCandidates(candList);

      const voters = await contractInstance.getAllVoters();
      setVoters(voters);
    } catch (err) {
      showMessage('danger', 'Failed to load data.');
      console.error(err);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleCreatePosition = async () => {
    try {
      await contract.createPosition(positionName);
      setPositionName('');
      showMessage('success', 'Position created successfully.');
      loadData();
    } catch (err) {
      showMessage('danger', 'Error creating position. Only admin can perform this action.');
    }
  };

  const handleUpdatePosition = async (id) => {
    try {
      await contract.updatePosition(id, newPositionName);
      setEditPositionId(null);
      setNewPositionName('');
      showMessage('success', 'Position updated.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to update position. Only admin can perform this action.');
    }
  };

  const handleDeletePosition = async (id) => {
    try {
      await contract.deletePosition(id);
      showMessage('success', 'Position deleted.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to delete position. Only admin can perform this action.');
    }
  };

  const handleAddCandidate = async () => {
    try {
      await contract.addCandidate(candidateName, selectedPositionId);
      setCandidateName('');
      setSelectedPositionId('');
      showMessage('success', 'Candidate added.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to add candidate. Only admin can perform this action.');
    }
  };

  const handleUpdateCandidate = async (id) => {
    try {
      await contract.updateCandidate(id, newCandidateName);
      setEditCandidateId(null);
      setNewCandidateName('');
      showMessage('success', 'Candidate updated.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to update candidate. Only admin can perform this action.');
    }
  };

  const handleDeleteCandidate = async (id) => {
    try {
      await contract.deleteCandidate(id);
      showMessage('success', 'Candidate deleted.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to delete candidate. Only admin can perform this action.');
    }
  };

  const handleRegisterVoter = async () => {
    try {
      await contract.registerVoter(voterName, voterAddress);
      setVoterName('');
      setVoterAddress('');
      showMessage('success', 'Voter registered.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to register voter. Only admin can perform this action.');
    }
  };

  const handleUpdateVoter = async (address) => {
    try {
      await contract.updateVoter(address, newVoterName);
      setEditVoterAddress(null);
      setNewVoterName('');
      showMessage('success', 'Voter updated.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to update voter. Only admin can perform this action.');
    }
  };

  const handleDeleteVoter = async (address) => {
    try {
      await contract.deleteVoter(address);
      showMessage('success', 'Voter deleted.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to delete voter.');
    }
  };

  const handleVote = async () => {
    try {
      await contract.voteByName(voteCandidateName);
      setVoteCandidateName('');
      showMessage('success', 'Vote cast successfully.');
      loadData();
    } catch {
      showMessage('danger', 'Failed to cast vote.');
    }
  };

  const renderCard = (title, content) => (
    <div className="card mb-3">
      <div className="card-header text-white bg-primary">{title}</div>
      <div className="card-body">{content}</div>
    </div>
  );

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Welcome to Smart Voting DApp</h3>
      <p className="text-center text-muted">Connected Account: {account}</p>

      {message.text && (
        <div className={`alert alert-${message.type} text-center`} role="alert">
          {message.text}
        </div>
      )}

      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${menu === 'positions' ? 'active' : ''}`} onClick={() => setMenu('positions')}>
            <i className="bi bi-briefcase me-1"></i>Positions
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${menu === 'candidates' ? 'active' : ''}`} onClick={() => setMenu('candidates')}>
            <i className="bi bi-person-badge me-1"></i>Candidates
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${menu === 'voters' ? 'active' : ''}`} onClick={() => setMenu('voters')}>
            <i className="bi bi-people me-1"></i>Voters
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${menu === 'voting' ? 'active' : ''}`} onClick={() => setMenu('voting')}>
            <i className="bi bi-check2-square me-1"></i>Voting
          </button>
        </li>
      </ul>

      {/* Positions Tab */}
      {menu === 'positions' &&
        renderCard('Manage Positions', (
          <>
            <div className="input-group input-group-sm mb-2">
              <input value={positionName} onChange={(e) => setPositionName(e.target.value)} className="form-control" placeholder="New Position" />
              <button className="btn btn-success" onClick={handleCreatePosition}>Create</button>
            </div>
            {positions.map((pos, i) => (
              <div key={i} className="d-flex justify-content-between align-items-center mb-1">
                {editPositionId === pos.id ? (
                  <>
                    <input className="form-control form-control-sm me-2" value={newPositionName} onChange={(e) => setNewPositionName(e.target.value)} />
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleUpdatePosition(pos.id)}>✔</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditPositionId(null)}>✖</button>
                  </>
                ) : (
                  <>
                    <span>{pos.name}</span>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-1" onClick={() => { setEditPositionId(pos.id); setNewPositionName(pos.name); }}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeletePosition(pos.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        ))
      }

      {/* Candidates Tab */}
      {menu === 'candidates' &&
        renderCard('Manage Candidates', (
          <>
            <div className="input-group input-group-sm mb-2">
              <input value={candidateName} onChange={(e) => setCandidateName(e.target.value)} className="form-control" placeholder="Candidate Name" />
              <select value={selectedPositionId} onChange={(e) => setSelectedPositionId(e.target.value)} className="form-select">
                <option value="">Select Position</option>
                {positions.map((pos) => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
              </select>
              <button className="btn btn-success" onClick={handleAddCandidate}>Add</button>
            </div>
            {candidates.map((cand) => (
              <div key={cand.id} className="d-flex justify-content-between align-items-center mb-1">
                {editCandidateId === cand.id ? (
                  <>
                    <input className="form-control form-control-sm me-2" value={newCandidateName} onChange={(e) => setNewCandidateName(e.target.value)} />
                    <button className="btn btn-primary btn-sm me-1" onClick={() => handleUpdateCandidate(cand.id)}>✔</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setEditCandidateId(null)}>✖</button>
                  </>
                ) : (
                  <>
                    <span>{cand.name} ({cand.position}) - {cand.votes} votes</span>
                    <div>
                      <button className="btn btn-outline-primary btn-sm me-1" onClick={() => { setEditCandidateId(cand.id); setNewCandidateName(cand.name); }}>Edit</button>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteCandidate(cand.id)}>Delete</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        ))
      }

      {/* Voters Tab */}
      {menu === 'voters' &&
        renderCard('Manage Voters', (
          <>
            <div className="input-group input-group-sm mb-2">
              <input value={voterName} onChange={(e) => setVoterName(e.target.value)} className="form-control" placeholder="Name" />
              <input value={voterAddress} onChange={(e) => setVoterAddress(e.target.value)} className="form-control" placeholder="Address" />
              <button className="btn btn-success" onClick={handleRegisterVoter}>Register</button>
            </div>
            <table className="table table-sm table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {voters.map((v, i) => (
                  <tr key={i}>
                    {editVoterAddress === v.voterAddress ? (
                      <>
                        <td colSpan="2">
                          <input className="form-control form-control-sm" value={newVoterName} onChange={(e) => setNewVoterName(e.target.value)} />
                        </td>
                        <td>
                          <button className="btn btn-primary btn-sm me-1" onClick={() => handleUpdateVoter(v.voterAddress)}>✔</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => setEditVoterAddress(null)}>✖</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{v.name}</td>
                        <td>{v.voterAddress}</td>
                        <td>
                          <button className="btn btn-outline-primary btn-sm me-1" onClick={() => { setEditVoterAddress(v.voterAddress); setNewVoterName(v.name); }}>Edit</button>
                          <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteVoter(v.voterAddress)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ))
      }

      {/* Voting Tab */}
      {menu === 'voting' &&
        renderCard('Vote Now', (
          <div className="input-group input-group-sm">
            <input value={voteCandidateName} onChange={(e) => setVoteCandidateName(e.target.value)} className="form-control" placeholder="Candidate Name" />
            <button className="btn btn-success" onClick={handleVote}>Vote</button>
          </div>
        ))
      }
    </div>
  );
}

export default App;
