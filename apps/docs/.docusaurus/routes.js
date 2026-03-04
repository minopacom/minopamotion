import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/minopamotion/docs',
    component: ComponentCreator('/minopamotion/docs', '008'),
    routes: [
      {
        path: '/minopamotion/docs',
        component: ComponentCreator('/minopamotion/docs', '1bc'),
        routes: [
          {
            path: '/minopamotion/docs',
            component: ComponentCreator('/minopamotion/docs', 'edd'),
            routes: [
              {
                path: '/minopamotion/docs/api/cli/dev',
                component: ComponentCreator('/minopamotion/docs/api/cli/dev', 'fd2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/cli/render',
                component: ComponentCreator('/minopamotion/docs/api/cli/render', '93a'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/absolute-fill',
                component: ComponentCreator('/minopamotion/docs/api/core/absolute-fill', '3f3'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/audio',
                component: ComponentCreator('/minopamotion/docs/api/core/audio', 'fea'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/composition',
                component: ComponentCreator('/minopamotion/docs/api/core/composition', '9b8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/delay-render',
                component: ComponentCreator('/minopamotion/docs/api/core/delay-render', 'eb6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/easing',
                component: ComponentCreator('/minopamotion/docs/api/core/easing', '363'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/freeze',
                component: ComponentCreator('/minopamotion/docs/api/core/freeze', '2fb'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/img',
                component: ComponentCreator('/minopamotion/docs/api/core/img', '67b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/interpolate',
                component: ComponentCreator('/minopamotion/docs/api/core/interpolate', 'd01'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/interpolate-colors',
                component: ComponentCreator('/minopamotion/docs/api/core/interpolate-colors', '3e0'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/loop',
                component: ComponentCreator('/minopamotion/docs/api/core/loop', '631'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/measure-spring',
                component: ComponentCreator('/minopamotion/docs/api/core/measure-spring', 'bd9'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/random',
                component: ComponentCreator('/minopamotion/docs/api/core/random', '2da'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/sequence',
                component: ComponentCreator('/minopamotion/docs/api/core/sequence', '695'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/series',
                component: ComponentCreator('/minopamotion/docs/api/core/series', 'f0b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/spring',
                component: ComponentCreator('/minopamotion/docs/api/core/spring', '0d2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/static-file',
                component: ComponentCreator('/minopamotion/docs/api/core/static-file', '716'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/still',
                component: ComponentCreator('/minopamotion/docs/api/core/still', '9c5'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/use-current-frame',
                component: ComponentCreator('/minopamotion/docs/api/core/use-current-frame', '594'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/use-delay-render',
                component: ComponentCreator('/minopamotion/docs/api/core/use-delay-render', '3a6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/use-video-config',
                component: ComponentCreator('/minopamotion/docs/api/core/use-video-config', 'efa'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/core/video',
                component: ComponentCreator('/minopamotion/docs/api/core/video', 'a2b'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/player/',
                component: ComponentCreator('/minopamotion/docs/api/player/', '399'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/player/player-ref',
                component: ComponentCreator('/minopamotion/docs/api/player/player-ref', 'd67'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/player/thumbnail',
                component: ComponentCreator('/minopamotion/docs/api/player/thumbnail', 'ecc'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/renderer/bundle',
                component: ComponentCreator('/minopamotion/docs/api/renderer/bundle', '3a6'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/renderer/render-frames',
                component: ComponentCreator('/minopamotion/docs/api/renderer/render-frames', '15e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/renderer/render-media',
                component: ComponentCreator('/minopamotion/docs/api/renderer/render-media', '488'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/renderer/serve',
                component: ComponentCreator('/minopamotion/docs/api/renderer/serve', '115'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/renderer/stitch-frames-to-video',
                component: ComponentCreator('/minopamotion/docs/api/renderer/stitch-frames-to-video', '17e'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/api/webcodecs/render-media-in-browser',
                component: ComponentCreator('/minopamotion/docs/api/webcodecs/render-media-in-browser', 'b53'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/concepts/animation',
                component: ComponentCreator('/minopamotion/docs/concepts/animation', '656'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/concepts/compositions',
                component: ComponentCreator('/minopamotion/docs/concepts/compositions', '499'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/concepts/media',
                component: ComponentCreator('/minopamotion/docs/concepts/media', '6fe'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/concepts/sequences',
                component: ComponentCreator('/minopamotion/docs/concepts/sequences', 'd38'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/concepts/the-fundamentals',
                component: ComponentCreator('/minopamotion/docs/concepts/the-fundamentals', '3d8'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/getting-started/installation',
                component: ComponentCreator('/minopamotion/docs/getting-started/installation', '21c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/getting-started/project-structure',
                component: ComponentCreator('/minopamotion/docs/getting-started/project-structure', 'cc7'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/getting-started/your-first-video',
                component: ComponentCreator('/minopamotion/docs/getting-started/your-first-video', '8ee'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/intro',
                component: ComponentCreator('/minopamotion/docs/intro', '9a2'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/player/overview',
                component: ComponentCreator('/minopamotion/docs/player/overview', '051'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/player/player-component',
                component: ComponentCreator('/minopamotion/docs/player/player-component', '30d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/player/player-ref',
                component: ComponentCreator('/minopamotion/docs/player/player-ref', '268'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/player/thumbnail',
                component: ComponentCreator('/minopamotion/docs/player/thumbnail', 'a37'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/rendering/cli',
                component: ComponentCreator('/minopamotion/docs/rendering/cli', '89c'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/rendering/client-side',
                component: ComponentCreator('/minopamotion/docs/rendering/client-side', 'e89'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/rendering/overview',
                component: ComponentCreator('/minopamotion/docs/rendering/overview', '13d'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/rendering/server-side',
                component: ComponentCreator('/minopamotion/docs/rendering/server-side', 'f29'),
                exact: true,
                sidebar: "docsSidebar"
              },
              {
                path: '/minopamotion/docs/studio/overview',
                component: ComponentCreator('/minopamotion/docs/studio/overview', 'ef5'),
                exact: true,
                sidebar: "docsSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/minopamotion/',
    component: ComponentCreator('/minopamotion/', '056'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
