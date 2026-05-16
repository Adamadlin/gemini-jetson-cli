# Gemini Jetson CLI

**Gemini Jetson CLI** is an AI-powered operations and diagnostics tool for NVIDIA Jetson devices.

It combines Jetson-native system inspection with Gemini-powered analysis to help developers diagnose, explain, monitor, and safely repair edge AI development environments.

---

## Why this project exists

NVIDIA Jetson devices are powerful, but debugging them can be painful.

Common issues include:

- CUDA installed but `nvcc` missing from `PATH`
- Docker containers not seeing NVIDIA runtime
- JetPack / L4T version confusion
- local LLM performance bottlenecks
- memory pressure on 8GB devices
- unclear TensorRT / CUDA / library state
- hard-to-read system logs

This CLI is built to act like a practical Jetson assistant in the terminal.

---

## Current features

| Command | Status | Description |
|---|---:|---|
| `jetson-ai` | ✅ | Startup banner with command overview |
| `jetson-ai doctor` | ✅ | Jetson system diagnostics |
| `jetson-ai doctor --json` | ✅ | Machine-readable diagnostics |
| `jetson-ai ask "..."` | ✅ | Ask Gemini with Jetson system context |
| `jetson-ai analyze file.log` | ✅ | Analyze logs/errors with Gemini |
| `jetson-ai analyze file.log --json` | ✅ | Structured JSON log analysis |
| `jetson-ai analyze file.log --fix` | ✅ | Map known issues to safe internal fixers |
| `jetson-ai fix cuda` | ✅ | Detect CUDA PATH issues |
| `jetson-ai fix cuda --apply` | ✅ | Safely apply CUDA PATH fix |
| `jetson-ai fix docker` | ✅ | Detect basic Docker/runtime issues |
| `jetson-ai fix docker --apply` | ✅ | Apply basic Docker permission/service fix |
| `jetson-ai monitor` | ✅ | Jetson system snapshot |
| `jetson-ai monitor --watch` | ✅ | Live refreshing monitor |
| `jetson-ai explain .` | ✅ | Explain project architecture using Gemini |

---

## Example usage

```bash
jetson-ai

jetson-ai doctor

jetson-ai doctor --json

jetson-ai ask "Why is my CUDA Docker container failing?"

jetson-ai analyze docker.log

jetson-ai analyze docker.log --json

jetson-ai analyze docker.log --fix

jetson-ai fix cuda --apply

jetson-ai monitor --watch

jetson-ai explain .

```
## Example workflow

A common Jetson issue:

```
CUDA failed because nvcc was missing from PATH
```

Analyze it :

```
jetson-ai analyze test.log --fix
```


Output:
```
Known fix detected:

Issue: CUDA nvcc not found in PATH
Recommended command: jetson-ai fix cuda --apply
Safe to automate: yes
```

Apply the safe fix:

```
jetson-ai fix cuda --apply
```


Verify:

```
jetson-ai doctor

```


## Architecture

```
gemini-jetson-cli/
├── bin/
│   └── jetson-ai.js
├── src/
│   ├── commands/
│   │   ├── analyze.js
│   │   ├── ask.js
│   │   ├── doctor.js
│   │   ├── explain.js
│   │   ├── fix.js
│   │   └── monitor.js
│   ├── core/
│   │   └── gemini.js
│   ├── ui/
│   │   └── banner.js
│   └── utils/
├── ROADMAP.md
├── package.json
└── README.md

```


## Design philosophy
This project does not blindly run AI-generated shell commands.

Instead, it follows a safer model:

```
diagnose → explain → map to known safe fix → apply only with explicit flag → verify

```

Example:

```
jetson-ai analyze error.log --fix

```

may recommend:

```
jetson-ai fix cuda --apply

```

The fix itself is deterministic and controlled by the CLI.

## Requirements

*  NVIDIA Jetson device
*  Ubuntu / JetPack environment
*  node.js 20+ 
*  npm
*  Gemini API Key
*  internet connection for Gemini-powered features
 
## installation

Clonde the repository

```
git clone https://github.com/Adamadlin/gemini-jetson-cli.git
cd gemini-jetson-cli

```
install dependencies:

```
npm install 

```

Link globally:

```
sudo npm link

```

Verify:

```
jetson-ai

```

## Environment setup

Create a local .env file:

``` 
nano .env

```

Add:

```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash

```
.env is ignored by Git and must never be committed.


## Security note

This project previously reinforced an important rule:

Never commit API keys or secrets.

The repo ignores:

```
.env
node_modules/
*.log

```

If a secret is ever exposed:

1. Revoke the key immediately
2. Remove it from Git history
3. Force-push cleaned history
4. Create a new key


## Development workflow

This project uses branch-per-feature development.

```
git checkout main
git pull
git checkout -b feature/my-feature

```

After testing:

```
git add .
git commit -m "Add my feature"
git push -u origin feature/my-feature

```

Then open a pull request into main.

Project positioning

This project demonstrates:

* edge AI systems engineering
* Jetson / ARM64 Linux tooling
* CUDA and Docker diagnostics
* Gemini API integration
* CLI product design
* safe AI-assisted repair workflows
* open-source development practices

The goal is to build a serious AI operations tool for Jetson developers, not just another AI chatbot wrapper.
