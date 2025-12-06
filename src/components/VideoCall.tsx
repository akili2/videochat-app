import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

interface VideoCallProps {
  roomId: string;
  code: string;
}

const VideoCall: React.FC<VideoCallProps> = ({ roomId, code }) => {
  const [peers, setPeers] = useState<{ [key: string]: Peer.Instance }>({});
  const [streams, setStreams] = useState<{ [key: string]: MediaStream }>({});
  const [myStream, setMyStream] = useState<MediaStream | null>(null);
  const myVideo = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');
    socketRef.current = socket;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setMyStream(stream);
      if (myVideo.current) myVideo.current.srcObject = stream;
    });

    socket.emit('join-room', roomId, code);

    socket.on('invalid-code', () => {
      alert('Code invalide');
    });

    socket.on('user-connected', (userId: string) => {
      const peer = new Peer({ initiator: true, trickle: false, stream: myStream! });
      peer.on('signal', (data) => {
        socket.emit('offer', data, userId);
      });
      peer.on('stream', (stream) => {
        setStreams((prev) => ({ ...prev, [userId]: stream }));
      });
      setPeers((prev) => ({ ...prev, [userId]: peer }));
    });

    socket.on('user-disconnected', (userId: string) => {
      if (peers[userId]) peers[userId].destroy();
      setPeers((prev) => {
        const newPeers = { ...prev };
        delete newPeers[userId];
        return newPeers;
      });
      setStreams((prev) => {
        const newStreams = { ...prev };
        delete newStreams[userId];
        return newStreams;
      });
    });

    socket.on('offer', (offer: any, from: string) => {
      const peer = new Peer({ initiator: false, trickle: false, stream: myStream! });
      peer.on('signal', (data) => {
        socket.emit('answer', data, from);
      });
      peer.on('stream', (stream) => {
        setStreams((prev) => ({ ...prev, [from]: stream }));
      });
      peer.signal(offer);
      setPeers((prev) => ({ ...prev, [from]: peer }));
    });

    socket.on('answer', (answer: any, from: string) => {
      if (peers[from]) peers[from].signal(answer);
    });

    socket.on('ice-candidate', (candidate: any, from: string) => {
      if (peers[from]) peers[from].signal(candidate);
    });

    return () => {
      socket.disconnect();
      Object.values(peers).forEach((peer) => peer.destroy());
      if (myStream) myStream.getTracks().forEach((track) => track.stop());
    };
  }, [roomId, code]);

  return (
    <div>
      <h2>Appel en cours - Salle: {roomId}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div>
          <h3>Vous</h3>
          <video ref={myVideo} autoPlay muted style={{ width: '300px' }} />
        </div>
        {Object.entries(streams).map(([id, stream]) => (
          <div key={id}>
            <h3>Participant {id}</h3>
            <video autoPlay style={{ width: '300px' }} ref={(el) => { if (el) el.srcObject = stream; }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCall;