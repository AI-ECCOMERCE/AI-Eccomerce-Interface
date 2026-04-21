interface IconProps {
  className?: string;
}

export function ChatGPTIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:openai-icon.svg" alt="ChatGPT" className={className} />;
}

export function GeminiIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:google-gemini.svg" alt="Gemini" className={className} />;
}

export function CanvaIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/devicon:canva.svg" alt="Canva" className={className} />;
}

export function ClaudeIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:anthropic-icon.svg" alt="Claude" className={className} />;
}

export function MidjourneyIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:midjourney.svg" alt="Midjourney" className={className} />;
}

export function GitHubCopilotIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:github-copilot.svg" alt="GitHub Copilot" className={className} />;
}

export function NotionIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:notion-icon.svg" alt="Notion" className={className} />;
}

export function GrammarlyIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://api.iconify.design/logos:grammarly-icon.svg" alt="Grammarly" className={className} />;
}

export function CapCutIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://www.google.com/s2/favicons?domain=capcut.com&sz=128" alt="CapCut" className={`${className} rounded-lg object-contain`} />;
}

export function AlightMotionIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://www.google.com/s2/favicons?domain=alightmotion.com&sz=128" alt="Alight Motion" className={`${className} rounded-lg object-contain`} />;
}

export function LeonardoAIIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128" alt="Leonardo AI" className={`${className} rounded-lg object-contain`} />;
}

export function KopiKenanganIcon({ className = "w-8 h-8" }: IconProps) {
  return <img src="https://www.google.com/s2/favicons?domain=kopikenangan.com&sz=128" alt="Kopi Kenangan" className={`${className} rounded-lg object-contain`} />;
}

// Map product names to their brand icon components
export const brandIconMap: Record<string, React.FC<IconProps>> = {
  // Formal Names (Legacy Support)
  "ChatGPT Plus": ChatGPTIcon,
  "Gemini Advanced": GeminiIcon,
  "Canva Pro": CanvaIcon,
  "Claude Pro": ClaudeIcon,
  "Midjourney": MidjourneyIcon,
  "GitHub Copilot": GitHubCopilotIcon,
  "Notion AI": NotionIcon,
  "Grammarly Premium": GrammarlyIcon,
  
  // Identifier strings (Recommended)
  "openai-chatgpt": ChatGPTIcon,
  "google-gemini": GeminiIcon,
  "canva": CanvaIcon,
  "anthropic-claude": ClaudeIcon,
  "midjourney": MidjourneyIcon,
  "github-copilot": GitHubCopilotIcon,
  "notion": NotionIcon,
  "grammarly": GrammarlyIcon,
  "capcut": CapCutIcon,
  "alight-motion": AlightMotionIcon,
  "leonardo-ai": LeonardoAIIcon,
  "kopi-kenangan": KopiKenanganIcon,
  "Kopi Kenangan": KopiKenanganIcon,
};
