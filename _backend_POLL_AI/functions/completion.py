import os 
from openai import OpenAI

def completion(messages, model="gpt-4o-mini", temperature=1, language="pt"):
    
    if model == "": model = "gpt-4o-mini"
    if temperature == "": temperature = 1
    if language == "": language = "pt"
    
    if language == "en": 
        messages.append({ "role": "system", "content": "Write the texts in English" })
    elif language == "es":
        messages.append({ "role": "system", "content": "Escriba los textos en español" })
    elif language == "te":
        messages.append({ "role": "system", "content": "పాఠాలను తెలుగులో రాయండి" })
    
        
    client = OpenAI(api_key=os.getenv('API_KEY'))
    chat_completion = client.chat.completions.create(
        messages=messages,
        temperature=temperature,
        model=model,
        response_format={ "type": "json_object" },
    )
    resp = chat_completion.choices[0].message.content
    
    return resp