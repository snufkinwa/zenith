"use client"
import { Tldraw } from "@tldraw/tldraw"
import "@tldraw/tldraw/tldraw.css"

export default function ZenithCanvas() {
  return (
    <div className="h-full w-full">
      <Tldraw />
    </div>
  )
}
