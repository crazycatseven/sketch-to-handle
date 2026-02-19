import { useRef, useEffect, useCallback } from 'react'
import useStore from '../store'

export default function PhotoCanvas() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const drawing = useRef(false)

  const image = useStore(s => s.image)
  const setImage = useStore(s => s.setImage)
  const strokes = useStore(s => s.strokes)
  const currentStroke = useStore(s => s.currentStroke)
  const addPoint = useStore(s => s.addPoint)
  const finishStroke = useStore(s => s.finishStroke)
  const undoStroke = useStore(s => s.undoStroke)
  const tool = useStore(s => s.tool)
  const lineWidth = useStore(s => s.lineWidth)

  // 处理图片上传
  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return
    const img = new Image()
    img.onload = () => setImage(img)
    img.src = URL.createObjectURL(file)
  }, [setImage])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    handleFile(e.dataTransfer.files[0])
  }, [handleFile])

  const handleClick = useCallback(() => {
    if (image) return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handleFile(e.target.files[0])
    input.click()
  }, [image, handleFile])

  // 获取归一化坐标
  const getNorm = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    return { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) }
  }, [])

  const onPointerDown = useCallback((e) => {
    if (!image) return
    if (tool === 'eraser') { undoStroke(); return }
    drawing.current = true
    const pt = getNorm(e)
    if (pt) addPoint(pt)
  }, [image, tool, getNorm, addPoint, undoStroke])

  const onPointerMove = useCallback((e) => {
    if (!drawing.current) return
    const pt = getNorm(e)
    if (pt) addPoint(pt)
  }, [getNorm, addPoint])

  const onPointerUp = useCallback(() => {
    if (!drawing.current) return
    drawing.current = false
    finishStroke()
  }, [finishStroke])

  // 重绘画布
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const w = container.clientWidth
    const h = container.clientHeight
    let cw = w, ch = h
    if (image) {
      const ratio = image.width / image.height
      if (w / h > ratio) { cw = h * ratio; ch = h }
      else { cw = w; ch = w / ratio }
    }
    canvas.width = cw
    canvas.height = ch

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, cw, ch)

    if (image) {
      ctx.drawImage(image, 0, 0, cw, ch)
    }

    // 绘制已有笔画和当前笔画
    const allStrokes = [...strokes]
    if (currentStroke.length > 1) allStrokes.push(currentStroke)

    ctx.strokeStyle = '#00E5FF'
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const stroke of allStrokes) {
      if (stroke.length < 2) continue
      ctx.beginPath()
      ctx.moveTo(stroke[0].x * cw, stroke[0].y * ch)
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x * cw, stroke[i].y * ch)
      }
      ctx.stroke()
    }
  }, [image, strokes, currentStroke, lineWidth])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <canvas
        ref={canvasRef}
        style={{ cursor: image ? 'crosshair' : 'default' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
      {!image && (
        <div className="drop-zone" onClick={handleClick}
          onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
          <span style={{ fontSize: 40 }}>📷</span>
          <span>Drop a photo here or click to upload</span>
          <span style={{ fontSize: 12, color: '#999' }}>Take a photo of your cup, bottle, or box</span>
        </div>
      )}
    </div>
  )
}
