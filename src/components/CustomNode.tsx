import { Handle, Position } from 'reactflow';
import React from 'react';

interface CustomNodeProps {
  data: {
    label: string;
  };
  style?: React.CSSProperties;
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        borderRadius: '50%', // Make it circular
        width: 80, // Set a fixed width
        height: 80, // Set a fixed height
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #ccc',
        padding: '10px',
        textAlign: 'center',
        backgroundColor: data.backgroundColor, // Use the background color from data
      }}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ fontSize: '10px' }}>{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
