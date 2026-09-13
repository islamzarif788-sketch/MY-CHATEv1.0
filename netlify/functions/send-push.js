// এই ফাংশনটা Netlify-তে ফ্রি-তে চলে (কোনো Firebase বিলিং লাগে না)।
// এটাই আসল কাজটা করে: FCM-কে বলে "এই ডিভাইসে একটা নোটিফিকেশন পাঠাও"।
const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  try {
    const { token, title, body, data } = JSON.parse(event.body || "{}");
    if (!token) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "token missing" }) };
    }

    await admin.messaging().send({
      token,
      notification: { title, body },
      data: data ? Object.fromEntries(Object.entries(data).map(([k, v]) => [k, String(v)])) : {},
      webpush: {
        fcmOptions: { link: "/" },
      },
    });

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
