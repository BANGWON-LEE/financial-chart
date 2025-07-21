import { getAllStorage } from './common/common'
import NumberInput from './style/text/NumberInput'
import { colorArr } from './style/styleElement'

export default function StyleCustomFilter(props) {
  const {
    styleState,
    setStyleState,
    chartOptionState,
    setChartOptionState,
    type,
    closeModalBtn,
    uniqueChartName,
  } = props

  function updateBorderWidth(event, index) {
    // border width 값 조절하는 함수 (line)
    setStyleState(prev => {
      const newState = [...prev]
      newState[index] = { ...newState[index], borderWidth: Number(event) }
      return newState
    })
  }

  function updateBackColor(event, index) {
    // border와 bar의 color 값 조절하는 함수 (line)
    setStyleState(prev => {
      const newState = [...prev]
      newState[index] = {
        ...newState[index],
        borderColor: event,
        backgroundColor: event,
      }
      return newState
    })
  }

  function updateBarThicknessColor(event, index) {
    // bar width 값 조절하는 함수 (bar)
    setStyleState(prev => {
      const newState = [...prev]
      newState[index] = {
        ...newState[index],
        barThickness: Number(event),
      }
      return newState
    })
  }

  function updateMaxTicksLimit(event) {
    setChartOptionState(prev => {
      const newState = { ...prev }
      newState.scales.x.ticks.maxTicksLimit = Number(event)

      return newState
    })
  }

  function changeChartTypeInMixed(event, index) {
    // 차트 타입을 변경하게 해주는 함수
    setStyleState(prev => {
      const newState = [...prev]
      newState[index] = {
        ...newState[index],
        type: event,
      }
      return newState
    })
  }

  function submitStyle(styleState, closeModalBtn) {
    // 차트의 속성들을 set해주고 저장해주는 함수, localStorage에 저장 그리고 팝업창 닫음
    const allChartStyle = getAllStorage()
    const currentChartStyleObj = { [uniqueChartName]: styleState }
    const uniqueChartOptionName = uniqueChartName + 'Option'
    const currentChartOptionObj = {
      [uniqueChartOptionName]: chartOptionState,
    }
    const finalArr = {
      ...allChartStyle,
      ...currentChartStyleObj,
      ...currentChartOptionObj,
    }

    localStorage.setItem('askChart', JSON.stringify(finalArr))
    closeModalBtn()
  }

  const chartType = ['line', 'bar']

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-500 bg-opacity-20">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[70vw]">
        {styleState.map((el, index) => (
          <div key={el.id} className="flex justify-between">
            <p className="w-[110px]">{el.name}</p>
            {el.type === 'line' && (
              <NumberInput
                title={'lineBorderWidth'}
                defaultValue={el.borderWidth}
                onChange={updateBorderWidth}
                index={index}
              />
            )}
            {el.type === 'bar' && (
              <NumberInput
                title={'barWidth'}
                defaultValue={el.barThickness}
                onChange={updateBarThicknessColor}
                index={index}
              />
            )}
            <div>
              <label className="mr-[15px]">color :</label>
              <select
                onChange={event =>
                  updateBackColor(event.currentTarget.value, index)
                }
              >
                <option>{colorArr[index].name}</option>
                {/* <option>색상을 선택하세요</option> */}
                {colorArr.map(el => {
                  return (
                    <option key={el.name} value={el.rgb}>
                      {el.name}
                    </option>
                  )
                })}
              </select>
            </div>
            {/* type에 mixed라는 단어가 포함되면 차트 타입을 설정할 수 있는 아래와 같은 ui가 보이도록 함 */}
            {type.match('mixed') && (
              <div>
                <label className="mr-[15px]">chart type :</label>
                <select
                  onChange={event =>
                    changeChartTypeInMixed(event.currentTarget.value, index)
                  }
                  defaultValue={styleState[index].type}
                >
                  <option disabled>{styleState[index].type}</option>
                  {chartType.map(el => {
                    return (
                      <option key={'chartTypeArr' + el} value={el}>
                        {el}
                      </option>
                    )
                  })}
                </select>
              </div>
            )}
          </div>
        ))}
        <div className="text-center mt-8">
          <NumberInput
            title={'maxTicksLimit'}
            defaultValue={chartOptionState.scales.x.ticks.maxTicksLimit}
            onChange={updateMaxTicksLimit}
            index={null}
          />
        </div>
        <div className="w-full text-center mt-6">
          <button
            className="px-4 py-2 rounded-md bg-blue-400 text-white font-semibold "
            // onClick={() => closeModalBtn()}
            onClick={() => submitStyle(styleState, closeModalBtn)}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}
