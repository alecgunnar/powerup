const arr = [1, 2, [3, 4, [5, 6], 7, [8, 9], 10, 11], [12, [13], [14, [15]], 16], 17, [18, 19], 20, [21, [22, [23, [24, 25, [26, 27, 28, 29, 30]]]]]]

const flatten = (list) => {
    let flattened = []

    list.forEach((item) => {
        let concat = typeof item === "object" ? flatten(item) : item
        flattened = flattened.concat(concat)
    })

    return flattened
}

const flattenWithReduce = (list) => {
    return list.reduce((acc, item) => {
        if (typeof item === "object") 
            return acc.concat(flatten(item))
        
        acc.push(item)

        return acc
    }, [])
}

console.log(flatten(arr))
