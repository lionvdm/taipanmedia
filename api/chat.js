export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;

  try {
    // 1. Берем именно те поля, которые шлет фронтенд
    const { userQuery, userRole, history } = req.body;

    // 2. Сами собираем массив сообщений
    const messages = [
      { 
        role: "system", 
        content: userRole === 'business' ? "Ты аналитик Taipan Media..." : "Ты ментор Taipan Academy..." 
      },
      ...(history || []).map(msg => ({ role: msg.role, content: msg.content })),
      { role: "user", content: userQuery }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Поставь mini для теста, он быстрее и дешевле
        messages: messages,
        temperature: 0.7
      })
    });

    const data = await response.json();
    
    // Возвращаем ответ в формате OpenAI
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
