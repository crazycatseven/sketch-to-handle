import useStore from '../store'

export default function Toolbar() {
  const mode = useStore(s => s.mode)
  const tool = useStore(s => s.tool)
  const setTool = useStore(s => s.setTool)
  const lineWidth = useStore(s => s.lineWidth)
  const setLineWidth = useStore(s => s.setLineWidth)
  const undoStroke = useStore(s => s.undoStroke)
  const clearStrokes = useStore(s => s.clearStrokes)
  const surfacePoints = useStore(s => s.surfacePoints)
  const undoSurfacePoint = useStore(s => s.undoSurfacePoint)
  const clearSurfacePoints = useStore(s => s.clearSurfacePoints)

  if (mode === 'precision') {
    return (
      <div className="toolbar">
        <button className="active" title="Place Point">📍</button>
        <div className="sep" />
        <button onClick={undoSurfacePoint} title="Undo last point">↩️</button>
        <button onClick={clearSurfacePoints} title="Clear all points">🗑️</button>
        <div className="sep" />
        <label style={{ fontSize: 10, color: '#888', textAlign: 'center', lineHeight: 1.3 }}>
          {surfacePoints.length} pt{surfacePoints.length !== 1 ? 's' : ''}
        </label>
      </div>
    )
  }

  return (
    <div className="toolbar">
      <button className={tool === 'pen' ? 'active' : ''} onClick={() => setTool('pen')} title="Pen">✏️</button>
      <button className={tool === 'eraser' ? 'active' : ''} onClick={() => setTool('eraser')} title="Eraser">🧹</button>
      <div className="sep" />
      <button onClick={undoStroke} title="Undo">↩️</button>
      <button onClick={clearStrokes} title="Clear all">🗑️</button>
      <div className="sep" />
      <label>Width</label>
      <input type="range" min="1" max="12" value={lineWidth}
        onChange={e => setLineWidth(Number(e.target.value))} />
    </div>
  )
}
