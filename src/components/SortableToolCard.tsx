"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ToolCard, Tool } from "./ToolCard";

interface SortableToolCardProps {
  tool: Tool;
  viewMode?: "grid" | "compact";
  sortableId?: string;
  isEditing?: boolean;
  onDelete?: (id: string) => void;
}

export function SortableToolCard({ tool, viewMode, sortableId, isEditing, onDelete }: SortableToolCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: sortableId || tool.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 1 : 0,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...(isEditing ? attributes : {})}
      {...(isEditing ? listeners : {})}
      className={`touch-manipulation ${isEditing ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
    >
      {/* We add pointer-events-none during drag so the link doesn't intercept drops, 
          but generally activationConstraint handles click vs drag */}
      <div className={isDragging ? "pointer-events-none" : ""}>
        <ToolCard tool={tool} viewMode={viewMode} isEditing={isEditing} onDelete={onDelete} />
      </div>
    </div>
  );
}
