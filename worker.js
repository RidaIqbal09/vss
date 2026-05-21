export default {

    async fetch(request, env) {

        const url = new URL(request.url);

        // CORS

        const headers = {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { headers });
        }

        // ADD USER

        if (url.pathname === "/add" && request.method === "POST") {

            const body = await request.json();

            const name = body.name;

            const email = body.email;

            await env.DB.prepare(
                "INSERT INTO users (name, email) VALUES (?, ?)"
            )
            .bind(name, email)
            .run();

            return new Response(
                JSON.stringify({
                    message:"User Added"
                }),
                {
                    headers
                }
            );
        }

        // GET USERS

        if (url.pathname === "/users") {

            const { results } = await env.DB.prepare(
                "SELECT * FROM users"
            ).all();

            return new Response(
                JSON.stringify(results),
                {
                    headers
                }
            );
        }

        return new Response("Worker Running");

    }
}