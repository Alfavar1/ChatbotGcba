const btnBuscar =
    document.getElementById("btnBuscar");

const txtBuscar =
    document.getElementById("txtBuscar");

const resultados =
    document.getElementById("resultados");

btnBuscar.addEventListener(
    "click",
    buscar
);

txtBuscar.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            buscar();
        }

    }
);

async function buscar() {

    const q =
        txtBuscar.value.trim();

    if (!q) {

        resultados.innerHTML = `
            <div class="item">
                Ingrese un término de búsqueda.
            </div>
        `;

        return;
    }

    try {

        resultados.innerHTML = `
            <div class="item">
                Buscando...
            </div>
        `;

        const response =
            await fetch(
                "/buscar?q=" +
                encodeURIComponent(q)
            );

        const data =
            await response.json();

        resultados.innerHTML = "";

        if (
            !data.resultados ||
            data.resultados.length === 0
        ) {

            resultados.innerHTML = `
                <div class="item">
                    No se encontraron resultados.
                </div>
            `;

            return;
        }

        data.resultados.forEach(
            item => {

                const div =
                    document.createElement("div");

                div.className = "item";

                div.textContent = item;

                resultados.appendChild(div);

            }
        );

    } catch (error) {

        console.error(error);

        resultados.innerHTML = `
            <div class="item">
                Error al realizar la búsqueda.
            </div>
        `;
    }
}
