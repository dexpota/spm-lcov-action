const core = require('@actions/core')
const exec = require('@actions/exec')

async function main() {
    const format = core.getInput('file-format')
    const output = core.getInput('output-file')
    const instr_profile = core.getInput('instr-profile')
    const test_binary = core.getInput('test-binary')
    const is_spm = core.getBooleanInput('is-spm') ? "--spm" : ""
    await exec.exec(`${__dirname}/cov.sh -f ${format} -o ${output} -i ${instr_profile} -b ${test_binary} ${is_spm}`)
}

main().catch(err => core.setFailed(err.message))
