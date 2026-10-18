export default {
 async fetch(req) {
  const id = new URL(req.url).searchParams.get("id");
  if(!id) return new Response("Guiflix OK - ajoute ?id=FILE_ID");
  const TOKEN = "8825714603:AAESR8pBnmjsKzp2hmKRlmgALo75JevTs";
  const api = await fetch(`https://api.telegram.org/bot${TOKEN}/getFile?file_id=${id}`);
  const data = await api.json();
  if(!data.ok) return new Response("Fichier non trouve", {status:404});
  const finalUrl = `https://api.telegram.org/file/bot${TOKEN}/${data.result.file_path}`;
  const video = await fetch(finalUrl);
  return new Response(video.body, {
    headers: {
      "Content-Type": "video/mp4",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600"
    }
  });
 }
}
