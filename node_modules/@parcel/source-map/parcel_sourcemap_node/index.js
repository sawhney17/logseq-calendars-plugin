let parts = [process.platform, process.arch];
// Only GNU system has this field
const { glibcVersionRuntime } = process.report.getReport().header;
if (process.platform === 'linux') {
  if (process.arch === 'arm') {
    parts.push('gnueabihf');
  } else if (!glibcVersionRuntime) {
    parts.push('musl');
  } else {
    parts.push('gnu');
  }
} else if (process.platform === 'win32') {
  parts.push('msvc');
}

module.exports = require(`./artifacts/index.${parts.join('-')}.node`);
