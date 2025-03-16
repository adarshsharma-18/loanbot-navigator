from flask import Flask, request, jsonify
from flask_cors import CORS
from unified_assistant import UnifiedAssistant
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

assistant = UnifiedAssistant()
mistral_client = MistralClient(api_key=os.environ["MISTRAL_API_KEY"])

@app.route('/api/voice/transcribe', methods=['POST'])
def transcribe_voice():
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400

        audio_file = request.files['audio']
        language = request.form.get('language', 'en')

        # Save the uploaded file temporarily
        temp_path = 'temp_recording.wav'
        audio_file.save(temp_path)

        # Transcribe the audio
        transcript = assistant.transcribe_audio(temp_path, assistant.get_language_code(language))

        # Clean up the temporary file
        if os.path.exists(temp_path):
            os.remove(temp_path)

        if transcript:
            return jsonify({'transcript': transcript})
        return jsonify({'error': 'Transcription failed'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_id = data.get('user_id')
        conversation_id = data.get('conversation_id')
        message = data.get('message')

        if not message:
            return jsonify({'error': 'No message provided'}), 400

        # System prompt for loan advisor
        system_prompt = """You are an AI-driven loan advisory system designed to provide structured, accurate, and loan-focused assistance. Your architecture consists of specialized agents that work together to ensure efficient and reliable responses.

🔹 Primary Goals:
1️⃣ Confirm user intent before providing any loan-related advice.
2️⃣ Provide eligibility assessments based on financial details.
3️⃣ Guide users through loan applications (steps, documents).
4️⃣ Offer financial stability tips to improve loan approval chances.
5️⃣ Maintain compliance with financial regulations and offer neutral, ethical guidance."""

        # Prepare messages for Mistral AI
        messages = [
            ChatMessage(role="system", content=system_prompt),
            ChatMessage(role="user", content=message)
        ]

        # Get response from Mistral
        response = mistral_client.chat(
            model="mistral-medium",
            messages=messages
        )

        # Determine agent type based on message content
        agent_type = "intent_classifier"
        if "eligibility" in message.lower():
            agent_type = "loan_eligibility"
        elif "application" in message.lower() or "apply" in message.lower():
            agent_type = "loan_application"
        elif "improve" in message.lower() or "credit score" in message.lower():
            agent_type = "financial_literacy"

        return jsonify({
            'response': response.choices[0].message.content,
            'agent_type': agent_type
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)