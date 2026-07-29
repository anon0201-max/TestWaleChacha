const server = Bun.serve({
  port: 3031,
  async fetch(req) {
    console.log("Request:", req.url, req.method);
    try {
      const body = await req.arrayBuffer();
      console.log("Body size:", body.byteLength);
      return Response.json({ ok: true, size: body.byteLength });
    } catch(e: any) {
      console.error("Error:", e?.message);
      return Response.json({ error: e?.message }, { status: 500 });
    }
  }
});
console.log("Listening on 3031");
setTimeout(() => process.exit(0), 15000);
