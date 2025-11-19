import { Handle, Position } from 'reactflow';
import React from 'react';

interface DataFlowNodeProps {
  data: {
    label: string;
    type: 'task' | 'dependency' | 'resource';
  };
}

const DataFlowNode: React.FC<DataFlowNodeProps> = ({ data }) => {
  const style: React.CSSProperties = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const labelStyle: React.CSSProperties = {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%', // Ensure the label takes full width of its container
  };

  if (data.type === 'task') {
    style.backgroundColor = '#a855f7'; // Purple
    style.color = 'white';
    style.width = 150;
    style.height = 50;
  } else if (data.type === 'dependency') {
    style.backgroundColor = '#93c5fd'; // Blue
    style.width = 80;
    style.height = 40;
  } else if (data.type === 'resource') {
    style.backgroundColor = '#86efac'; // Green
    style.width = 150;
    style.height = 50;
  }

  return (
    <div style={style}>
      <Handle type="target" position={Position.Left} />
      <div style={labelStyle}>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default DataFlowNode;
