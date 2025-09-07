let xValue = -30
export function xaxisStore() {
  return {
    leftX: function () {
      xValue -= 0.8
    },
    rightX: function () {
      if (xValue < -30) {
        xValue += 0.8
      }
    },
    getX: function () {
      return xValue
    },
  }
}
