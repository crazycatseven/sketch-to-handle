import { create } from 'zustand'

const useStore = create((set, get) => ({
  // Image
  image: null,
  setImage: (img) => set({ image: img }),

  // Strokes — each stroke is [{x,y}, ...] (normalized 0-1)
  strokes: [],
  currentStroke: [],
  addPoint: (pt) => set((s) => ({ currentStroke: [...s.currentStroke, pt] })),
  finishStroke: () => set((s) => {
    if (s.currentStroke.length < 2) return { currentStroke: [] }
    return { strokes: [...s.strokes, s.currentStroke], currentStroke: [] }
  }),
  undoStroke: () => set((s) => ({ strokes: s.strokes.slice(0, -1) })),
  clearStrokes: () => set({ strokes: [], currentStroke: [] }),

  // Drawing tool
  tool: 'pen',
  setTool: (t) => set({ tool: t }),
  lineWidth: 4,
  setLineWidth: (w) => set({ lineWidth: w }),

  // Path smoothing
  smoothLevel: 3,
  setSmoothLevel: (v) => set({ smoothLevel: v }),

  // Cup physical parameters
  cupHeightMm: 120,
  setCupHeightMm: (v) => set({ cupHeightMm: v }),
  cupTopDiameterMm: 80,
  setCupTopDiameterMm: (v) => set({ cupTopDiameterMm: v }),
  cupBottomDiameterMm: 65,
  setCupBottomDiameterMm: (v) => set({ cupBottomDiameterMm: v }),
  filledWeightG: 450,
  setFilledWeightG: (v) => set({ filledWeightG: v }),
  targetSafetyFactor: 5.0,
  setTargetSafetyFactor: (v) => set({ targetSafetyFactor: v }),

  // STL export options
  stlBinary: true,
  setStlBinary: (v) => set({ stlBinary: v }),
}))

export default useStore
