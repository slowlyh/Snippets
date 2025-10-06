# 🚀 CodeSnippets

A modern **Code Snippet** for discovering, sharing, and reusing code snippets across your projects.  
Built with **React + TypeScript**, styled using **TailwindCSS**, and powered by **GitHub Gist** as the database.

🌐 Live Demo: [https://hyuu.tech](https://hyuu.tech)

---

## ✨ Features

- 📂 **Snippets Management**
  - List, view, and search snippets.
  - Add new snippets with title, description, language, tags, author, and code.
  - Auto-generate slug for sharing via unique URL.

- 🌓 **Theme Support**
  - Light & Dark mode toggle.
  - Persisted theme via `localStorage`.

- 🔍 **Search & Filter**
  - Search snippets instantly.
  - Filter by programming language (dynamic from available snippets).

- 💾 **GitHub Gist Integration**
  - Snippets stored and synced with GitHub Gist.
  - Metadata (`meta.json`) + code file.
  - Auto-sync with your GitHub user.

- 📱 **Responsive UI**
  - Mobile-first design with sidebar drawer menu.
  - Optimized layout for all devices.

- 🛠 **Developer Friendly**
  - Built with **Vite** for blazing fast dev server.
  - Clean modular structure.
  - Easy to extend.

---

## 📂 Project Structure

```
src/
 ├── components/       # Reusable UI components
 ├── lib/              # Utility functions & gist API integration
 ├── pages/            # Main pages (Home, AddSnippet, NotFound, etc.)
 ├── styles/           # Tailwind & global styles
 └── main.tsx          # App entrypoint
```

---

## 🔧 Tech Stack

- **Frontend**: React + TypeScript + Vite  
- **Styling**: TailwindCSS + shadcn/ui  
- **Icons**: Lucide Icons  
- **Notifications**: Sonner  
- **Database**: GitHub Gist API  

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone https://github.com/slowlyh/Snippets.git
cd Snippets
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment
Create `.env` file in project root:

```env
VITE_GIST_USER=your-github-username
VITE_GH_TOKEN=your-github-personal-access-token
```

### 4. Run Dev Server
```bash
npm run dev
```
Then open [http://localhost:8080](http://localhost:8080).

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 🔗 Links

- 🌐 Website: [https://hyuu.tech](https://hyuu.tech)  
- 💻 GitHub: [https://github.com/slowlyh](https://github.com/slowlyh)  

---

## 📜 License

MIT License © 2025 [slowlyh](https://github.com/slowlyh)