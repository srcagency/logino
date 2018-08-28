'use strict'

const test = require('tape')
const logger = require('./')

test(t => {
	const buf = []
	const log = logger('myservice', e => buf.push(e))

	log('level 1')

	const sublog = log.create('downstream')

	sublog('level 2 A')
	sublog('level 2 B')

	t.deepEqual(buf, [
		['myservice', 'level 1'],
		['myservice', 'downstream', 'level 2 A'],
		['myservice', 'downstream', 'level 2 B'],
	])
	t.end()
})

test('Data is optional when creating', t => {
	const buf = []
	const log = logger(e => buf.push(e))

	log('level 1')

	const sublog = log.create()

	sublog('level 2 A')
	sublog('level 2 B')

	t.deepEqual(buf, [
		['level 1'],
		['level 2 A'],
		['level 2 B'],
	])
	t.end()
})
