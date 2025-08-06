const AiTastAnalyzer = async (vendorSpeech: string): Promise<string> => {
  // }
  //  include a typical order data details...

  // const { data: orderData } = await supabase
  //   .from("orders_demo")
  //   .select("*")
  //   .order("id", { ascending: false })
  //   .limit(1);
  // const latestOrder = orderData?.[0];
  // const latestOrderId = latestOrder?.id || "unknown";
  // const latestTableNo = latestOrder?.table_no || "unknown";

  // console.log("Sample Order data inside prompt: ", orderData);

  const prompt = `
You are a restaurant assistant AI. A vendor is speaking to perform a task related to order management, menu updates, system status, or customer messaging.

Their request may be fuzzy or unclear. Your job is to:
1. Understand what task the vendor is trying to perform.
2. Choose the **closest match** from the fixed list of tasks.
3. Return the response in this exact format only:
   "task_number, argument(s separated by commas)"

If nothing matches, return: "99, invalid request"

---

Tasks:

1. Fetch latest orders (default = 1 if not specified)
2. Fetch/repeat order based on table number
3. Fetch/repeat order based on order ID
4. Update status of an order (e.g., completed, in_progress, rejected) - args(order_id, status)
5. Fetch orders by status (e.g., completed, pending)
6. Fetch orders placed within the last X days (default = 1)
7. Set order-taking status (e.g., turn off or resume accepting orders) - args(on or off)
8. Update a menu item (e.g., mark item unavailable, update price, etc.) - args(menu_id/name, menu_column/field, value)
99. Invalid or unsupported request

---

Important:
- Do not ask questions or explain anything.
- Do not format as JSON or use markdown.
- Do not return extra text. Only return: "task_number, argument(s)"
- Always prefer the most likely task even if input is not perfect.

---
Now here is what the vendor said "${vendorSpeech}"
`;

  let res = await fetch(
    "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=AIzaSyAAMHq19wcMbUisIfI5kevRwtygG1KTtl0",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    res = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=AIzaSyCEcM8IhcRWXinYkgcqL29wQbcRRT_O0VI",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
  }

  const result = await res.json();
  console.log(result);
  const text =
    result?.candidates?.[0]?.content?.parts?.[0]?.text || "99, invalid request";

  return text;
};

export default AiTastAnalyzer;
