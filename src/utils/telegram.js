import fetch from "node-fetch";

export const sendTelegramMessage = async (message) => {
  const token = "6446356350:AAHjcUnTeO9wmVFkjBMlrLvaKqMLIUfQ5r4";
  const chatId = "@webbooks_it";
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
