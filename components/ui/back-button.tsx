"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCanGoBack(window.history.length > 1);
    }
  }, []);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  // Show back button only on detail pages we "sense" need it:
  // /assignments/[id], /courses/[id], /forum/[id], /learning-rooms/[id], /library/[id], /quizzes/[id]
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  const detailRoots = new Set([
    "assignments",
    "courses",
    "forum",
    "library",
    "quizzes",
    "assignments",
  ]);
  const isDetailPage =
    (segments.length >= 2 && detailRoots.has(segments[0])) ||
    pathname === "/library" ||
    pathname === "/forum";
  const isDashboard = pathname?.startsWith("/dashboard");

  if (!isDetailPage || isDashboard) return null;

  return (
    <div className="fixed top-4 left-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        aria-label="Go back"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
    </div>
  );
}
