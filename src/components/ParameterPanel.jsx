import useStore from '../store'

export default function ParameterPanel() {
  const cupHeightMm = useStore(s => s.cupHeightMm)
  const setCupHeightMm = useStore(s => s.setCupHeightMm)
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
    { label: 'Cup Height', value: cupHeightMm, set: setCupHeightMm, min: 50, max: 200, unit: 'mm' },
    { label: 'Top Diameter', value: cupTopDiameterMm, set: setCupTopDiameterMm, min: 40, max: 150, unit: 'mm' },
    { label: 'Bottom Dia.', value: cupBottomDiameterMm, set: setCupBottomDiameterMm, min: 30, max: 140, unit: 'mm' },
    { label: 'Filled Weight', value: filledWeightG, set: setFilledWeightG, min: 50, max: 1500, unit: 'g' },
    { label: 'Safety Factor', value: targetSafetyFactor, set: setTargetSafetyFactor, min: 1.5, max: 10, step: 0.5, unit: 'x' },
    { label: 'Smoothing', value: smoothLevel, set: setSmoothLevel, min: 1, max: 10, unit: '' },
  ]

  return (
    <div className="param-group">
      <h3>Parameters</h3>
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
