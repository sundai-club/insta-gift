# InstaGift 🎁

InstaGift is an AI-powered gift recommendation system that analyzes Instagram profiles and images to suggest personalized gifts. Using OpenAI's GPT-4 and Vision models, it provides tailored gift suggestions based on interests, age, and budget.

## Features 🌟

- Instagram profile analysis
- Image-based interest detection
- Age-appropriate gift recommendations
- Budget-conscious suggestions
- Amazon and Etsy product links
- Festive holiday theme with snowflake animations
- Responsive design

## Tech Stack 💻

- **Frontend**: Next.js 15.1, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4 and GPT-4 Vision
- **Image Processing**: Base64 encoding
- **API Integration**: Amazon and Etsy search links

## Getting Started 🚀

1. Clone the repository:

```bash
git clone https://github.com/yourusername/instagift.git
cd instagift
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Then edit `.env` with your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables 🔐

Create a `.env.example` file in the root directory:

```env
# OpenAI API Configuration
OPENAI_API_KEY=

# Optional: Instagram API (if using)
INSTAGRAM_API_KEY=

# Optional: Development Settings
NODE_ENV=development
```

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 and Vision APIs

Optional environment variables:

- `INSTAGRAM_API_KEY`: For direct Instagram API integration
- `NODE_ENV`: Development/production environment setting

## Usage 📱

1. Enter age and budget
2. Upload an Instagram grid image or provide interests
3. Submit the form
4. View personalized gift recommendations
5. Click through to Amazon or Etsy to purchase

## Project Structure 📁

```
src/
├── app/
│   ├── api/         # API routes
│   ├── gifts/       # Gift recommendation page
│   └── hidden/      # Instagram analysis features
├── components/      # Reusable components
└── utils/          # Utility functions
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License 📄

MIT License

## Acknowledgments 🙏

- OpenAI for GPT-4 and Vision APIs
- Next.js team for the framework
- Vercel for hosting capabilities
