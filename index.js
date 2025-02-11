const core = require('@actions/core')
const exec = require('@actions/exec')

class CommandBuilder {
    constructor(baseCommand) {
      this.baseCommand = baseCommand;
      this.args = [];
    }

    addFlag(flag, value) {
      if (value) {
        this.args.push(`${flag} ${value}`);
      }
      return this;
    }

    addBooleanFlag(flag, condition) {
      if (condition) {
        this.args.push(flag);
      }
      return this;
    }

    build() {
      return `${this.baseCommand} ${this.args.join(' ')}`.trim();
    }
}

async function main() {
    const format = core.getInput('file-format');
    const output = core.getInput('output-file');
    const instr_profile = core.getInput('instr-profile');
    const test_binary = core.getInput('test-binary');
    const is_spm = core.getBooleanInput('is-spm');

    const command = new CommandBuilder(`${__dirname}/cov.sh`)
        .addFlag('-f', format)
        .addFlag('-o', output)
        .addFlag('-i', instr_profile)
        .addFlag('-b', test_binary)
        .addBooleanFlag('--spm', is_spm)
        .build();

    await exec.exec(command);
}

main().catch(err => core.setFailed(err.message))
