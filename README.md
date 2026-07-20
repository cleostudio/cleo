# Next.js template

This is a Next.js template with shadcn/ui.

## OpenAI setup

The prompt bar uses the OpenAI Responses API with `gpt-5.6-terra`. Copy the
example environment file, then replace its value with your OpenAI API key:

```bash
cp .env.example .env.local
```

```env
OPENAI_API_KEY=your_openai_api_key
```

The API key is read only by the server-side route handler and is never exposed
to the browser.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```
