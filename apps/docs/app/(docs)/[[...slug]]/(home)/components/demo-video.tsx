'use client';

import ReactPlayer from 'react-player';

type DemoVideoProps = {
  url: string;
};

export const DemoVideo = ({ url }: DemoVideoProps) => (
  <div className="pointer-events-none relative aspect-video w-full select-none overflow-hidden sm:ring-1 sm:ring-border">
    <ReactPlayer
      config={{
        youtube: {
          playerVars: {
            rel: 0,
            showinfo: 0,
            controls: 0,
          },
        },
      }}
      height="100%"
      loop
      muted
      playing
      playsinline
      style={{
        position: 'absolute',
        inset: 0,
      }}
      url={url}
      width="100%"
    />
  </div>
);
