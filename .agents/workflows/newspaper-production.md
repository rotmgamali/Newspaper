---
description: How to generate the monthly 10x10 print-ready newspaper using DocRaptor and Node.js
---
# Comprehensive Instructions for Creating a 10×10 Inch 2-Tone Newspaper

This document provides complete, detailed instructions for designing and generating a 10×10 inch (254×254 mm) 2-tone newspaper suitable for production print. These instructions are designed to be followed by an AI model like Gemini 3.1 to create a monthly publication workflow.

## 1. Understanding Print Requirements for Production Print

**1.1 Page Dimensions and Bleed Specifications**
For a 10×10 inch final trim size, you should create your document at 10.25×10.25 inches (260.35×260.35 mm) when including a standard 0.125 inch (3.175 mm) bleed on all four sides. The page size in DocRaptor is set using CSS `@page` rules. You will need to specify both the page width and height including bleed, plus the margins that define the safe zone where critical content should remain (typically 0.25 to 0.5 inches inside the trim line).

**1.2 Color Mode Requirements: CMYK and Spot Colors**
Production print requires CMYK color mode. DocRaptor natively supports CMYK colors through CSS color definitions (`cmyk(x, y, z, k)`). For a 2-tone newspaper design, define colors using CMYK values that closely match specific Pantone spot colors. 

**1.3 Resolution and Image Requirements**
The standard requirement is 300 dots per inch (DPI) at final print size. For a 10×10 inch newspaper, photographs or illustrations should be at least 3000×3000 pixels at their final displayed size (or proportionally larger).

## 2. Setting Up PDF Generation (DocRaptor)
The document type should be set to pdf. Specifically for a 10x10 with bleed:
- Format the options for prince to enable `princeMarks: true`.
- Supply a structured HTML document consisting of standard `<!DOCTYPE html>` wrapped elements and embedded CSS styling. 
- API calls require `.createDoc` requests using securely stored credentials (`DOCRAPTOR_API_KEY`).

## 3. Designing the 2-Tone Newspaper in HTML and CSS
Your CSS should define your exact Spot/CMYK colors under custom properties. Use standard system print fonts (Times New Roman, Georgia, Helvetica Neue) utilizing deep scaling to fit your layout.

- **Typography & Grid:** Use `display: grid; grid-template-columns: repeat(3-5, 1fr)` or nested `columns:` parameters for print grids. Headline sizes look better scaled at 20-30pt or more, while text should be formatted densely under standard sizes (such as `7-9pt` dense printing).
- **Headers and Footers:** Build static components that act as boundaries (using absolute sizes if page-breaks dictate). Apply `page-break-inside: avoid` extensively for internal blocks/sections.

## 4. Alternate Build Methods (PrinceXML, WeasyPrint)
While DocRaptor operates through the cloud using PrinceXML, you can manually build via:
- `prince --input.html=newspaper.html --output.pdf=newspaper.pdf`
- Or using local Python `weasyprint` libraries if your system meets the GTK bindings.

## 6. Monthly Production Workflow and Best Practices
When performing monthly generation:
1. Re-aggregate text content files structured uniformly into `data` repositories (like `new-articles.js`).
2. Run standard generator scripts mapping the content dynamically to specific newspaper pages.
3. Validate typography density before generating the live PDF to prevent expensive runaway generation prints (like content leaking past exactly N-pages).

Follow these constraints rigidly for perfect print-ready output!
