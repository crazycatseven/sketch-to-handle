import { useMemo } from 'react'
import useStore from '../store'
import { generateTubularHandle } from '../utils/tubularHandleGenerator'
import { sampleBezierSpline } from '../utils/bezierPath'

export default function StrengthReport() {
  const image = useStore(s => s.image)
  const curvePoints = useStore(s => s.curvePoints)

  const smoothLevel = useStore(s => s.smoothLevel)
  const handleMode = useStore(s => s.handleMode)
  const handleHeightM = useStore(s => s.handleHeightM)
  const handleWidthScale = useStore(s => s.handleWidthScale)
  const padWidthScale = useStore(s => s.padWidthScale)
  const cupTopDiameterMm = useStore(s => s.cupTopDiameterMm)
  const cupBottomDiameterMm = useStore(s => s.cupBottomDiameterMm)
  const filledWeightG = useStore(s => s.filledWeightG)
  const targetSafetyFactor = useStore(s => s.targetSafetyFactor)

  const inputStroke = useMemo(() => {
    if (curvePoints.length < 2) return null
    return sampleBezierSpline(curvePoints, 36)
  }, [curvePoints])

  const report = useMemo(() => {
    if (!inputStroke || inputStroke.length < 2) return null
    try {
      const result = generateTubularHandle(inputStroke, {
        imageWidthPx: image?.width || 1000,
        imageHeightPx: image?.height || 1000,
        handleMode,
        handleHeightM,
        handleWidthScale,
        padWidthScale,
        cupTopDiameterMm,
        cupBottomDiameterMm,
        filledWeightG,
        targetSafetyFactor,
        smoothLevel,
      })
      return result?.strengthReport || null
    } catch {
      return null
    }
  }, [
    inputStroke,
    image,
    handleMode,
    handleHeightM,
    handleWidthScale,
    padWidthScale,
    cupTopDiameterMm,
    cupBottomDiameterMm,
    filledWeightG,
    targetSafetyFactor,
    smoothLevel,
  ])

  if (!report) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#aaa',
          height: '100%',
          fontSize: 13,
          padding: 16,
          textAlign: 'center',
        }}
      >
        Draw a handle curve to see
        <br />
        the strength analysis
      </div>
    )
  }

  const pass = report.pass
  const isFoldable = report.handleMode === 'foldable'

  return (
    <div className="strength-report">
      <div className={`strength-banner ${pass ? 'pass' : 'fail'}`}>
        {pass ? 'PASS' : 'FAIL'} - Min SF: {report.minimumSafetyFactor}x (target: {report.targetSafetyFactor}x)
      </div>

      <h4>Safety Factors</h4>
      <table className="strength-table">
        <tbody>
          <Row
            label="Structural"
            value={`${report.structuralSafetyFactor}x`}
            warn={report.structuralSafetyFactor < report.targetSafetyFactor}
          />
          <Row
            label="Adhesive"
            value={`${report.adhesiveSafetyFactor}x`}
            warn={report.adhesiveSafetyFactor < report.targetSafetyFactor}
          />
          <Row label="Minimum" value={`${report.minimumSafetyFactor}x`} warn={!pass} />
        </tbody>
      </table>

      <h4>{isFoldable ? 'Handle Body' : 'Handle Tube'}</h4>
      <table className="strength-table">
        <tbody>
          <Row label="Grip diameter" value={`${report.tubeGripDiameterMm} mm`} />
          <Row label="Root diameter" value={`${report.tubeRootDiameterMm} mm`} />
          <Row label="Path length" value={`${report.handlePathLengthMm} mm`} />
          <Row label="Lever arm" value={`${report.leverArmMm} mm`} />
          <Row label="Endpoint span" value={`${report.endpointSpanMm} mm`} />
        </tbody>
      </table>

      {isFoldable && (
        <>
          <h4>Foldable Build</h4>
          <table className="strength-table">
            <tbody>
              <Row label="Panel thickness" value={`${report.foldPanelThicknessMm} mm`} />
              <Row label="Hinge thickness" value={`${report.foldHingeThicknessMm} mm`} />
              <Row label="Folded width" value={`${report.foldBodyWidthMm} mm`} />
              <Row label="Folded height" value={`${report.foldBodyHeightMm} mm`} />
              <Row label="Hinge band" value={`${report.foldHingeBandMm} mm`} />
            </tbody>
          </table>
        </>
      )}

      <h4>Adhesive Pads</h4>
      <table className="strength-table">
        <tbody>
          <Row label="Pad diameter" value={`${report.padDiameterMm} mm`} />
          <Row label="Pad thickness" value={`${report.padThicknessMm} mm`} />
          <Row label="Area (each)" value={`${report.padAreaEachMm2} mm2`} />
          <Row label="Area (total)" value={`${report.padAreaTotalMm2} mm2`} />
          <Row
            label="Cup dia @ pads"
            value={`${report.localPadFitDiametersMm[0]} / ${report.localPadFitDiametersMm[1]} mm`}
          />
          <Row
            label="Curvature radii"
            value={`${report.padCurvatureRadiiMm[0]} / ${report.padCurvatureRadiiMm[1]} mm`}
          />
        </tbody>
      </table>

      {report.notes.length > 0 && (
        <>
          <h4>Notes</h4>
          <ul className="strength-notes">
            {report.notes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function Row({ label, value, warn }) {
  return (
    <tr>
      <td>{label}</td>
      <td style={warn ? { color: '#C62828', fontWeight: 600 } : undefined}>{value}</td>
    </tr>
  )
}
