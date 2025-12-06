import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface CreateMeetingProps {
  onStart: (roomId: string, code: string) => void;
}

const CreateMeeting: React.FC<CreateMeetingProps> = ({ onStart }) => {
  const [roomId] = useState(uuidv4());
  const [code] = useState(uuidv4().slice(0, 6)); // short code

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h2>Créer une Réunion</h2>
      <p>ID de la Réunion: {roomId}</p>
      <p>Code Secret: {code}</p>
      <p>Partagez ces informations avec les invités.</p>
      <button onClick={() => onStart(roomId, code)} style={{ padding: '10px 20px' }}>
        Commencer l'Appel
      </button>
    </div>
  );
};

export default CreateMeeting;