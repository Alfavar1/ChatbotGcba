const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const PORT = process.env.PORT || 3000;

const textoOrganigrama = `
Jefatura de Gobierno

Ministerio de Hacienda

Subsecretaría de Administración

Dirección General Compras

Dirección General Presupuesto

Ministerio de Salud

Subsecretaría de Atención Hospitalaria
`;

function responderJSON(res, data) {
    res.writeHead(200, {
        "Content-Type": "application/json; charset=utf-8"
    });

    res.end(JSON.stringify(data));
}

function servirArchivo(res, archivo, tipo) {

    fs.readFile(archivo, (err, contenido) => {

        if (err) {
            res.writeHead(404);
            res.end("No encontrado");
            return;
        }

        res.writeHead(200, {
            "Content-Type": tipo
        });

        res.end(contenido);
    });
}

const server = http.createServer((req, res) => {

    const parsed = url.parse(req.url, true);

    const pathname = parsed.pathname;

    if (pathname === "/") {

        return servirArchivo(
            res,
            path.join(
                __dirname,
                "public",
                "index.html"
            ),
            "text/html"
        );

    }

    if (pathname === "/style.css") {

        return servirArchivo(
            res,
            path.join(
                __dirname,
                "public",
                "style.css"
            ),
            "text/css"
        );

    }

    if (pathname === "/app.js") {

        return servirArchivo(
            res,
            path.join(
                __dirname,
                "public",
                "app.js"
            ),
            "application/javascript"
        );

    }

    if (pathname === "/buscar") {

        const q =
            (parsed.query.q || "")
            .toLowerCase()
            .trim();

        if (!q) {
            return responderJSON(
                res,
                {
                    resultados: []
                }
            );
        }

        const resultados =
            textoOrganigrama
                .split("\n")
                .map(x => x.trim())
                .filter(x => x.length > 0)
                .filter(x =>
                    x.toLowerCase().includes(q)
                );

        return responderJSON(
            res,
            {
                resultados
            }
        );
    }

    res.writeHead(404);
    res.end("No encontrado");

});

server.listen(PORT, () => {

    console.log(
        `Servidor iniciado en puerto ${PORT}`
    );

});
