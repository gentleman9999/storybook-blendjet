export default {
  methods: {
    formatFollowCount(followers, decimal = 0) {
      if (!followers) {
        return null
      }
      let count = Number(followers)
      count = count / 1000
      if (count / 1000 >= 1) {
        count = count / 1000
        count = count.toFixed(1)
        count = count + 'M'
      } else {
        count = count.toFixed(decimal)
        count = count + 'K'
      }
      return count
    }
  }
}
