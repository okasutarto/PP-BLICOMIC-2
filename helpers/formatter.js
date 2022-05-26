function format(value) {
  return `Rp ${value.toLocaleString().replace(/,/g, '.')},00`
}

module.exports = format