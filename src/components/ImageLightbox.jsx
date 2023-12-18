import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Captions from "yet-another-react-lightbox/plugins/captions";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import "yet-another-react-lightbox/plugins/captions.css";
import { forwardRef, useImperativeHandle, useState } from "react";

const ImageLightbox = forwardRef(({ messages }, ref) => {
  const [open, setOpen] = useState(false);

  const handleImageClick = (item) => {
    const filteredImages = messages
      .filter((i) => i.image && i.id !== item.id)
      .map(({ image, message }) => ({
        src: image,
        ...(message ? { description: message } : {}),
      }));
    const clickedImage = item.message
      ? { description: item.message, src: item.image }
      : { src: item.image };
    setOpen([clickedImage, ...filteredImages]);
  };
  useImperativeHandle(ref, () => ({
    handleImageClick,
  }));

  return (
    <div>
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        plugins={[Zoom, Fullscreen, Thumbnails, Captions]}
        slides={open}
      />
    </div>
  );
});
export default ImageLightbox;
