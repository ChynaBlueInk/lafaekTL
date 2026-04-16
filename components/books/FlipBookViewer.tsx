"use client";

import HTMLFlipBook from "react-pageflip";
import { forwardRef } from "react";

type FlipBookViewerProps = {
  title: string;
  pages: string[];
};

type PageProps = {
  src: string;
  alt: string;
};

const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { src, alt },
  ref
) {
  return (
    <div
      ref={ref}
      className="flex h-full w-full items-center justify-center bg-white"
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain"
        draggable={false}
      />
    </div>
  );
});

export default function FlipBookViewer({
  title,
  pages,
}: FlipBookViewerProps) {
  return (
    <div className="flex w-full justify-center">
      <HTMLFlipBook
        width={400}
        height={560}
        size="stretch"
        minWidth={280}
        maxWidth={900}
        minHeight={400}
        maxHeight={1200}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        usePortrait={true}
        drawShadow={true}
        flippingTime={700}
        useMouseEvents={true}
        showPageCorners={true}
        disableFlipByClick={false}
        className=""
        style={{}}
        startPage={0}
        autoSize={true}
        clickEventForward={true}
        swipeDistance={30}
        startZIndex={0}
      >
        {pages.map((page, index) => (
          <Page
            key={page}
            src={page}
            alt={`${title} page ${index + 1}`}
          />
        ))}
      </HTMLFlipBook>
    </div>
  );
}