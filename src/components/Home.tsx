import React from 'react';

interface HomeProps {
  onCreate: () => void;
  onJoin: () => void;
}

const Home: React.FC<HomeProps> = ({ onCreate, onJoin }) => {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Application d'Appel Audio/Vidéo</h1>
      <button onClick={onCreate} style={{ margin: '10px', padding: '10px 20px' }}>
        Créer une Réunion
      </button>
      <button onClick={onJoin} style={{ margin: '10px', padding: '10px 20px' }}>
        Rejoindre une Réunion
      </button>
    </div>
  );
};

export default Home;