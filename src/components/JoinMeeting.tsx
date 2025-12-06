import React, { useState } from 'react';

interface JoinMeetingProps {
  onJoin: (roomId: string, code: string) => void;
}

const JoinMeeting: React.FC<JoinMeetingProps> = ({ onJoin }) => {
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onJoin(roomId, code);
  };

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Rejoindre une Réunion</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID de la Réunion"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          required
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <input
          type="text"
          placeholder="Code Secret"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          style={{ display: 'block', margin: '10px auto', padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>
          Rejoindre
        </button>
      </form>
    </div>
  );
};

export default JoinMeeting;