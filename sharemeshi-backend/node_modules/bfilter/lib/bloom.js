/*!
 * bloom.js - bloom filter for bcoin
 * Copyright (c) 2014-2015, Fedor Indutny (MIT License)
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

const assert = require('assert');
const bio = require('bufio');
const murmur3 = require('mrmr');
const {encoding} = bio;

/*
 * Constants
 */

const DUMMY = Buffer.alloc(0);
const LN2SQUARED = 0.4804530139182014246671025263266649717305529515945455;
const LN2 = 0.6931471805599453094172321214581765680755001343602552;

/**
 * Bloom Filter
 */

class BloomFilter extends bio.Struct {
  /**
   * Create a bloom filter.
   * @constructor
   * @param {Number} size - Filter size in bits.
   * @param {Number} n - Number of hash functions.
   * @param {Number} tweak - Seed value.
   * @param {Number|String} - Update type.
   * @property {Buffer} filter
   * @property {Number} size
   * @property {Number} n
   * @property {Number} tweak
   * @property {Number} update - Update flag (see {@link BloomFilter.flags}).
   */

  constructor(size, n, tweak, update) {
    super();

    this.filter = DUMMY;
    this.size = 0;
    this.n = 0;
    this.tweak = 0;
    this.update = BloomFilter.flags.NONE;

    if (size != null)
      this.fromOptions(size, n, tweak, update);
  }

  /**
   * Inject properties from options.
   * @private
   * @param {Number} size - Filter size in bits.
   * @param {Number} n - Number of hash functions.
   * @param {Number} tweak - Seed value.
   * @param {Number|String} - Update type.
   * @returns {BloomFilter}
   */

  fromOptions(size, n, tweak, update) {
    assert(typeof size === 'number', '`size` must be a number.');
    assert(size > 0, '`size` must be greater than zero.');
    assert(Number.isSafeInteger(size), '`size` must be an integer.');

    size -= size % 8;

    const filter = Buffer.allocUnsafe(size / 8);
    filter.fill(0);

    if (tweak == null || tweak === -1)
      tweak = (Math.random() * 0x100000000) >>> 0;

    if (update == null || update === -1)
      update = BloomFilter.flags.NONE;

    if (typeof update === 'string') {
      update = BloomFilter.flags[update.toUpperCase()];
      assert(update != null, 'Unknown update flag.');
    }

    assert(size > 0, '`size` must be greater than zero.');
    assert(n > 0, '`n` must be greater than zero.');
    assert(Number.isSafeInteger(n), '`n` must be an integer.');
    assert(typeof tweak === 'number', '`tweak` must be a number.');
    assert(Number.isSafeInteger(tweak), '`tweak` must be an integer.');
    assert(BloomFilter.flagsByVal[update], 'Unknown update flag.');

    this.filter = filter;
    this.size = size;
    this.n = n;
    this.tweak = tweak;
    this.update = update;

    return this;
  }

  /**
   * Instantiate bloom filter from options.
   * @param {Number} size - Filter size in bits.
   * @param {Number} n - Number of hash functions.
   * @param {Number} tweak - Seed value.
   * @param {Number|String} - Update type.
   * @returns {BloomFilter}
   */

  static fromOptions(size, n, tweak, update) {
    return new this().fromOptions(size, n, tweak, update);
  }

  /**
   * Perform the mumur3 hash on data.
   * @param {Buffer} val
   * @param {Number} n
   * @returns {Number}
   */

  hash(val, n) {
    return murmur3.tweak(val, n, this.tweak) % this.size;
  }

  /**
   * Reset the filter.
   */

  reset() {
    this.filter.fill(0);
  }

  /**
   * Add data to the filter.
   * @param {Buffer|String}
   * @param {String?} enc - Can be any of the Buffer object's encodings.
   */

  add(val, enc) {
    val = toBuffer(val, enc);

    for (let i = 0; i < this.n; i++) {
      const index = this.hash(val, i);
      this.filter[index >>> 3] |= 1 << (7 & index);
    }
  }

  /**
   * Test whether data is present in the filter.
   * @param {Buffer|String} val
   * @param {String?} enc - Can be any of the Buffer object's encodings.
   * @returns {Boolean}
   */

  test(val, enc) {
    val = toBuffer(val, enc);

    for (let i = 0; i < this.n; i++) {
      const index = this.hash(val, i);
      if ((this.filter[index >>> 3] & (1 << (7 & index))) === 0)
        return false;
    }

    return true;
  }

