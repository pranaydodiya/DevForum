
# DevForum 🚀

A modern developer community platform for real-time collaboration, code sharing, and peer learning. DevForum provides an intuitive interface for developers to discuss ideas, share code snippets, and engage with the community.

## ✨ Key Features

- **Real-time Code Playground** - Execute JavaScript code directly in the browser with Monaco Editor
- **Interactive Post Creation** - Create posts with embedded code blocks and syntax highlighting
- **Community Engagement** - Voting system, comments, and real-time discussions
- **User Authentication** - Secure login/signup system with user profiles
- **Reputation System** - Track user contributions and community standing
- **Responsive Design** - Mobile-first approach with modern UI components
- **Settings Management** - Comprehensive user settings with password-protected profile editing
- **Interactive Onboarding** - Guided tour for new users to discover platform features
- **Advanced Sidebar** - Quick actions, trending topics, and community stats
- **Post Management** - Create, edit, bookmark, and organize posts effectively

## 📸 Screenshots

*Screenshots will be added to showcase the platform's user interface and key features.*

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern JavaScript library with TypeScript
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Monaco Editor** - VS Code's editor for in-browser code editing
- **Radix UI** - Accessible UI components and primitives
- **Framer Motion** - Animation library for smooth interactions
- **React Router** - Client-side routing for single-page application

### Development Tools
- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript development
- **ESLint** - Code linting and quality assurance

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/devforum.git
   cd devforum
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application.

## 🔧 Environment Variables

The application currently runs without external environment variables. All features work with the built-in mock data and authentication system.

For production deployment, you may want to configure:

```env
# Deployment Configuration
NODE_ENV=production
```

## 🌐 Deployment

### Deploying to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings if needed

3. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Node.js Version: 18.x

4. **Deploy**
   Vercel will automatically deploy your application and provide a live URL.

## 📁 Project Structure

```
devforum/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── ui/            # Base UI components (Radix UI)
│   │   ├── playground/    # Code playground components
│   │   └── ...            # Feature-specific components
│   ├── contexts/          # React context providers
│   │   ├── AuthContext.tsx    # Authentication state
│   │   └── AppContext.tsx     # Application state
│   ├── hooks/             # Custom React hooks
│   │   ├── usePosts.ts        # Post management
│   │   └── use-toast.ts       # Toast notifications
│   ├── pages/             # Application pages/routes
│   │   ├── Index.tsx          # Home page
│   │   ├── Settings.tsx       # User settings
│   │   └── Profile.tsx        # User profiles
│   ├── lib/               # Utility functions
│   └── types/             # TypeScript type definitions
├── package.json           # Project dependencies
├── tailwind.config.ts     # Tailwind CSS configuration
├── vite.config.ts         # Vite build configuration
└── README.md             # Project documentation
```

## 🤝 Contributing

We welcome contributions from developers of all skill levels! Here's how you can help improve DevForum:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/yourusername/devforum.git
   ```
3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
4. **Make your changes** and commit them
   ```bash
   git commit -m "Add some amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** with a clear description of your changes

### Development Guidelines

- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Ensure your code works with the existing authentication system
- Test your changes thoroughly before submitting
- Update documentation as needed

### Areas for Contribution

- 🐛 Bug fixes and performance improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX design improvements
- 🧪 Test coverage expansion
- 🌐 Accessibility improvements

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape DevForum
- Built with modern React ecosystem and best practices
- Inspired by the developer community's need for better collaboration tools

## 👨‍💻 Author

**Pranay Dodiya**
- Email: [pranaydodiya2005@gmail.com](mailto:pranaydodiya2005@gmail.com)
- GitHub: [@pranaydodiya](https://github.com/pranaydodiya)

## 📞 Support

If you encounter any issues or have questions:

- 🐛 [Report bugs](https://github.com/pranaydodiya/devforum/issues)
- 💡 [Request features](https://github.com/pranaydodiya/devforum/issues)
- 📧 [Contact maintainer](mailto:pranaydodiya2005@gmail.com)

---

**Made with ❤️ by Pranay Dodiya**
