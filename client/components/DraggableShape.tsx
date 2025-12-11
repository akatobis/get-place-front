import React from "react";
import { useState } from "react";
import { Box, TextField, Typography } from "@mui/material";
import "./styles/draggable-shape.css";

interface ShapeProps {
  shape: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    title: string;
  };
  isSelected: boolean;
  onMouseDown: (
    e: React.MouseEvent<HTMLDivElement>,
    shapeId: string,
    handle?: string
  ) => void;
}

export function DraggableShape({
  shape,
  isSelected,
  onMouseDown,
}: ShapeProps) {
  const RESIZE_HANDLE_SIZE = 12;

  const [title, setTitle] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 256) {
      setTitle(e.target.value);
    }
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Box
      className={`draggable-shape ${isSelected ? "selected" : ""}`}
      sx={{
        position: "absolute",
        left: `${shape.x}px`,
        top: `${shape.y}px`,
        width: `${shape.width}px`,
        height: `${shape.height}px`,
        backgroundColor: shape.color,
        borderRadius: "20px 20px 20px 20px",
        border: isSelected ? "2px solid #1976D2" : "2px solid transparent",
        cursor: "grab",
        transition: isSelected ? "border-color 0.2s" : "none",
        boxShadow: isSelected
          ? "0 0 12px rgba(25, 118, 210, 0.4)"
          : "0 2px 8px rgba(0, 0, 0, 0.1)",
        userSelect: "none",
        "&:active": {
          cursor: "grabbing",
        },
      }}
      onMouseDown={(e) => onMouseDown(e, shape.id)}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: "4px 8px",
          maxWidth: "90%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "normal", // Allow wrapping of the text
          wordWrap: "break-word", // Word break for long words
          height: "80%", // Ensure text fits within the container
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isEditing ? (
          <TextField
            value={title}
            onChange={handleTitleChange}
            onBlur={toggleEdit}
            autoFocus
            variant="standard"
            fullWidth
            sx={{ textOverflow: "ellipsis" }}
          />
        ) : (
          <Typography variant="body2" onClick={toggleEdit} sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {title || "Enter title..."}
          </Typography>
        )}
      </Box>

      {/* Resize Handles - Only show when selected */}
      {isSelected && (
        <>
          {/* Top-left */}
          <Box
            className="resize-handle nw"
            onMouseDown={(e) => {
              e.stopPropagation();
              onMouseDown(e as React.MouseEvent<HTMLDivElement>, shape.id, "nw");
            }}
            sx={{
              position: "absolute",
              top: -RESIZE_HANDLE_SIZE / 2,
              left: -RESIZE_HANDLE_SIZE / 2,
              width: `${RESIZE_HANDLE_SIZE}px`,
              height: `${RESIZE_HANDLE_SIZE}px`,
              backgroundColor: "#1976D2",
              borderRadius: "50%",
              cursor: "nwse-resize",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          />

          {/* Top-right */}
          <Box
            className="resize-handle ne"
            onMouseDown={(e) => {
              e.stopPropagation();
              onMouseDown(e as React.MouseEvent<HTMLDivElement>, shape.id, "ne");
            }}
            sx={{
              position: "absolute",
              top: -RESIZE_HANDLE_SIZE / 2,
              right: -RESIZE_HANDLE_SIZE / 2,
              width: `${RESIZE_HANDLE_SIZE}px`,
              height: `${RESIZE_HANDLE_SIZE}px`,
              backgroundColor: "#1976D2",
              borderRadius: "50%",
              cursor: "nesw-resize",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          />

          {/* Bottom-left */}
          <Box
            className="resize-handle sw"
            onMouseDown={(e) => {
              e.stopPropagation();
              onMouseDown(e as React.MouseEvent<HTMLDivElement>, shape.id, "sw");
            }}
            sx={{
              position: "absolute",
              bottom: -RESIZE_HANDLE_SIZE / 2,
              left: -RESIZE_HANDLE_SIZE / 2,
              width: `${RESIZE_HANDLE_SIZE}px`,
              height: `${RESIZE_HANDLE_SIZE}px`,
              backgroundColor: "#1976D2",
              borderRadius: "50%",
              cursor: "nesw-resize",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          />

          {/* Bottom-right */}
          <Box
            className="resize-handle se"
            onMouseDown={(e) => {
              e.stopPropagation();
              onMouseDown(e as React.MouseEvent<HTMLDivElement>, shape.id, "se");
            }}
            sx={{
              position: "absolute",
              bottom: -RESIZE_HANDLE_SIZE / 2,
              right: -RESIZE_HANDLE_SIZE / 2,
              width: `${RESIZE_HANDLE_SIZE}px`,
              height: `${RESIZE_HANDLE_SIZE}px`,
              backgroundColor: "#1976D2",
              borderRadius: "50%",
              cursor: "se-resize",
              border: "2px solid white",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              zIndex: 1000,
            }}
          />
        </>
      )}
    </Box>
  );
}
