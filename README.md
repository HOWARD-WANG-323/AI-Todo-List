# AI-Todo-List

This project is an AI-powered to-do list web application. It uses the OpenAI API to help you:

- Automatically prioritize tasks based on factors like due dates, priority levels, and estimated completion times.
- Suggest which task you should work on next, based on current conditions.
- Split complex tasks into multiple subtasks for better workload management.

**Note:** To fully leverage the AI capabilities, you must provide your own OpenAI API key.

# Requirements

- **OpenAI API Key**: You will need to create a `.env` file at the root of your project and specify your OpenAI API key. For example:
  ```bash
  REACT_APP_OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
