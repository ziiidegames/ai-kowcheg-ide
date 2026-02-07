# AI Kowcheg IDE

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/ziiidegames/ai-kowcheg-ide)

**Visual AI Content Generation Platform** - Create AI-powered content with visual workflows using React Flow and Ollama.

## Features

- **Visual Workflow Editor** - Drag-and-drop canvas with React Flow for building AI content pipelines
- **AI Integration** - Powered by Ollama with support for multiple models (Llama 3, Mistral, CodeLlama)
- **Frame-Based Content** - Create Image, Video, and Text frames connected in workflows
- **Live Editor** - Real-time style customization with Dev Panel
- **Modern UI** - Built with Next.js 16, React 19, shadcn/ui, and Tailwind CSS 4
- **Dark Theme** - Fully themed interface with custom React Flow styling

## Getting Started

### Prerequisites

Make sure you have [Ollama](https://ollama.ai) installed and running locally:

```bash
# Install Ollama (visit ollama.ai for instructions)
# Pull models
ollama pull llama3:8b
ollama pull mistral:7b
ollama pull codellama:13b
```

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kovcheg-project/
├── app/
│   ├── dashboard/       # Visual Workflow Editor
│   ├── api/ollama/      # Ollama API integration
│   └── globals.css      # Global styles & React Flow theming
├── components/
│   ├── dev-panel.tsx    # Live style editor
│   ├── ui/              # shadcn/ui components
│   └── app-sidebar.tsx  # Navigation sidebar
└── lib/
    └── ollama.ts        # Ollama service client
```

## How It Works

1. **Create Frames** - Add Image, Video, or Text frames to the canvas
2. **Connect Nodes** - Link frames together to build workflows
3. **Generate Content** - Select a frame, enter a prompt, choose an AI model
4. **Customize UI** - Use the Dev Panel (Settings icon) to adjust chat styles in real-time

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, shadcn/ui, Tailwind CSS 4
- **Flow Editor:** React Flow 11
- **AI:** Ollama API
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod

## Deploy on StackBlitz

This project is configured for StackBlitz deployment:

```bash
npx @stackblitz/sdk create-project ai-kowcheg --template=node --title="AI Kowcheg IDE"
```

Or fork directly on [StackBlitz](https://stackblitz.com)

## License

MIT
