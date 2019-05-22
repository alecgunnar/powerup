const data = require('./data')
const windowSize = 16

const printData = (type, data) => console.log(type, data.length, data)

const compress = (data) => {
    let compressed = ''
    let window = ''

    const findLongestPrefix = () => {
        let prefix = ''

        for (let i = 1; i < windowSize && i < data.length; i++) {
            const prefix = data.slice(0, i)
            let start = 0

            if (window.indexOf(prefix) === -1) {
                const previousPrefix = prefix.slice(0, -1)
                const start = window.indexOf(previousPrefix)

                return {
                    start,
                    chars: prefix
                }
            }
        }

        return null
    }

    const writeCompressed = (from, length, next) => compressed += `${from},${length},${next}\n`
    const slideWindow = (chars) => window = (window + chars).slice(-1 * windowSize)

    let match = ''
    let matchedFrom = 0

    while (data !== '') {
        let chars, start, length, next
        const prefix = findLongestPrefix()

        if (prefix !== null) {
            chars = prefix.chars.slice(0, -1)
            start = prefix.start
            next = prefix.chars.slice(-1)
        } else {
            chars = ''
            start = 0
            next = data[0]
        }

        writeCompressed(start, chars.length, next)
        slideWindow(chars + next)
        data = data.slice(chars.length + 1)
    }

    // for (let i = 1; i < data.length; i++) {
    //     const startOfMatch = searchWindow(match + data[i])

    //     if (startOfMatch >= 0) {
    //         match += data[i]
    //         matchedFrom = startOfMatch
    //     } else {
    //         writeCompressed(matchedFrom, match.length, data[i])

    //         slideWindow(match + data[i])
    //         match = ''
    //         matchedFrom = 0
    //     }
    // }

    return compressed
}

const decompress = (compressed) => {
    let decompressed = ''
    const compressedParts = compressed.split('\n')

    const expandPart = (part) => part.split(',')
    const grabFromWindow = (start, length) => {
        const window = decompressed.slice(-16)
        const grabbed = window.slice(start, start + length)

        return grabbed
    }

    for (let i = 0; i < compressedParts.length; i++) {
        const part = compressedParts[i]

        if (part === '') continue

        const [start, length, next] = expandPart(part)

        decompressed += grabFromWindow(start, length) + next
    }

    return decompressed
}

const input = data.abba(256)
printData('INPUT', input)

const compressed = compress(input)
printData('COMPRESSED', compressed)

const decompressed = decompress(compressed)
printData('DECOMPRESSED', decompressed)

const weWon = decompressed === input

console.log('DID WE WIN?', weWon)

if (!weWon) {
    console.log(input)
    console.log(decompressed)

    let substr = ''

    while(decompressed.indexOf(substr) === 0)
        substr = input.slice(0, substr.length + 1)

    console.log('^'.padStart(substr.length, '-'), substr.length)
}
