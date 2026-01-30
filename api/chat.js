export default async function handler(req, res) {
  const key = process.env.OPENAI_API_KEY;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { userQuery, userRole, history } = req.body;

    // Определяем системную роль прямо здесь (безопаснее)
    const systemInstruction = userRole === 'business'
      ? "Ты — ведущий аналитик Taipan Media. Помогаешь внедрять Телеграм-магазины. Окупаемость, автоматизация, кейсы Romantic и Кастрюлька. Стиль: Бизнес экспекрт."
      : "Ты — технический ментор Taipan Academy. Обучаешь созданию магазинов в телеграме. 6650 запросов в месяц, доход 100к с первого заказа. Стиль: мудрый наставник и мотиватор.";

    // Формируем массив для OpenAI
    const messages = [
      { role: "system", content: systemInstruction },
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
        model: "gpt-4o",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API Error:", data);
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
}
