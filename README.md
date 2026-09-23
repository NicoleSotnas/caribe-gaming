# CaribeGaming

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.3.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Mercado Pago

O checkout usa o **Checkout Pro** do Mercado Pago. Essa opção oferece Pix, cartão e boleto em uma
página hospedada pelo Mercado Pago, sem que dados de cartão entrem no Angular ou no servidor da loja.

### Configuração local

1. Crie uma aplicação em [Mercado Pago Developers](https://www.mercadopago.com.br/developers/panel).
2. Copie o Access Token de teste. Ele nunca deve ser colocado em `src/` ou enviado ao navegador.
3. Gere o build e inicie o servidor SSR com as variáveis abaixo no PowerShell:

```bash
export MERCADOPAGO_ACCESS_TOKEN="TEST-seu-token"
export PUBLIC_APP_URL="http://localhost:4200"
export MERCADOPAGO_WEBHOOK_URL="https://sua-url-publica/api/mercado-pago/webhook"
npm run build
npm run serve:ssr:caribe-gaming
```

Em outro terminal, execute `npm start`. Para iniciar frontend e servidor SSR juntos, use `npm run dev`.
O proxy em `proxy.conf.json` encaminha `/api` para o servidor SSR em `http://localhost:4000`.

O botão do checkout cria uma preferência no servidor e redireciona para `init_point`. Ao voltar,
o servidor consulta o `payment_id` na API do Mercado Pago antes de limpar o carrinho.

### Produção

Configure `PUBLIC_APP_URL` com o domínio HTTPS real e use o Access Token de produção somente no
ambiente do servidor. O webhook já responde `200`, mas ainda é necessário persistir o pedido,
validar a assinatura/notificação e liberar a chave do jogo apenas quando o status recebido for
`approved`. Hoje o catálogo e o painel usam dados no cliente/mock; antes de vender de forma
definitiva, mova preços e disponibilidade para uma fonte server-side e não confie nos valores
enviados pelo navegador.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
