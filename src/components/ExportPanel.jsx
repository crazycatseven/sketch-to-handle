import useStore from '../store'
import { exportSTL } from '../utils/stlExporter'

export default function ExportPanel() {
  const handleMode = useStore(s => s.handleMode)
  const stlBinary = useStore(s => s.stlBinary)
  const setStlBinary = useStore(s => s.setStlBinary)

  const handleExport = () => {
    const meshes = [...(window.__handleMeshes || [])]
    if (meshes.length > 0) {
      const filename = handleMode === 'foldable' ? 'cup_handle_foldable.stl' : 'cup_handle.stl'
      exportSTL(meshes, stlBinary, filename)
    } else {
      alert('Draw a handle first!')
    }
  }

  return (
    <>
      <h3 style={{ fontSize: 13, color: '#00BCD4', textTransform: 'uppercase', letterSpacing: .5, margin: '4px 0' }}>Export</h3>
      <button onClick={handleExport}>Export STL</button>
      <label style={{ fontSize: 12 }}>
        <input type="checkbox" checked={stlBinary} onChange={e => setStlBinary(e.target.checked)} />
        Binary STL
      </label>
    </>
  )
}
