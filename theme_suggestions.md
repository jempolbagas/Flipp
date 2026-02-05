# Theme Suggestions for Flipp

Given that **Flipp** is a math practice app, the design should be engaging, clear, and responsive. Since you have **Tailwind CSS v4** installed, these themes are designed to be easily implemented using Tailwind utilities.

## 1. Cyber Neon (Dark Mode)
**Vibe**: Arcade, High-Energy, Futuristic. Great for "gamifying" the math practice.
- **Background**: Deep Indigo/Black (`bg-slate-900`)
- **Primary**: Neon Cyan (`text-cyan-400`, `border-cyan-500`)
- **Secondary**: Hot Pink (`text-pink-500` for accents/errors)
- **Typography**: Monospaced "Coding" font (e.g., `Fira Code` or `Courier Prime`)
- **UI Style**: Glowing borders (`shadow-[0_0_15px_rgba(34,211,238,0.5)]`), sharp corners, high contrast.
- **Interactive**: Buttons glow brighter on hover.

## 2. Bubblegum Pop (Playful & Friendly)
**Vibe**: Fun, Approachable, Encouraging. Perfect for younger audiences or a relaxed practice session.
- **Background**: Soft Cream or Pale Blue (`bg-blue-50`)
- **Primary**: Vibrant Purple (`bg-violet-500`, `text-white`)
- **Secondary**: Soft Pink & Mint Green (`bg-pink-400`, `bg-emerald-400`)
- **Typography**: Rounded Sans-serif (e.g., `Nunito` or `Quicksand`)
- **UI Style**: Large rounded corners (`rounded-3xl`), "bouncy" buttons (transform scale effects), soft drop shadows.
- **Interactive**: Elements feel tactile and squishy.

## 3. Swiss Minimalist (Clean & Focused)
**Vibe**: Professional, Distraction-Free, "Smart". Focuses purely on the numbers.
- **Background**: White (`bg-white`)
- **Primary**: Jet Black (`text-zinc-900`)
- **Secondary**: International Orange or Swiss Red (small accents for active states)
- **Typography**: Strong, Bold Grotesque Sans (e.g., `Inter` or `Helvetica` style)
- **UI Style**: Thick black borders (`border-2 border-black`), grid layouts, large font sizes.
- **Interactive**: Sharp color inversions on hover (Black text on White -> White text on Black).

## 4. Glassmorphism (Modern & Premium)
**Vibe**: Sleek, Calm, High-Tech. specific for a "Pro" feel.
- **Background**: Mesh Gradient (flowing blend of soft blue, purple, and teal)
- **Primary**: Translucent White (`bg-white/20`, `backdrop-blur-xl`)
- **Secondary**: White text with subtle shadows.
- **Typography**: Modern Geometric Sans (e.g., `Outfit` or `Space Grotesque`)
- **UI Style**: Floating cards, frosted glass effect, 1px white borders with opacity (`border-white/30`).
- **Interactive**: Smooth layout transitions and subtle depth changes.

---
**Recommendation**:
For a "Flashcard" app, **Bubblegum Pop** is usually the most engaging for frequent use, but **Cyber Neon** has a strong "Gamer" appeal if you want to emphasize the "Streak" and "High Score" features.
