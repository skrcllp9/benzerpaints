import { useMemo, useRef, useState } from "react";
import "./image-crop-modal.css";

const FRAME_W = 320;
const OUTPUT_W = 800;

// Pan/zoom crop dialog. `aspect` is width / height of the crop frame — pass
// the ratio the image is shown at on the site so what's saved is what shows.
const ImageCropModal = ({ file, aspect = 1, onCancel, onConfirm }) => {
  const frameH = Math.round(FRAME_W / aspect);
  // Not revoked on cleanup: React's dev-mode effect double-run would revoke
  // it before the image loads. One small blob per picked photo is harmless.
  const url = useMemo(() => URL.createObjectURL(file), [file]);

  const imgRef = useRef(null);
  const drag = useRef(null);
  const [nat, setNat] = useState(null); // natural image size
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // image centre vs frame centre
  const [busy, setBusy] = useState(false);

  // Scale at which the image just covers the frame; zoom multiplies it.
  const cover = nat ? Math.max(FRAME_W / nat.w, frameH / nat.h) : 1;
  const scale = cover * zoom;

  const clamp = (pos, s = scale) => {
    if (!nat) return pos;
    const maxX = Math.max(0, (nat.w * s - FRAME_W) / 2);
    const maxY = Math.max(0, (nat.h * s - frameH) / 2);
    return { x: Math.min(maxX, Math.max(-maxX, pos.x)), y: Math.min(maxY, Math.max(-maxY, pos.y)) };
  };

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, start: offset };
  };
  const onPointerMove = (e) => {
    if (!drag.current) return;
    setOffset(
      clamp({
        x: drag.current.start.x + e.clientX - drag.current.x,
        y: drag.current.start.y + e.clientY - drag.current.y,
      })
    );
  };
  const endDrag = () => {
    drag.current = null;
  };

  const handleZoom = (e) => {
    const next = Number(e.target.value);
    setZoom(next);
    setOffset((pos) => clamp(pos, cover * next));
  };

  const handleConfirm = () => {
    setBusy(true);
    const outH = Math.round(OUTPUT_W / aspect);
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_W;
    canvas.height = outH;
    const left = FRAME_W / 2 + offset.x - (nat.w * scale) / 2;
    const top = frameH / 2 + offset.y - (nat.h * scale) / 2;
    canvas
      .getContext("2d")
      .drawImage(imgRef.current, -left / scale, -top / scale, FRAME_W / scale, frameH / scale, 0, 0, OUTPUT_W, outH);
    canvas.toBlob(
      (blob) => {
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        onConfirm(new File([blob], name, { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.9
    );
  };

  return (
    <div className="crop-modal-overlay" role="dialog" aria-modal="true" aria-label="Crop photo">
      <div className="crop-modal">
        <h3>Crop photo</h3>
        <p>Drag to reposition and use the slider to zoom. This is how it will appear on the site.</p>

        <div
          className="crop-frame"
          style={{ width: FRAME_W, height: frameH }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          <img
            ref={imgRef}
            src={url}
            alt=""
            draggable={false}
            onLoad={(e) => setNat({ w: e.target.naturalWidth, h: e.target.naturalHeight })}
            style={
              nat
                ? {
                    width: nat.w * scale,
                    height: nat.h * scale,
                    transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px))`,
                  }
                : { visibility: "hidden" }
            }
          />
        </div>

        <label className="crop-zoom">
          <span>Zoom</span>
          <input type="range" min="1" max="3" step="0.01" value={zoom} onChange={handleZoom} />
        </label>

        <div className="crop-actions">
          <button type="button" className="admin-btn admin-btn-ghost" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="admin-btn admin-btn-primary" onClick={handleConfirm} disabled={!nat || busy}>
            {busy ? "Cropping…" : "Crop & Use"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
