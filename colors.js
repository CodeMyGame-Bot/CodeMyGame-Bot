const ESC = '\x1b';
const RESET_STR = `${ESC}[0m`;
const COLORS = {
    'RED': 31,
    'GREEN': 32,
    'YELLOW': 33,
    'BLUE': 34,
    'MAGENTA': 35,
    'CYAN': 36,
    'WHITE': 37,
    'GRAY': 90,
    'BRIGHT_RED': 91,
    'BRIGHT_GREEN': 92,
    'BRIGHT_YELLOW': 93,
    'BRIGHT_BLUE': 94,
    'BRIGHT_MAGENTA': 95,
    'BRIGHT_CYAN': 96,
    'BRIGHT_WHITE': 97
};

const reset = (string) => `${string}${RESET_STR}`;
const code = (ansi_code) => `${ESC}[${ansi_code}m`;
const rgb_code = (rgb_code) => `${ESC}[38;${rgb_code}m`;
const rgb_back_code = (rgb_code) => `${ESC}[48;${rgb_code}m`;

module.exports = {
    nrgb: (text, n) => this.rgb_code(`5; ${n}`) + text + this.reset(),
    nrgb_back: (text, n) => this.rgb_back_code(`5; ${n}`) + text + this.reset(),
    rgb: (text, r, g, b) => this.rgb_code(`2;${r};${g};${b}`) + text + this.reset(),
    rgb_back: (text, r, g, b) => this.rgb_back_code(`2;${r};${g};${b}`) + text + this.reset(),
    effect: (text, color) => reset(code(COLORS[color]) + text)
}