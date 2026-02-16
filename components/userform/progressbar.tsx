"use client";

import { Progress } from "@/components/ui/progress";

export default function ProgressDemo({Step}:{Step:number}) {
      const progress = (Step / (4)) * 100;

  return <Progress value={progress} className="w-full max-w-2xl" />;
}
