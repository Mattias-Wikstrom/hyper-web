import React, { useState } from 'react';
import { Button, Typography } from '@mui/material';

interface ModalProps {
  isOpen: boolean;
  onClose: (curvature: number) => void;
  title: string;
  previousCurvature: number;
}

const CurvatureModal: React.FC<ModalProps> = ({ isOpen, onClose, previousCurvature }) => {
  if (!isOpen) return null; // Don't render modal if it's closed

  let [curvature, setCurvature] = useState(previousCurvature);

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <Typography variant="h5" gutterBottom>
          Curvature
        </Typography>

        <br></br>
        <br></br>
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            type="range"
            id="slider"
            min="-20"
            max="20"
            value={curvature * 10}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCurvature(0.1 * parseInt(event.target.value, 10))}
            list="tickmarks"
            style={{ width: '100%' }}
          />
          <datalist id="tickmarks">
            <option value="-20" label="-20"></option>
            <option value="-10" label="-10"></option>
            <option value="0" label="0"></option>
            <option value="10" label="10"></option>
            <option value="20" label="20"></option>
          </datalist>
          <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                position: 'absolute',
                width: '100%',
                top: '20px',
              }}
            >
            <span>-20</span>
            <span>-10</span>
            <span>0&nbsp;&nbsp;</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>
        
        <br></br>
        <br></br>
        <Button onClick={() => onClose(curvature)} color="primary">Close</Button>
      </div>
    </div>
  );
};

// Simple modal styles
const styles : any = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },
  modal: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '5px',
    width: '800px',
    textAlign: 'center'
  },
};

export default CurvatureModal;

