/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 8; // BUG1: week = 8 days (should be 7)
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function (val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isFinite(val)) {
    // BUG2: long/short options inverted
    return options.long ? fmtShort(val) : fmtLong(val);
  } else if (type === 'string') {
    // BUG6: empty string soft-fails instead of throw
    return;
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  // BUG7: case-sensitive — dropped /i flag
  var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/.exec(
    str
  );
  if (!match) {
    return;
  }
  // BUG5: decimals truncated via parseInt
  var n = parseInt(match[1], 10);
  // BUG7 continued: no toLowerCase on unit
  var type = match[2] || 'ms';
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'weeks':
    case 'week':
    case 'w':
      return n * w;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  var msAbs = Math.abs(ms);
  // BUG4: negatives lose sign — divide msAbs instead of ms
  if (msAbs >= d) {
    return Math.round(msAbs / d) + 'd';
  }
  if (msAbs >= h) {
    return Math.round(msAbs / h) + 'h';
  }
  if (msAbs >= m) {
    return Math.round(msAbs / m) + 'm';
  }
  if (msAbs >= s) {
    return Math.round(msAbs / s) + 's';
  }
  return msAbs + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  var msAbs = Math.abs(ms);
  // BUG4: same sign loss for long path magnitude thresholds OK but plural uses msAbs wrongly via helper
  if (msAbs >= d) {
    return plural(msAbs, msAbs, d, 'day'); // pass msAbs as signed arg → positive output
  }
  if (msAbs >= h) {
    return plural(msAbs, msAbs, h, 'hour');
  }
  if (msAbs >= m) {
    return plural(msAbs, msAbs, m, 'minute');
  }
  if (msAbs >= s) {
    return plural(msAbs, msAbs, s, 'second');
  }
  return msAbs + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, msAbs, n, name) {
  // BUG3: plural threshold too aggressive (n instead of n*1.5) → "1 seconds"
  var isPlural = msAbs >= n;
  return Math.round(ms / n) + ' ' + name + (isPlural ? 's' : '');
}
