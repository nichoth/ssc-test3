module.exports = function parseConfig (conf) {
    return Object.fromEntries(conf
        .split('\n')
        .filter((line) => line.length && !/^#/.test(line))
        .map((line) => line.split(/:(.*)$/).map(s => s.trim()))
    )
}
