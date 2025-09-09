# financial Chart 
업비트 실시간 소켓(WebSocket)데이터를 받아 **Chart.js + chartjs-chart-financial**로 캔들스틱 타입 차트를 시각화하는 프로젝트입니다.  
현재는 실시간 데이터 수신 및 시각화까지 완료했고, 앞으로 **마우스 드래그/이벤트 기반 구간 선택 시각화**를 확장할 예정입니다.

> Stack: **JavaScript**, **React 19**, **Vite**, **Chart.js v4**, **chartjs-chart-financial**, **chartjs-plugin-zoom**, **date-fns**, **Socket.IO Client**, (옵션) **Firebase Cloud Messaging**

---

## 데모 (예시)
![Demo](./public/chart09.gif)
--- 
설명 : 터치 패드 휠로, 범위 이동 작업 내용까지 표현

## 주요 기능 (현재)
- ✅ 업비트 WebSocket으로 실시간 시세/캔들 데이터 수신  
- ✅ Chart.js Financial Chart로 **Candlestick** 렌더링  
- ✅ 시간 축(`time`)과 가격 축(`open/high/low/close`) 스케일 설정  
- ✅ 줌/패닝(기본) 플러그인 준비(`chartjs-plugin-zoom`)  

---

## 작업 기록
   - [25년 8월 31일] : 차트 focus에 따라 렌더링 컨트롤 가능, 차트 드래그 시, 렌더링 멈춤
   - [25년 9월 5일] : upbit api 최대 응답 데이터 개수 파악(최대 200개), ref로 컴포넌트에 연결하여 wheel 이벤트 호출 시 slice메서드를 사용하여 데이터 범위 조절 기능 작업 중
   - [25년 9월 6일] : 패드에 의한 이벤트 액션('wheel 이벤트')에 따라, 데이터 시각화 범위(x축) 동적으로 함. 범위가 가장 최신 x값(time)을 넘어설 경우, false로 return 하도록 작업 
   - [25년 9월 7일] : chart범위가 최신 날짜 기준일 때, socket 다시 진행 --> !but socek에 의한 데이터를 렌더링 안했을 때, 보관 방법 처리 안함... 해당 부분 고민 후 처리 
   - [25년 9월 8일] : upbit api의 날짜 쿼리파라미터에 동적으로 값을 넘김, 200개 이상의 과거 데이터를 볼 수 있음


## 고민
   1. 어떻게 업비트 차트처럼 자연스럽게 해야 하나
   - 자연스러운 화면 이동 : 깜빡 거리지 않게 범위 이동이 가능한지 고민해봐야 함
