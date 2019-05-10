function* generate () { while(true) yield Math.random().toString(36).substr(2, 9); }

console.log(generate().next().value)

