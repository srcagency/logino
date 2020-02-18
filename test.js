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

test('Queue namespaced data until `out` is set', t => {
	const log = logger('myservice')

	log('level 1 A')

	const sublog = log.create('downstream')

	sublog('level 2 A')
	sublog('level 2 B')

	const buf = []
	log.out(e => buf.push(e))

	log('level 1 B')
	sublog('level 2 C')
	sublog.create('origin')('level 3 A')

	t.deepEqual(buf, [
		['myservice', 'level 1 A'],
		['myservice', 'downstream', 'level 2 A'],
		['myservice', 'downstream', 'level 2 B'],
		['myservice', 'level 1 B'],
		['myservice', 'downstream', 'level 2 C'],
		['myservice', 'downstream', 'origin', 'level 3 A'],
	])
	t.end()
})
