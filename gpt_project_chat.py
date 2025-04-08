import os
import argparse
import openai
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()



client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

BASE_DIR = "./interfaceSecond"
EXTENSIONS = [".js", ".jsx", ".ts", ".tsx", ".json", ".css", ".html"]

def collect_files():
    files_content = ""
    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if any(file.endswith(ext) for ext in EXTENSIONS):
                path = os.path.join(root, file)
                try:
                    with open(path, "r", encoding="utf-8") as f:
                        content = f.read()
                        files_content += f"\n\n--- FILE: {path} ---\n{content}\n"
                except Exception as e:
                    print(f"Could not read {path}: {e}")
    return files_content

def ask_gpt(prompt, context):
    chat_completion = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        messages=[
            {"role": "system", "content": "You are a senior developer helping explain and improve a React + Vite project that exports math questions in multiple formats."},
            {"role": "user", "content": f"{prompt}\n\nHere is the project code context:\n{context}"}
        ],
        temperature=0.4,
        max_tokens=2000
    )
    return chat_completion.choices[0].message.content.strip()

def main():
    print("📦 Reading your project files from `interfaceSecond/`...")
    context = collect_files()

    print("✅ Files loaded. Now enter your prompt.")
    prompt = input("💬 What would you like to ask GPT about your project?\n> ")

    print("\n⏳ Sending to GPT-4...\n")
    reply = ask_gpt(prompt, context)
    print("\n🧠 GPT-4 says:\n")
    print(reply)

if __name__ == "__main__":
    main()
