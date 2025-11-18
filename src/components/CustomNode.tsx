import { Handle, Position } from 'reactflow';
import React from 'react';

interface CustomNodeProps {
  data: {
    label: string;
    backgroundColor?: string; // Make background color optional
  };
  style?: React.CSSProperties;
}

// Helper function to determine if a color is dark
const isColorDark = (hexColor: string | undefined) => {
  if (!hexColor || hexColor === '#ccc') return false; // Default light color

  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Perceptual luminance calculation
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance < 0.5; // Adjust threshold as needed
};

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  const textColor = isColorDark(data.backgroundColor) ? 'white' : 'black';

  return (
    <div
      style={{
        borderRadius: '50%', // Make it circular
        width: 80, // Set a fixed width
        height: 80, // Set a fixed height
        display: 'flex',
        flexDirection: 'column', // Allow stacking of elements
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: data.backgroundColor, // Use the background color from data
        color: textColor, // Set text color dynamically
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontSize: '10px', lineHeight: '1.2' }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
