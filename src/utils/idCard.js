export default {
  birthday (value) {
    if (value && (value.length === 18 || value.length === 15)) {
      const year = value.charAt(6) + value.charAt(7) + value.charAt(8) + value.charAt(9)
      const month = value.charAt(10) + value.charAt(11)
      const date = value.charAt(12) + value.charAt(13)

      return `${year}-${month}-${date}`
    } else {
      return ''
    }
  },
  age (value) {
    if (value && (value.length === 18 || value.length === 15)) {
      const year = value.charAt(6) + value.charAt(7) + value.charAt(8) + value.charAt(9)
      const currentYear = new Date().getFullYear()

      return currentYear - year
    } else {
      return ''
    }
  }
}
