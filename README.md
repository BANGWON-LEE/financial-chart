# Realtime Chart Dashboard (Upbit WebSocket → Candlestick)

업비트 실시간 소켓(WebSocket) API로 체결/캔들 데이터를 받아 **Chart.js + chartjs-chart-financial**로 캔들스틱 차트를 시각화하는 프로젝트입니다.  
현재는 실시간 데이터 수신 및 시각화까지 완료했고, 앞으로 **마우스 드래그/이벤트 기반 구간 선택 시각화**를 확장할 예정입니다.

> Stack: **JavaScript**, **React 19**, **Vite**, **Chart.js v4**, **chartjs-chart-financial**, **chartjs-plugin-zoom**, **date-fns**, **Socket.IO Client**, (옵션) **Firebase Cloud Messaging**

---

## 데모 (예시)
- 실시간 캔들 업데이트 GIF 자리  
  `docs/demo.gif` (추후 추가)

---

## 주요 기능 (현재)
- ✅ 업비트 WebSocket으로 실시간 시세/캔들 데이터 수신  
- ✅ Chart.js Financial Chart로 **Candlestick** 렌더링  
- ✅ 시간 축(`time`)과 가격 축(`open/high/low/close`) 스케일 설정  
- ✅ 줌/패닝(기본) 플러그인 준비(`chartjs-plugin-zoom`)  

---

## 앞으로 할 일 (To-Do / Roadmap)
1. **구간 드래그 선택 & 포커스 뷰**
   - 캔들 영역에서 마우스 **드래그로 기간 선택** → 선택 구간만 확대/별도 미니맵 뷰 제공  
   - 선택 구간 통계(최고/최저/변동률/거래량 합) 오버레이  

2. **마우스 이벤트 UX 개선**
   - **크로스헤어**(vertical/horizontal line) 및 싱크 툴팁  
   - Shift/Alt 키 조합으로 세밀 줌/스냅 동작  

3. **차트 상호작용 고도화**
   - 휠 줌 민감도/경계값 튜닝, 이중 축(가격/거래량) 토글  
   - 캔들 본체/심지 두께 동적조절, 상승/하락 색상 테마 토글  

4. **성능/안정성**
   - 대용량 캔들 **다운샘플링/리샘플링**(1s → 5m/1h) 전략  
   - 보간 없이 빈 캔들 채우기, 데이터 캐시(Map/IndexedDB)  
   - 소켓 재연결/백오프, 메모리 누수 점검  

5. **데이터 레이어링**
   - 이동평균/볼린저밴드 등 **오버레이 지표**  
   - 거래량 바 & 거래량 기반 컬러링  

6. **UI/설정**
   - 심볼/타임프레임(1m/5m/1h/1d) 전환 UI  
   - 라이트/다크 테마, 한/영 레이블 스위치  

---

## 프로젝트 구조 (요약)
