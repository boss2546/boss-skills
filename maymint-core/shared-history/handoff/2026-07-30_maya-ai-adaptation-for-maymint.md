# Handoff: Adapt Maya-ai-1.2 ideas into Maymint/Hermes

## Goal

บอสต้องการเปิดแชทใหม่เพื่อ “ชำ/ศึกษา/ประยุกต์ระบบนี้” คือ repo:

- https://github.com/shaikhtaha258-maker/Maya-ai-1.2
- เว็บไซต์ demo: https://aiwithtaha.shaikhtaha258.workers.dev/maya-ai

เป้าหมายคือเอาแนวคิดจาก Maya AI มาประยุกต์กับ Maymint/Hermes ไม่ใช่ย้ายฐานจาก Hermes ไปใช้ Maya AI ทั้งดุ้น

## What Maya-ai-1.2 Is

Maya AI เป็น Python voice assistant สำหรับ macOS เป็นหลัก ใช้ wake word “Maya” แล้วสั่ง desktop automation ได้

### Repo files observed

```text
Maya-ai-1.2/
├── README.md
├── main.py
├── gif_viewer.py
├── requirements.txt
├── maya_animation.gif
└── maya_animation.html
```

### Tech stack from README/code

```text
Python
SpeechRecognition
Ollama llama3
pywhatkit
pyautogui
webbrowser
subprocess
macOS say
macOS open
macOS mdfind
```

## Capabilities Actually Seen in Code

`main.py` supports:

- wake word: “Maya”
- voice listen via `SpeechRecognition`
- speech recognition using `recognizer.recognize_google(audio, language="en-IN")`
- TTS via macOS `say`
- local LLM chat via `ollama.chat(model="llama3")`
- open apps:
  - Visual Studio Code
  - Safari
  - Google Chrome
  - WhatsApp
- open YouTube
- open folders using `mdfind`
- play songs on YouTube via `pywhatkit.playonyt`
- Google search
- YouTube search
- screenshot via `pyautogui.screenshot()`
- startup GIF animation in browser
- stop command: “stop maya”

## Important Correction

The website describes “offline processing,” but current repo code is not 100% offline because STT uses Google recognizer:

```python
recognizer.recognize_google(audio, language="en-IN")
```

Only the Ollama chat part can be local/offline if Ollama + llama3 are installed.

## Why It Matters for Maymint

Maya-ai-1.2 is useful as a reference for lightweight desktop/voice interaction patterns, especially:

- wake-word loop
- command router for local desktop actions
- macOS `say` TTS path
- app launching via `subprocess` / `open`
- simple browser/search/music commands
- screenshot capture
- visual persona/animation layer

But Maymint/Hermes should remain the main brain/orchestrator. Maya should be mined for ideas, not adopted wholesale.

## Adaptation Direction for Maymint/Hermes

Recommended direction:

1. Keep Hermes/Maymint as the actual brain and memory/orchestration layer.
2. Extract Maya-like desktop actions as small safe tools/commands.
3. Replace Google STT with Maymint’s preferred STT stack when possible.
4. Keep macOS `say` as a useful low-latency Thai-capable local fallback, with emoji stripped.
5. Add a wake/listen frontend only if it can call Hermes reliably rather than bypassing Hermes.
6. Clearly separate real capability from demo/simulation.

## Candidate Features to Port

- “Hey Maymint / Maya-style” wake/listen loop
- local app launcher
- folder finder/opening via Spotlight/mdfind
- YouTube/search/music shortcuts
- screenshot-to-Hermes analysis pipeline
- simple animated Maymint companion window
- voice reply via `say` / configured TTS

## Risks / Caveats

- Repo is small and likely demo-grade.
- STT is not offline despite website wording.
- `pyautogui` and shell actions need permission/safety boundaries.
- Desktop automation should require scoped commands and confirmation for risky actions.
- A separate assistant loop could fragment Maymint memory if it does not route through Hermes.

## Next Actions

1. Clone/inspect Maya-ai-1.2 directly if not already available locally.
2. Verify current README/code before implementing anything.
3. Create a small Maymint desktop-action adapter rather than copying Maya’s whole loop.
4. Prototype one safe command first, e.g. open app / open YouTube / take screenshot.
5. If voice is needed, connect wake/listen frontend to `hermes chat -Q` or another stable Hermes entrypoint.

## Key Links

- Repo: https://github.com/shaikhtaha258-maker/Maya-ai-1.2
- Demo: https://aiwithtaha.shaikhtaha258.workers.dev/maya-ai
