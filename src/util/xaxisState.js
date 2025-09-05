let xValue = 0
export function xaxisStore() {
  return {
    leftX: function () {
      xValue -= 0.8
    },
    rightX: function () {
      xValue += 15
    },
    getX: function () {
      console.log('xxxV', xValue)
      return xValue
    },
    getXRange: function () {
      console.log('vvvrange', xValue)
      return xValue
    },
  }
}
