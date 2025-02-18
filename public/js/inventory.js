"use strict";

// Espera o DOM carregar antes de adicionar eventos
document.addEventListener("DOMContentLoaded", function () {
    // Obtém o select corretamente pelo ID
    let classificationSelect = document.querySelector("#classification");

    // Verifica se o elemento existe antes de adicionar o evento
    if (classificationSelect) {
        classificationSelect.addEventListener("change", function () { 
            let classification_id = classificationSelect.value;
            
            // Se o usuário escolheu uma classificação válida
            if (classification_id) {
                console.log(`classification_id selecionado: ${classification_id}`);
                
                // Constrói a URL com a classificação selecionada
                let classIdURL = `/inv/getInventory/${classification_id}`;
                
                // Faz a requisição para o backend
                fetch(classIdURL)
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error("Erro ao buscar dados do inventário");
                    })
                    .then(data => {
                        console.log("Dados do inventário recebidos:", data);
                        buildInventoryList(data); // Atualiza a tabela
                    })
                    .catch(error => console.error('Erro:', error));
            }
        });
    }
});

// Função para construir a tabela do inventário
function buildInventoryList(data) { 
    let inventoryDisplay = document.getElementById("inventoryDisplay");

    // Se não houver inventário, exibe uma mensagem
    if (!data || data.length === 0) {
        inventoryDisplay.innerHTML = "<p>Nenhum item encontrado.</p>";
        return;
    }

    // Criar a estrutura da tabela
    let dataTable = '<thead>'; 

    dataTable += '<tr><th style="padding: 10px;">Vehicle Name</th><th style="padding: 10px;">Modify</th><th style="padding: 10px;">Delete</th></tr>';

    dataTable += '</thead><tbody>'; 

    // Adiciona cada veículo à tabela
    data.forEach(element => {
        dataTable += `<tr>
            <td>${element.inv_make} ${element.inv_model}</td>
            <td style="text-align: center;"><a href='/inv/edit-inventory/${element.inv_id}' title='Modify'>✏️</a></td>
            <td style="text-align: center;"><a href='/inv/delete/${element.inv_id}' title='Delete'>🗑️</a></td>
        </tr>`;
    });

    dataTable += '</tbody>';
    
    // Exibe a tabela na página
    inventoryDisplay.innerHTML = dataTable;
}
