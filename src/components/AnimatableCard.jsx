// src/components/AnimatableCard.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Tarjeta que puede ser animada con AnimateOnScroll
 */
export function AnimatableCard({ children, className, background, ...props }) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-all duration-300 hover:shadow-xl border-0",
        className
      )}
      style={background ? { backgroundColor: background } : {}}
      {...props}
    >
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}

export default AnimatableCard;
