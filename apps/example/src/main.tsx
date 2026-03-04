import React, { useRef, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Player, type PlayerRef } from '@minopamotion/player';
import { Studio, type TrackDefinition } from '@minopamotion/studio';
import { MyComposition } from './MyComposition.js';

const compositions = [
  {
    id: 'my-composition',
    component: MyComposition,
    durationInFrames: 90,
    fps: 30,
    width: 960,
    height: 540,
    defaultProps: {},
  },
];

const tracks: TrackDefinition[] = [
  { id: 'intro', label: 'Intro', from: 0, durationInFrames: 30 },
  { id: 'main', label: 'Main', from: 15, durationInFrames: 45 },
  { id: 'outro', label: 'Outro', from: 60, durationInFrames: 30 },
];

function PlayerDemo() {
  const player1Ref = useRef<PlayerRef>(null);
  const player2Ref = useRef<PlayerRef>(null);

  return (
    <div>
      <h1>Minopamotion Example</h1>
      <p style={{ marginBottom: 20, color: 'rgba(255,255,255,0.7)' }}>
        Two independent Player instances demonstrating isolated playback
      </p>
      <div className="players">
        <div>
          <h3 style={{ marginBottom: 8 }}>Player 1</h3>
          <Player
            ref={player1Ref}
            component={MyComposition}
            durationInFrames={90}
            compositionWidth={960}
            compositionHeight={540}
            fps={30}
            loop
            controls
            style={{ width: 480, height: 270 }}
          />
        </div>
        <div>
          <h3 style={{ marginBottom: 8 }}>Player 2 (autoPlay, 2x speed)</h3>
          <Player
            ref={player2Ref}
            component={MyComposition}
            durationInFrames={90}
            compositionWidth={960}
            compositionHeight={540}
            fps={30}
            loop
            autoPlay
            controls
            playbackRate={2}
            style={{ width: 480, height: 270 }}
          />
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#studio') {
    return <Studio compositions={compositions} tracks={tracks} />;
  }

  return (
    <div>
      <nav style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <a href="#player" style={{ color: '#667eea' }}>Player Demo</a>
        <a href="#studio" style={{ color: '#667eea' }}>Studio</a>
      </nav>
      <PlayerDemo />
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
