import { useState } from 'react';
import Home from './components/Home';
import CreateMeeting from './components/CreateMeeting';
import JoinMeeting from './components/JoinMeeting';
import VideoCall from './components/VideoCall';
import './App.css';

function App() {
  const [view, setView] = useState<'home' | 'create' | 'join' | 'call'>('home');
  const [roomId, setRoomId] = useState('');
  const [code, setCode] = useState('');

  const handleCreate = () => setView('create');
  const handleJoin = () => setView('join');
  const handleStartCall = (id: string, c: string) => {
    setRoomId(id);
    setCode(c);
    setView('call');
  };
  const handleJoinCall = (id: string, c: string) => {
    setRoomId(id);
    setCode(c);
    setView('call');
  };

  return (
    <div className="App">
      {view === 'home' && <Home onCreate={handleCreate} onJoin={handleJoin} />}
      {view === 'create' && <CreateMeeting onStart={handleStartCall} />}
      {view === 'join' && <JoinMeeting onJoin={handleJoinCall} />}
      {view === 'call' && <VideoCall roomId={roomId} code={code} />}
    </div>
  );
}

export default App;
