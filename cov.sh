#!/bin/sh -l

PATH=$PATH


# Find the test binary for SPM projects.
BIN_PATH="$(swift build --show-bin-path)"
XCTEST_PATH="$(find ${BIN_PATH} -name '*.xctest')"
COV_BIN=$XCTEST_PATH

if [[ "$OSTYPE" == "darwin"* ]]; then
    f="$(basename $XCTEST_PATH .xctest)"
    COV_BIN="${COV_BIN}/Contents/MacOS/$f"
    PATH="/usr/local/opt/llvm/bin:$PATH"​
fi

INSTR_PROFILE=.build/debug/codecov/default.profdata
IGNORE_FILENAME_REGEX=".build|Tests"

FORMAT="lcov"
OUTPUT_FILE=.build/debug/codecov/lcov.info

while :; do
    case $1 in
        -f|--format) FORMAT=$2
        shift
        ;;
        -o|--output) OUTPUT_FILE=$2
        shift
        ;;
        -i|--instr-profile) INSTR_PROFILE=$2
        shift
        ;;
    esac
    shift
done


mkdir -p "$(dirname "$OUTPUT_FILE")"

xcrun llvm-cov report \
    "${COV_BIN}" \
    -instr-profile=$INSTR_PROFILE \
    -ignore-filename-regex=$IGNORE_FILENAME_REGEX \
    -use-color

xcrun llvm-cov export \
    "${COV_BIN}" \
    -instr-profile=$INSTR_PROFILE \
    -ignore-filename-regex=$IGNORE_FILENAME_REGEX \
    -format=$FORMAT > $OUTPUT_FILE
