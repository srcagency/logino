'use strict'

module.exports = (a = [], b) => {
	const data = typeof a === 'function' ? [] : (Array.isArray(a) ? a : [a])
	let queue = []
	let out = (typeof a === 'function' ? a : b) || (d => queue.push(d))

	const log = create(data)
	log.out = fn => {
		out = fn
		for (const data of queue) out(data)
		queue = undefined
	}
	return log

	function create(pdata) {
		const log = data => out([...pdata, data])
		log.create = data => create([...pdata, data], out)
		return log
	}
}