  /**
   * Test whether data is present in the
   * filter and potentially add data.
   * @param {Buffer|String} val
   * @param {String?} enc - Can be any of the Buffer object's encodings.
   * @returns {Boolean} Whether data was added.
   */

  added(val, enc) {
    val = toBuffer(val, enc);

    let ret = false;

    for (let i = 0; i < this.n; i++) {
      const index = this.hash(val, i);
      if (!ret && (this.filter[index >>> 3] & (1 << (7 & index))) === 0)
        ret = true;
      this.filter[index >>> 3] |= 1 << (7 & index);
    }

    return ret;
  }

  /**
   * Create a filter from a false positive rate.
   * @param {Number} items - Expected number of items.
   * @param {Number} rate - False positive rate (0.0-1.0).
   * @param {Number|String} update
   * @example
   * BloomFilter.fromRate(800000, 0.0001, 'none');
   * @returns {Boolean}
   */

  static fromRate(items, rate, update) {
    assert(typeof items === 'number', '`items` must be a number.');
    assert(items > 0, '`items` must be greater than zero.');
    assert(Number.isSafeInteger(items), '`items` must be an integer.');
    assert(typeof rate === 'number', '`rate` must be a number.');
    assert(rate >= 0 && rate <= 1, '`rate` must be between 0.0 and 1.0.');

    const bits = (-1 / LN2SQUARED * items * Math.log(rate)) | 0;
    const size = Math.max(8, bits);

    if (update !== -1) {
      assert(size <= BloomFilter.MAX_BLOOM_FILTER_SIZE * 8,
        'Bloom filter size violates policy limits!');
    }

    const n = Math.max(1, (size / items * LN2) | 0);

    if (update !== -1) {
      assert(n <= BloomFilter.MAX_HASH_FUNCS,
        'Bloom filter size violates policy limits!');
    }

    return new this(size, n, -1, update);
  }

  /**
   * Ensure the filter is within the size limits.
   * @returns {Boolean}
   */

  isWithinConstraints() {
    if (this.size > BloomFilter.MAX_BLOOM_FILTER_SIZE * 8)
      return false;

    if (this.n > BloomFilter.MAX_HASH_FUNCS)
      return false;

    return true;
  }

  /**
   * Get serialization size.
   * @returns {Number}
   */

  getSize() {
    return encoding.sizeVarBytes(this.filter) + 9;
  }

  /**
   * Write filter to buffer writer.
   * @param {BufferWriter} bw
   */

  write(bw) {
    bw.writeVarBytes(this.filter);
    bw.writeU32(this.n);
    bw.writeU32(this.tweak);
    bw.writeU8(this.update);
    return bw;
  }

  /**
   * Inject properties from buffer reader.
   * @private
   * @param {BufferReader} br
   */

  read(br) {
    this.filter = br.readVarBytes();
    this.size = this.filter.length * 8;
    this.n = br.readU32();
    this.tweak = br.readU32();
    this.update = br.readU8();
    assert(BloomFilter.flagsByVal[this.update] != null, 'Unknown update flag.');
    return this;
  }
}

/**
 * Max bloom filter size.
 * @const {Number}
 * @default
 */

BloomFilter.MAX_BLOOM_FILTER_SIZE = 36000;

/**
 * Max number of hash functions.
 * @const {Number}
 * @default
 */

BloomFilter.MAX_HASH_FUNCS = 50;

/**
 * Bloom filter update flags.
 * @enum {Number}
 * @default
 */

BloomFilter.flags = {
  /**
   * Never update the filter with outpoints.
   */

  NONE: 0,

  /**
   * Always update the filter with outpoints.
   */

  ALL: 1,

  /**
   * Only update the filter with outpoints if it is
   * "asymmetric" in terms of addresses (pubkey/multisig).
   */

  PUBKEY_ONLY: 2
};

/**
 * Bloom filter update flags by value.
 * @const {RevMap}
 */

BloomFilter.flagsByVal = {
  0: 'NONE',
  1: 'ALL',
  2: 'PUBKEY_ONLY'
};

/*
 * Helpers
 */

const POOL20 = Buffer.allocUnsafe(20);
const POOL32 = Buffer.allocUnsafe(32);

function toBuffer(val, enc) {
  if (typeof val !== 'string')
    return val;

  if (enc !== 'hex')
    return Buffer.from(val, enc);

  if (val.length === 40) {
    POOL20.write(val, 0, 20, 'hex');
    return POOL20;
  }

  if (val.length === 64) {
    POOL32.write(val, 0, 32, 'hex');
    return POOL32;
  }

  return Buffer.from(val, 'hex');
}

/*
 * Expose
 */

module.exports = BloomFilter;
