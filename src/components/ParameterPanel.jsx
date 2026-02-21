import useStore from '../store'

export default function ParameterPanel() {
  const handleMode = useStore(s => s.handleMode)
  const setHandleMode = useStore(s => s.setHandleMode)
  const handleHeightM = useStore(s => s.handleHeightM)
  const setHandleHeightM = useStore(s => s.setHandleHeightM)
  const handleWidthScale = useStore(s => s.handleWidthScale)
  const setHandleWidthScale = useStore(s => s.setHandleWidthScale)
  const padWidthScale = useStore(s => s.padWidthScale)
  const setPadWidthScale = useStore(s => s.setPadWidthScale)
  const cupTopDiameterMm = useStore(s => s.cupTopDiameterMm)
  const setCupTopDiameterMm = useStore(s => s.setCupTopDiameterMm)
  const cupBottomDiameterMm = useStore(s => s.cupBottomDiameterMm)
  const setCupBottomDiameterMm = useStore(s => s.setCupBottomDiameterMm)
  const filledWeightG = useStore(s => s.filledWeightG)
  const setFilledWeightG = useStore(s => s.setFilledWeightG)
  const targetSafetyFactor = useStore(s => s.targetSafetyFactor)
  const setTargetSafetyFactor = useStore(s => s.setTargetSafetyFactor)
  const smoothLevel = useStore(s => s.smoothLevel)
  const setSmoothLevel = useStore(s => s.setSmoothLevel)

  const sliders = [
    { label: 'Handle Height', value: handleHeightM, set: setHandleHeightM, min: 0.02, max: 0.5, step: 0.005, unit: 'm' },
    { label: 'Handle Width', value: handleWidthScale, set: setHandleWidthScale, min: 0.6, max: 2.0, step: 0.05, unit: 'x' },
    { label: 'Pad Width', value: padWidthScale, set: setPadWidthScale, min: 0.6, max: 2.0, step: 0.05, unit: 'x' },
    { label: 'Top Diameter', value: cupTopDiameterMm, set: setCupTopDiameterMm, min: 30, max: 150, unit: 'mm' },
    { label: 'Bottom Dia.', value: cupBottomDiameterMm, set: setCupBottomDiameterMm, min: 30, max: 150, unit: 'mm' },
    { label: 'Filled Weight', value: filledWeightG, set: setFilledWeightG, min: 50, max: 1500, unit: 'g' },
    { label: 'Safety Factor', value: targetSafetyFactor, set: setTargetSafetyFactor, min: 1.5, max: 10, step: 0.5, unit: 'x' },
    { label: 'Smoothing', value: smoothLevel, set: setSmoothLevel, min: 1, max: 10, unit: '' },
  ]

  return (
    <div className="param-group">
      <h3>Parameters</h3>
      <div className="param-row" style={{ alignItems: 'center' }}>
        <label>Mode</label>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            type="button"
            onClick={() => setHandleMode('tubular')}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid #bdbdbd',
              borderRadius: 6,
              background: handleMode === 'tubular' ? '#00BCD4' : '#fff',
              color: handleMode === 'tubular' ? '#fff' : '#333',
            }}
          >
            Tubular
          </button>
          <button
            type="button"
            onClick={() => setHandleMode('foldable')}
            style={{
              padding: '4px 8px',
              fontSize: 11,
              border: '1px solid #bdbdbd',
              borderRadius: 6,
              background: handleMode === 'foldable' ? '#00BCD4' : '#fff',
              color: handleMode === 'foldable' ? '#fff' : '#333',
            }}
          >
            Foldable
          </button>
        </div>
        <span className="param-val">{handleMode}</span>
      </div>
      {sliders.map(s => (
        <div className="param-row" key={s.label}>
          <label>{s.label}</label>
          <input type="range" min={s.min} max={s.max} step={s.step || 1}
            value={s.value} onChange={e => s.set(Number(e.target.value))} />
          <span className="param-val">{s.value}{s.unit}</span>
        </div>
      ))}
    </div>
  )
}
