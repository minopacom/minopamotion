const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

export const logger = {
  info(message: string) {
    console.log(`${CYAN}ℹ${RESET} ${message}`);
  },

  success(message: string) {
    console.log(`${GREEN}✓${RESET} ${message}`);
  },

  warn(message: string) {
    console.warn(`${YELLOW}⚠${RESET} ${message}`);
  },

  error(message: string) {
    console.error(`${RED}✖${RESET} ${message}`);
  },

  log(message: string) {
    console.log(message);
  },

  banner() {
    console.log(`\n${BOLD}${CYAN}minopamotion${RESET} v0.1.0\n`);
  },
};
