import { Command } from 'commander';
import { registerRenderCommand } from './commands/render.js';
import { registerDevCommand } from './commands/dev.js';

const program = new Command();

program
  .name('minopamotion')
  .description('CLI for rendering minopamotion compositions')
  .version('0.1.0');

registerRenderCommand(program);
registerDevCommand(program);

program.parse();
