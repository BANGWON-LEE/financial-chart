import React, { createContext, useContext, useState, useCallback } from 'react'
import { formatRequestDate } from '../util/date'

const ChartContext = createContext()

export function useChartContext() {
  const context = useContext(ChartContext)
  if (!context) {
    throw new Error('useChartContext must be used within a ChartProvider')
  }
  return context
}

export function ChartProvider({ children }) {
  const [chartState, setChartState] = useState({
    chartEvent: true,
    chartCurrentFocusDate: formatRequestDate(new Date()),
  })

  const updateChartSignal = useCallback((event, status) => {
    setChartState(prev => ({
      ...prev,
      [event]: status
    }))
  }, [])

  const getChartSignal = useCallback((event) => {
    return chartState[event]
  }, [chartState])

  const isChartSignalOn = useCallback((event) => {
    return chartState[event] === true
  }, [chartState])

  const value = {
    chartState,
    updateChartSignal,
    getChartSignal,
    isChartSignalOn,
  }

  return (
    <ChartContext.Provider value={value}>
      {children}
    </ChartContext.Provider>
  )
}
