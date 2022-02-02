import { useRef, useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { useStyles } from '../../../hooks/useStyles';
export default function ImageUpload({ id, onInput, setImage }) {
  const classes = useStyles();
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      setImage(false);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    onInput(id, pickedFile, fileIsValid);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div style={{ display: 'block' }}>
      <input
        // id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`${classes.imageUpload}`} style={{ display: 'flex' }}>
        <div className={`${classes.imageUpload__preview}`}>
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button
          type="button"
          onClick={pickImageHandler}
          style={{ background: '#661e38', marginLeft: 20 }}
        >
          PICK IMAGE
        </Button>
      </div>
    </div>
  );
}
