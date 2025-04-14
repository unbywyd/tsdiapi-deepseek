# **🚀 TSDIAPI DeepSeek Plugin**

A **TSDIAPI** plugin that provides seamless integration with DeepSeek's AI models, enabling structured JSON output using [TypeBox](https://github.com/sinclairzx81/typebox) schemas and flexible chat interactions.

---

## 📦 Installation

```bash
npm install --save @tsdiapi/deepseek @sinclair/typebox
```

Then register the plugin in your **TSDIAPI** app:

```ts
import { createApp } from "@tsdiapi/server";
import createPlugin from "@tsdiapi/deepseek";

createApp({
  plugins: [
    createPlugin({
      apiKey: "your-deepseek-api-key", // Required
      model: "deepseek-chat",          // Optional (default)
    }),
  ],
});
```

---

## 🚀 Features

- 📘 **Structured JSON output** with [TypeBox](https://github.com/sinclairzx81/typebox)
- 🧠 **Model-agnostic**: Supports various DeepSeek models
- ✨ **Prompt-to-structured-object** in one call
- ⚡ **Simple chat** and **typed response** support
- 🧩 **Composable schemas** and type inference

---

## 🔧 Configuration Options

| Option   | Type     | Default         | ENV Variable      | Description                 |
|----------|----------|-----------------|-------------------|-----------------------------|
| `apiKey` | `string` | `""`            | `DEEPSEEK_API_KEY`| DeepSeek API Key _(Required)_ |
| `model`  | `string` | `"deepseek-chat"`| `DEEPSEEK_MODEL_ID` | Default DeepSeek model     |

---

## 📌 How to Use

### ✅ Structured JSON Output (via TypeBox)

```ts
import { Type } from "@sinclair/typebox";
import { useDeepSeekProvider } from "@tsdiapi/deepseek";

const UserSchema = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
});

async function run() {
  const deepseek = useDeepSeekProvider();
  const response = await deepseek.jsonDTO("Generate a user", UserSchema);
  console.log(response?.result);
}
```

> 🧠 You get a strongly typed `result` conforming to `UserSchema`, with automatic type casting (no validation errors thrown).

---

### 💬 Basic Chat Completion

```ts
import { useDeepSeekProvider } from "@tsdiapi/deepseek";

async function run() {
  const deepseek = useDeepSeekProvider();
  const response = await deepseek.chat("Tell me a dad joke.");
  console.log(response?.result);
}
```

---

### 🧾 Raw JSON Schema

You can also pass a plain JSON Schema manually:

```ts
const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
  },
  required: ["title", "description"],
};

const deepseek = useDeepSeekProvider();
const response = await deepseek.JsonString("Describe a new product", schema);
console.log(response);
```

---

## 📦 Example Response

```json
{
  "message": {
    "role": "assistant",
    "content": "{ \"name\": \"Jane\", \"email\": \"jane@example.com\" }"
  },
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 15,
    "total_tokens": 35
  },
  "result": {
    "name": "Jane",
    "email": "jane@example.com"
  }
}
```

---

## 🔌 Related Plugins

Check out more plugins in the **TSDIAPI** ecosystem:

👉 [Explore @tsdiapi plugins on npm](https://www.npmjs.com/search?q=%40tsdiapi)

---

## 👨‍💻 Contributing

Have ideas? Want to add more features? PRs and issues are welcome!

**Author:** [unbywyd](https://github.com/unbywyd)  
📧 **Contact:** unbywyd@gmail.com

---

🚀 Happy coding with **TSDIAPI DeepSeek Plugin**!