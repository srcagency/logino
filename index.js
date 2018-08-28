'use strict'

module.exports = init

function init(a, b){
	const data = typeof a === 'function' ? [] : (Array.isArray(a) ? a : [a])
	const out = typeof a === 'function' ? a : b
	return create(data, out)
}

function create(pdata, out){
	const log = data => out([...pdata, data])
	log.create = data => create(data === undefined ? pdata : [...pdata, data], out)
	return log
}
