# Carreira Sonhadora — Mapeamento Vocacional

Site estático de exploração vocacional feito com HTML5, CSS3 e JavaScript puro.

## Como executar

1. Abra a pasta `career-dreamer-pronto` no VS Code.
2. Abra `index.html` no navegador ou use a extensão Live Server.
3. Para testar a página de resultados sem backend, abra `resultado.html?exemplo`.

## Arquivos

- `index.html`: formulário de perfil.
- `resultado.html`: exibição das carreiras sugeridas.
- `css/style.css`: layout e estilos responsivos.
- `js/config.js`: endereço do endpoint da API.
- `js/app.js`: validação e envio do formulário.
- `js/resultado.js`: renderização segura do resultado.
- `js/dados-exemplo.js`: dados fictícios para teste.
- `ISSUES.md`: lista de problemas e critérios de correção.

## Configurar a API

Edite `js/config.js` e informe o endereço completo do endpoint:

```js
const CONFIG = Object.freeze({
  API_URL: "http://127.0.0.1:8000/api/career-match"
});
```

Use o endereço real fornecido pelo professor/grupo. Se `API_URL` estiver vazio, o formulário abre o modal “Tente mais tarde”. O teste de exemplo não exige API.

## Contrato da API

A página envia um `POST` com `Content-Type: application/json` e corpo semelhante a:

```json
{
  "name": "Ana Maria",
  "hobbies": ["desenhar", "jogar"],
  "interests": ["tecnologia", "design"]
}
```

A API deve retornar JSON com `user_name`, `career_identity_statement` e `recommended_careers`. Cada carreira pode conter `title`, `match_score`, `summary`, `key_skills` e `learning_path`.

## Publicar no GitHub

Crie um repositório no GitHub e envie esta pasta. Não coloque senhas, chaves privadas ou credenciais no repositório.
