from functions.completion import completion

def getQuestion(currentQuestion):
    if currentQuestion['type'] == 'quiz':
        return getQuiz(currentQuestion)
    elif currentQuestion['type'] == 'tag':
        return getTag(currentQuestion)
    elif currentQuestion['type'] == 'post':
        return getPost(currentQuestion)

def getQuiz(currentQuestion):
    prompt = ''
    prompt += "Foi elaborada uma pergunta do tipo múltipla escolha, em que os participantes escolhem uma opção dentre as alternativas apresentadas."  + "\n\n"
    prompt += "O contexto dessa pergunta é: " + currentQuestion['context'] + "\n\n"
    prompt += "A pergunta foi: " + currentQuestion['command'] + "\n\n"
    prompt += "As alternativas foram: " + "\n\n"
    for i in range(len(currentQuestion['options'])):
        v = 0
        for result in currentQuestion['results']:
            if int(result['response']) == i:
                v = int(result['responses'])
                break    

        prompt += str(i+1) + ". " + currentQuestion['options'][i] + "\n"
        prompt += " -- (Houve " + str(v) + " respostas para essa alternativa)\n\n"
    return prompt

def getTag(currentQuestion):
    prompt = ''
    prompt += "Foi elaborada uma pergunta do tipo word cloud, na qual é gerada uma imagem a partir da frequência de cada palavras respondida."  + "\n\n"
    prompt += "O contexto dessa pergunta é: " + currentQuestion['context'] + "\n\n"
    prompt += "A pergunta foi: " + currentQuestion['command'] + "\n\n"
    prompt += "As palavras escritas foram: " + "\n\n"
    for result in currentQuestion['results']:
        prompt += result['response'] + " (" + result['responses'] + "vezes)\n\n"
    prompt += "Analise as palavras, avalie as mais repetidas e tire uma conclusão geral."  + "\n\n"
    return prompt

def getPost(currentQuestion):
    prompt = ''
    prompt += "Foi elaborada uma pergunta do tipo post, na qual a plateia faz comentários livres sobre a pergunta feita."  + "\n\n"
    prompt += "O contexto dessa pergunta é: " + currentQuestion['context'] + "\n\n"
    prompt += "A pergunta foi: " + currentQuestion['command'] + "\n\n"
    prompt += "Os comentários escritos foram: " + "\n\n"
    for result in currentQuestion['results']:
        prompt += result['response'] + "\n\n"
    prompt += "Analise os comentários e tire uma conclusão geral."  + "\n\n"
    return prompt


def q_insights(body):

    questionIndex = int(body['question'])
    currentQuestion = body['questions'][questionIndex]
    
    prompt = body['context'] + "\n\n" 
    prompt += "Você irá analisar a pergunta que foi feita à plateia e deverá elaborar insights sobre as respostas. " + "\n\n" 

    prompt += getQuestion(currentQuestion)

    previousIndex = 0
    hasPrevious = False
    for previous in currentQuestion['previous']:
        if previous:
            prompt += "Ao elaborar seus insights, considere também as respostas dessa pergunta anterior, de forma a determinar alguma possível relação dessas respostas com a pergunta principal." + "\n\n"
            prompt += "Importante: ao analisar essa pergunta anterior, comente apenas o que for relevante para a pergunta principal. Se você não achar nenhum relação, não comente nada." + "\n\n"
            currentQuestion = body['questions'][previousIndex]
            prompt += getQuestion(currentQuestion)
            hasPrevious = True
        previousIndex += 1
        
    prompt += "Leia todas essas informações, reflita e aguarde." + "\n\n"
    prompt += "Com base em todas essas informações, elabore um texto contendo um parágrafo com cerca de 600 caracteres, resumindo sua impressão geral das respostas"
    if (hasPrevious): prompt += ", verificando se as respostas das perguntas anteriores influenciaram as respostas da pergunta principal" 
    prompt += ". Evite obviedades nesse parágrafo, faça comentários que realmente agreguem valor." + "\n\n"
    prompt += "Seja cauteloso nas suas respostas, evite falar mal da empresa ou da plateia como um todo, use termos mais suaves." + "\n\n"
        
        
    messages = []
    messages.append({ "role": "system", "content": prompt })
    messages.append({ "role": "system", "content": f'''Responda no formato JSON com esse padrão: {{ "comment": "texto"}}'''})
    messages.append({ "role": "user", "content": "Elabore insights das respostas da plateia conforme as instruções fornecidas." })
    
    resp = completion(messages, "gpt-4o", "", body['language'])
    
    return resp