const BOT_TOKEN = "8825714603:AAESR8R8pBnmjsKzp2hmKRlmgALo75JevTs";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/getid") {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
      const data = await res.json();
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    const fileId = url.searchParams.get("id");
    if (!fileId) return new Response("Ajoute ?id=FILE_ID - Essaie /getid pour voir tes file_id", {status: 400});

    const tg = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`);
    const tgJson = await tg.json();
    if (!tgJson.ok) return new Response("File_id invalide: " + JSON.stringify(tgJson), {status: 400});

    const filePath = tgJson.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;
    
    const range = request.headers.get("Range");
    let headers = {};
    if (range) headers["Range"] = range;

    const fileRes = await fetch(fileUrl, {headers});
    return new Response(fileRes.body, {
      status: fileRes.status,
      headers: {
        "Content-Type": fileRes.headers.get("Content-Type") || "video/mp4",
        "Accept-Ranges": "bytes",
        "Content-Range": fileRes.headers.get("Content-Range") || "",
        "Content-Length": fileRes.headers.get("Content-Length") || "",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
