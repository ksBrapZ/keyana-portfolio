# Gallery Timeline Feature – Product Requirements Document (PRD)

## 1. Overview
We aim to build a **Timeline Gallery** that displays photo sets grouped by year (and optionally location) on our Next.js website. Each location entry will contain:
- A location name and brief description
- Camera info (camera body and lens)
- A set of images displayed in a minimal, grid-based view
- A modal for viewing images in a larger format with simple left/right navigation

We will store all images locally in our repo and maintain a single JSON file (`photos.json`) containing metadata for each location. Next.js’ built-in `<Image />` component will handle basic optimization, and we’ll deploy to Vercel.

---

## 2. Goals & Objectives
1. **Immediate Simplicity**  
   - All images and metadata kept local for easy version control.  
   - Simple JSON structure to avoid complexity with multiple files.

2. **Performance & Aesthetics**  
   - Keep images compressed to a practical size.  
   - Provide a clean, minimal layout that’s easy to navigate.

3. **Scalability**  
   - Support basic expansions (additional years, new locations) without architectural overhaul.  
   - Future-proof for potential external image hosting if scale demands.

---

## 3. Key Requirements

1. **Data Storage & Structure**  
   - **Folder Structure** in `public/images` with subfolders by year and location.  
   - **One Master JSON** (`data/photos.json`) listing each location with relevant metadata:
     - Year
     - `locationSlug` (unique identifier)
     - Title
     - Description
     - Camera & lens info
     - Array of image paths (`/images/2024/49-palms/1.jpg`, etc.)

2. **Gallery Pages**  
   - **Main Timeline Page** (`pages/gallery/index.tsx`):
     - Groups locations by year, displayed in a grid or column layout.
     - Clicking a location takes you to its detail page.  
   - **Location Detail Page** (`pages/gallery/[year]/[slug].tsx`):
     - Shows the location description, camera info, and an image grid.
     - Clicking an image opens a modal/lightbox with left/right navigation.

3. **Modal/Lightbox**  
   - Minimal design, possibly from shadcn/ui components (Dialog, Popover, etc.).
   - Arrow key or button-driven image navigation.

4. **Styling & Theming**  
   - Basic styling (e.g., grid layout).
   - Optional day/night toggle or color/bw toggle can be considered later if desired.

5. **Performance**  
   - Use `<Image />` from Next.js for responsive loading and on-the-fly optimization.
   - Pre-compress images locally to avoid large repository overhead.

---

## 4. Deliverables

1. **`photos.json`** in `data/`  
   - An array of objects, e.g.:
     ```json
     [
       {
         "year": 2024,
         "locationSlug": "49-palms",
         "title": "49 Palms",
         "description": "The Fortynine Palms Oasis Trail is a difficult out-and-back ...",
         "camera": "Fujifilm X-T4",
         "lens": "18-55mm f/2.8-4",
         "images": [
           "/images/2024/49-palms/1.jpg",
           "/images/2024/49-palms/2.jpg"
         ]
       }
     ]
     ```

2. **Directory of Compressed Images** within `public/images/[year]/[location]`.

3. **Gallery Timeline Pages**:
   - `pages/gallery/index.tsx`  
   - `pages/gallery/[year]/[slug].tsx`

4. **Modal/Lightbox Component** for larger image previews.

---

## 5. Implementation Roadmap (Suggested “Chunks”)

### Chunk 1: Folder Creation & Initial Data Definition
1. **Create the Image Folders**  
   - Under `public/images/`, create subfolders for each year (e.g., `2024`, `2023`, etc.).  
   - Within each year, create subfolders for each location slug (e.g., `49-palms`, `los-angeles`, etc.).  
2. **Add Compressed Images**  
   - Compress your images to a max width/height of ~2000–2500px.  
   - Place them in the relevant subfolders.  
3. **Set Up `photos.json`**  
   - In `data/photos.json`, add entries for each location.  
   - For each entry, define `year`, `locationSlug`, `title`, `description`, `camera`, `lens`, and an array of image paths pointing to the files you just placed in `public/images`.

### Chunk 2: Main Timeline Page
1. **Create `pages/gallery/index.tsx`**  
   - Use `getStaticProps` to import `photos.json`.  
   - Group or filter the entries by year.  
   - Render a grid or column layout with year headings and clickable cover images.

### Chunk 3: Location Detail Page
1. **Create `[year]/[slug].tsx`**  
   - Use `getStaticPaths` to generate paths from `photos.json`.  
   - Use `getStaticProps` to fetch the correct location data.  
   - Render the location’s `description`, `camera`, `lens`, and an image grid.

### Chunk 4: Modal/Lightbox
1. **Add a minimal modal** using shadcn/ui’s Dialog component:
   - Clicking a thumbnail opens the Dialog.  
   - Include “Next” and “Prev” buttons or arrow key handlers.  
   - Style it to maintain a minimal aesthetic (black background, centered image, etc.).

### Chunk 5: Final Styling & Cleanup
1. **Polish & Test**  
   - Ensure grids look good on mobile and desktop.  
   - Confirm that images load lazily (e.g., `loading="lazy"`) for performance.  
   - Verify that camera/lens info and descriptions display correctly.

---

## 6. Instructions: Creating the Image Folder (Pre-Build)
Before engaging with the Cursor agent for the build steps, **complete these tasks**:

1. **Decide on Year Folders**  
   - For each year you want in your timeline (e.g., `2021`, `2022`, `2023`, `2024`).
2. **Create Location Subfolders**  
   - For each location, create a folder in the year folder:
     ```
     public/
       images/
         2024/
           49-palms/
           los-angeles/
         2023/
           death-valley/
     ```
3. **Compress & Copy Images**  
   - Resize them locally using Squoosh, Photoshop, or another compression tool.  
   - Move them into the correct location subfolder.
4. **Fill in `data/photos.json`**  
   - For each location, create a JSON entry with:
     - `year` (Number)
     - `locationSlug` (String)
     - `title` (String)
     - `description` (String)
     - `camera` (String)
     - `lens` (String)
     - `images` (String[])  
   - Ensure `images` entries match the relative file paths exactly.

Once this is done, you’re ready to proceed with the actual code implementation in the Next.js pages, referencing the `photos.json` data and building the timeline gallery with the Cursor agent.

---

## 7. Future Considerations
- **Git LFS**  
  - If repository size becomes an issue.  
- **Dynamic Image Serving**  
  - Potentially migrating to AWS S3 or Cloudinary if image count grows large.
- **Map or Additional Metadata**  
  - Potentially add coordinates or map toggles later.
