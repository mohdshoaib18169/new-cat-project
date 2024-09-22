import React from "react";
import { useDrop } from "react-dnd";
import { acceptedDropableItems as ADI } from "../../constants";

const DropZone = ({ data, onDrop, isLast, className, canDrop, acceptableDropItems }) => {
  const [{ isOver }, drop] = useDrop({
    accept: acceptableDropItems ? acceptableDropItems : ADI,
    drop: (item, monitor) => {
      onDrop(data, item);
    },
    canDrop: () => {
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  });
  const isActive = isOver;
  return (
    <div className={`dropZone h-1 rounded ${isActive ? 'active my-1' : ""} ${className}`}
      ref={drop}
    />
  );
};

export default DropZone;
