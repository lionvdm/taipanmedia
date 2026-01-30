export default async function handler(req, res) {
  // 1. Проверяем ключ
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "API Key is missing on Vercel" });
  }

  // 2. Обрабатываем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Получаем данные именно в том виде, в котором их шлет твой фронтенд
    const { userQuery, userRole, history } = req.body;

    // Настраиваем системный промпт в зависимости от роли
    const systemInstruction = userRole === 'business'
      ? "Ты — аналитик Taipan Media. Помогаешь внедрять ТГ-магазины. Твой конек: ROI и цифры. Кейсы: Romantic и Кастрюлька."
      : "Ты — ментор Taipan Academy. Обучаешь созданию ТГ-магазинов без кода. Твой конек: быстрый доход и простота.";

    // Собираем массив сообщений для OpenAI
    const messages = [
      { role: "system", content: systemInstruction },
      ...(history || []), // История (уже отфильтрованная фронтендом)
      { role: "user", content: userQuery }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "gpt-4o", // или "gpt-4o-mini" для экономии
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      return res.status(response.status).json(data);
    }

    // Отправляем ответ обратно во фронтенд
    res.status(200).json(data);

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
