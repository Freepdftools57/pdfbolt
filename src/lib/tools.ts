export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  color: string;
  seoTitle: string;
  seoDescription: string;
}

export const tools: Tool[] = [
  {
    id: "merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one document",
    icon: "M12 4v16m-8-8h16",
    href: "/merge",
    color: "text-blue-400",
    seoTitle: "Merge PDF Files Online — Free & Private",
    seoDescription:
      "Merge multiple PDF files into one document for free. Files are processed in your browser and never uploaded to any server.",
  },
  {
    id: "split",
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple files",
    icon: "M8 7h12M8 12h12m-12 5h12M4 7h.01M4 12h.01M4 17h.01",
    href: "/split",
    color: "text-purple-400",
    seoTitle: "Split PDF Online — Free & Private",
    seoDescription:
      "Split PDF files by page ranges or extract individual pages. 100% free, processed entirely in your browser.",
  },
  {
    id: "compress",
    name: "Compress PDF",
    description: "Reduce PDF file size while keeping quality",
    icon: "M19 14l-7 7m0 0l-7-7m7 7V3",
    href: "/compress",
    color: "text-green-400",
    seoTitle: "Compress PDF Online — Free & Private",
    seoDescription:
      "Compress and reduce PDF file size for free. All processing happens in your browser — your files stay private.",
  },
  {
    id: "pdf-to-images",
    name: "PDF to Images",
    description: "Convert PDF pages to PNG or JPG images",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    href: "/pdf-to-images",
    color: "text-orange-400",
    seoTitle: "PDF to Image Converter — Free & Private",
    seoDescription:
      "Convert PDF pages to high-quality PNG or JPG images. Free online tool — files never leave your browser.",
  },
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    description: "Convert JPG, PNG, or WebP images into a PDF",
    icon: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    href: "/images-to-pdf",
    color: "text-pink-400",
    seoTitle: "Images to PDF Converter — Free & Private",
    seoDescription:
      "Convert JPG, PNG, or WebP images to PDF for free. Arrange pages, choose size — all in your browser.",
  },
  {
    id: "rotate",
    name: "Rotate PDF",
    description: "Rotate PDF pages by 90°, 180°, or 270°",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
    href: "/rotate",
    color: "text-cyan-400",
    seoTitle: "Rotate PDF Pages Online — Free & Private",
    seoDescription:
      "Rotate PDF pages online for free. Rotate individual pages or all pages at once. 100% browser-based.",
  },
  {
    id: "watermark",
    name: "Watermark PDF",
    description: "Add text watermarks to your PDF pages",
    icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z",
    href: "/watermark",
    color: "text-yellow-400",
    seoTitle: "Add Watermark to PDF — Free & Private",
    seoDescription:
      "Add text watermarks to PDF pages for free. Customize text, size, color, and opacity. 100% browser-based.",
  },
  {
    id: "page-numbers",
    name: "Page Numbers",
    description: "Add page numbers to your PDF document",
    icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    href: "/page-numbers",
    color: "text-teal-400",
    seoTitle: "Add Page Numbers to PDF — Free & Private",
    seoDescription:
      "Add page numbers to PDF documents for free. Choose position, format, and starting number. All in your browser.",
  },
  {
    id: "protect",
    name: "Protect PDF",
    description: "Add password protection to your PDF",
    icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    href: "/protect",
    color: "text-red-400",
    seoTitle: "Password Protect PDF — Free & Private",
    seoDescription:
      "Add password protection to PDF files for free. Encrypt your documents directly in your browser.",
  },
];
