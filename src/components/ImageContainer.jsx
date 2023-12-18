import React from "react";
import { MdCloudUpload, MdOutlineClose } from "react-icons/md";

const ImageContainer = ({
  getRootProps,
  getInputProps,
  isDragActive,
  selectedImage,
  setSelectedImage,
  setImageDropped,
}) => {
  const handleClose = (e) => {
    e.stopPropagation();
    setSelectedImage(null);
    setImageDropped(false);
    isDragActive = false;
  };

  return (
    <div className="btn-select-image" {...getRootProps()}>
      <div className="text-end">
        <MdOutlineClose className="close-ico" onClick={handleClose} />
      </div>
      <input {...getInputProps()} />
      {!selectedImage &&
        (isDragActive ? (
          <div className="content">
            <MdCloudUpload className="ico" />
            <p className="mb-5">Drop the files here ...</p>
          </div>
        ) : (
          <div className="content">
            <MdCloudUpload className="ico" />

            <p>Drag and drop files here or</p>
            <div>
              <button className="btn">Browse Files</button>
            </div>
          </div>
        ))}
      {selectedImage && (
        <div>
          <img
            className="selected-image"
            src={selectedImage && URL.createObjectURL(selectedImage[0])}
          />
        </div>
      )}
    </div>
  );
};
export default ImageContainer;
