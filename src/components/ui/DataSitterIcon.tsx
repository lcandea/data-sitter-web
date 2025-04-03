import React from "react";
import DataSitterSvg from "/data-sitter.svg";

interface DataSitterIconProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

const DataSitterIcon: React.FC<DataSitterIconProps> = ({
  className = "",
  width = "24",
  height = "24",
}) => {
  return (
    <img
      src={DataSitterSvg}
      alt="Data Sitter"
      width={width}
      height={height}
      className={`inline-block ${className}`}
    />
  );
};

export default DataSitterIcon;
