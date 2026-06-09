import { slides } from "virtual:campfire/slides";
import { SlideCanvas } from "./slide-canvas.js";
import { SlideView } from "./slide-view.js";

export function Present({ index }: { index: number }) {
  const slide = slides[index];
  if (!slide) {
    return null;
  }
  return (
    <div className="cf-present">
      <SlideCanvas>
        <SlideView slide={slide} />
      </SlideCanvas>
      <div className="cf-present-progress">
        {index + 1} / {slides.length}
      </div>
    </div>
  );
}
