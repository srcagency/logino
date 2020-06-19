'use strict'

module.exports = (a = [], b) => {
	const data = typeof a === 'function' ? [] : Array.isArray(a) ? a : [a]
	let queue = []
	let out = (typeof a === 'function' ? a : b) || toQueue

	const log = create(data)
	log.out = fn => {
		if (fn === undefined) throw new Error('`out` function is `undefined`')

		if (fn === null) {
			out = toQueue
		} else {
			out = fn
			drainQueue()
		}
	}
	return log

	function toQueue(d) {
		queue.push(d)
	}

	function drainQueue() {
		for (const data of queue) out(data)
		queue = []
	}

	function create(pdata) {
		const log = data => out([...pdata, data])
		log.create = data => create([...pdata, data], out)
		return log
	}
}
