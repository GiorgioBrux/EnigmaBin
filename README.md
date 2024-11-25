# EnigmaBin

[![SvelteKit](https://img.shields.io/badge/Built_with-SvelteKit-FF3E00?logo=svelte)](https://kit.svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
![Development Status](https://img.shields.io/badge/Status-Development_Preview-yellow)

EnigmaBin is a secure, privacy-focused pastebin service built with flexible end-to-end encryption options. Share code and text securely without compromising on privacy or usability.

## Features

- **End-to-End Encryption**: All content is encrypted in your browser before being sent to the server
- **Flexible Security Options**:
  - Fast classical encryption using X25519
  - Enhanced quantum-resistant protection using dual-layer ML-KEM + X25519
- **Zero-Knowledge Architecture**: We never have access to your unencrypted data
- **Automatic Expiration**: Set custom expiration times for your pastes
- **Burn on View**: Optional self-destruct feature for one-time viewing
- **Syntax Highlighting**: Support for multiple programming languages using Monaco Editor
- **No Account Required**: Just paste and share

## Technology Stack

- 🔧 **Framework**: SvelteKit with TypeScript
- 🎨 **Styling**: TailwindCSS + shadcn-svelte
- 🔒 **Encryption**: libsodium-wrappers + ML-KEM
- 📝 **Editor**: Monaco Editor
- 🗄️ **Database**: PostgreSQL with Prisma ORM
- 🚀 **Deployment**: Vercel


## Security Features

- **X25519**: Default classical encryption
- **ML-KEM**: Optional quantum-resistant layer
- **ChaCha20**: Symmetric encryption
- **Poly1305**: Authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.