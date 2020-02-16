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

test('Queue namespaced data until `out` is set', t => {
	t.test(tt => {
		const log = logger('myservice')

		log('level 1 A')

		const sublog = log.create('downstream')

		sublog('level 2 A')
		sublog('level 2 B')
		sublog.create('origin')('level 3 A')

		const buf = []
		log.out(e => buf.push(e))

		log('level 1 B')
		sublog('level 2 C')

		tt.deepEqual(buf, [
			['myservice', 'level 1 A'],
			['myservice', 'downstream', 'level 2 A'],
			['myservice', 'downstream', 'level 2 B'],
			['myservice', 'downstream', 'origin', 'level 3 A'],
			['myservice', 'level 1 B'],
			['myservice', 'downstream', 'level 2 C'],
		])
		tt.end()
	})

	t.test('Data is optional when creating', tt => {
		const log = logger()

		log('level 1 A')

		const sublog = log.create()

		sublog('level 2 A')
		sublog('level 2 B')

		const buf = []
		log.out(e => buf.push(e))

		log('level 1 B')
		sublog('level 2 C')

		tt.deepEqual(buf, [
			['level 1 A'],
			['level 2 A'],
			['level 2 B'],
			['level 1 B'],
			['level 2 C'],
		])
		tt.end()
	})
})
