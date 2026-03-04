import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/your-first-video',
        'getting-started/project-structure',
      ],
    },
    {
      type: 'category',
      label: 'Concepts',
      items: [
        'concepts/the-fundamentals',
        'concepts/compositions',
        'concepts/sequences',
        'concepts/animation',
        'concepts/media',
      ],
    },
    {
      type: 'category',
      label: 'Player',
      items: [
        'player/overview',
        'player/player-component',
        'player/player-ref',
        'player/thumbnail',
      ],
    },
    {
      type: 'category',
      label: 'Rendering',
      items: [
        'rendering/overview',
        'rendering/server-side',
        'rendering/client-side',
        'rendering/cli',
      ],
    },
    {
      type: 'category',
      label: 'Studio',
      items: ['studio/overview'],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'category',
          label: 'Core',
          items: [
            'api/core/composition',
            'api/core/sequence',
            'api/core/absolute-fill',
            'api/core/still',
            'api/core/freeze',
            'api/core/loop',
            'api/core/series',
            'api/core/img',
            'api/core/audio',
            'api/core/video',
            'api/core/use-current-frame',
            'api/core/use-video-config',
            'api/core/use-delay-render',
            'api/core/interpolate',
            'api/core/interpolate-colors',
            'api/core/spring',
            'api/core/measure-spring',
            'api/core/easing',
            'api/core/delay-render',
            'api/core/random',
            'api/core/static-file',
          ],
        },
        {
          type: 'category',
          label: 'Player',
          items: [
            'api/player/player',
            'api/player/player-ref',
            'api/player/thumbnail',
          ],
        },
        {
          type: 'category',
          label: 'Renderer',
          items: [
            'api/renderer/render-media',
            'api/renderer/render-frames',
            'api/renderer/stitch-frames-to-video',
            'api/renderer/bundle',
            'api/renderer/serve',
          ],
        },
        {
          type: 'category',
          label: 'WebCodecs',
          items: ['api/webcodecs/render-media-in-browser'],
        },
        {
          type: 'category',
          label: 'CLI',
          items: ['api/cli/render', 'api/cli/dev'],
        },
      ],
    },
  ],
};

export default sidebars;
