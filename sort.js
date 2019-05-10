let startTime = null

const generateElapsedTime = () => {
    const diff = Date.now() - startTime
    const milliseconds = diff % 1000
    const seconds = Math.floor(diff / 1000) % 60
    const minutes = Math.floor(diff / 60000) % 60
    const hours = Math.floor(diff / 3600000)
    
    const padStart = (value, len = 2) => `${value}`.padStart(len, '0')

    return `${padStart(hours)}:${padStart(minutes)}:${padStart(seconds)}.${padStart(milliseconds, 3)}`
}

const printProgress = (progress) => {
    process.stdout.write(`\rElapsed time: ${generateElapsedTime()} (${Math.floor(100 * progress)}%)`)
}

const startTimer = (processName) => {
    startTime = Date.now()
    console.log(`Starting ${processName}`)
}

const stopTimer = () => {
    process.stdout.write(`\rFinished after ${generateElapsedTime()}\n`)
    startTime = null
}

const verifySorted = (list) => {
    for (let index = 1; index < list.length; index++)
        if (list[index - 1] > list[index])
            return console.log('POORLY SORTED', `${list[index - 1]} not less than ${list[index]}`)

    console.log('WELL SORTED')
}

const list = []

startTimer('Input Generation')

do {
    list.push(
        100 * Math.random()
    )
} while(list.length < 1000000)

stopTimer()

const bubble = (entries) => {
    const flip = (at) => {
        const hold = entries[at + 1]
        entries[at + 1] = entries[at]
        entries[at] = hold
    }

    const compare = (at) => entries[at] > entries[at + 1]

    let iterations = 0

    process.stdout.write('0%\r')

    const incrementProgress = () => {
        printProgress(iterations++ / entries.length)
        return iterations
    }

    while(incrementProgress() < entries.length)
        for (let pos = 0; pos < entries.length - iterations; pos++)
            if (compare(pos)) flip(pos)

    return entries
}

startTimer('Bubble Sort')
const bubbleSorted = bubble(list)
stopTimer()
verifySorted(bubbleSorted)

const merge = (entries) => {
    if (entries.length <= 1) return entries

    const half = Math.floor(entries.length / 2)
    const left = entries.slice(0, half)
    const right = entries.slice(half, entries.length)

    const sortedLeft = merge(left)
    const sortedRight = merge(right)
    const sorted = []

    const shiftFrom = () => sortedLeft[0] < sortedRight[0] ? sortedLeft : sortedRight

    while (sortedLeft.length > 0 && sortedRight.length > 0)
        sorted.push(shiftFrom().shift())

    return sorted.concat(sortedLeft, sortedRight)
}

startTimer('Merge Sort')
const mergeSorted = merge(list)
stopTimer()
verifySorted(mergeSorted)
