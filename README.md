# Aspect Ratio Converter
Enter the dimensions of your image and get the simplified aspect ratio. Batch-convert whole lists, look up common social media pixel sizes, and export any of it to CSV, Excel, or straight to Google Sheets.
 
# Dimension to Ratio Converter - A Companion Tool For Graphic Design/POD
 
Welcome to the **Dimension to Ratio Converter** project! This converter was created because as a student of Graphic Design/UX/UI, I wanted to have a handy converter tool to help me determine ratios when I work with various image/project dimensions.
I added this to a repository for anyone who may need this too, customizing it to suit your specific needs.
 
## ✨ What's Inside
 
The tool is now a small dashboard with four tabs:
 
- **Ratio Converter** — enter width/height (or upload an image to auto-fill them), pick from resolution presets, and get the simplified ratio, decimal ratio, closest common-name match, a visual proportion box, and estimated megapixels/file size. Includes a PPI/DPI converter for switching between pixels and inches.
- **Batch Converter** — paste a list of dimensions (one `widthxheight` per line) and convert them all at once into a results table.
- **Social Media Sizes** — a reference table of common pixel sizes for Instagram, Facebook, X/Twitter, LinkedIn, YouTube, and Pinterest. Sizes shared across platforms (like the 1080×1080 square used by several apps) are combined into a single row to keep the table short — search or filter by platform to narrow it down.
- **History** — saved conversions persist in your browser (via `localStorage`) so you can reload a past ratio without retyping it.
Any table in the dashboard (batch results or social sizes) can be exported as:
- **CSV** — opens in Excel, Numbers, Sheets, anything
- **XLSX** — a real Excel workbook, generated client-side (no server, no account needed)
- **Copy for Google Sheets** — copies tab-separated data to your clipboard so you can paste it directly into an open sheet
## 🎯 Who Is This For?
- Graphic designers.
- UX/UI enthusiasts.
- POD (Print On Demand) creators.
- Social media managers and content creators who need quick size references.
- Anyone who loves combining creativity with coding!
If you've been looking for a different kind of graphics converter, are excited about learning, or want to build something cool, this is the perfect place to start!
 
## 🔧 How To Use This Template
1. Clone or fork this repository to your own GitHub.
2. Open `index.html` in a browser — no build step or install required.
3. Explore the files and customize the design to your heart's content.
4. Try tweaking the code to see how it works. Can you create any cool skins?
5. Share your creativity and improvements with us!
## 🗂️ File Structure
```
index.html        → dashboard markup (tabs, forms, tables)
css/styles.css     → color system, layout, and component styles (commented by section)
js/script.js       → tab logic, converter math, social sizes data, and export functions (commented by section)
```
 
Each file is organized with clearly marked `SECTION` comments, so if you want to add a platform to the social sizes table, tweak the color palette, or add a new tab, you should be able to find the right spot quickly — collaborators welcome.
 
## ♿ Accessibility Notes
This build follows the ARIA tabs pattern (keyboard arrow navigation between tabs), pairs every form error with its input via `aria-describedby`, and uses `aria-live` regions so screen readers announce calculated results and export status. If you extend it, try to keep those patterns intact.

## Before

<img width="1866" height="1254" alt="Image Ratio Converter original -  iot-ntech com" src="https://github.com/user-attachments/assets/aeca030b-756a-47e9-a959-6aa40345248e" />

## After
<img width="1866" height="1557" alt="Image Ratio Converter redesigned 8 15 26 - Design   Social Sizing Dashboard_ -  lesherron github io" src="https://github.com/user-attachments/assets/c94d9afb-7c86-4f88-ab9c-ee6a59cf01f3" />

 
## 🤝 Join Us!
Learning to code can be intimidating at first, but you're not alone! I created this project to foster an encouraging and supportive environment for programmers of all levels. Let's inspire and learn from each other.
 
Feel free to reach out with your feedback or questions.
 
## 💡 Let's Connect
If you'd like to contribute, collaborate, or just chat, you can find me here:
- GitHub: [Les Herron](https://github.com/lesherron)
---
 
Thank you for stopping by, and I can't wait to see what you'll create!
