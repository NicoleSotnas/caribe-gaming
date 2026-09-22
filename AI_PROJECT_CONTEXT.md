# CARIBE GAMING — AI PROJECT CONTEXT

> Snapshot auditado em 2026-09-21/22, a partir do estado presente no workspace `/home/venus/caribe/caribe-gaming`. Este documento foi criado sem alterar o código existente. Quando a evidência não está no repositório, o valor é `NÃO CONFIRMADO`.

## 1. Project Overview

- **Nome:** `caribe-gaming` no `package.json`; a marca exibida é Caribe Gaming / Caribe's Gaming.
- **Descrição encontrada:** loja/catalogo de jogos digitais com autenticação, favoritos, carrinho, checkout hospedado no Mercado Pago e área administrativa.
- **Objetivo do sistema:** apresentar um catálogo hard-coded de jogos, permitir cadastro/login, favoritos, carrinho e iniciar pagamentos pelo Mercado Pago Checkout Pro.
- **Tipo:** aplicação web Angular com SSR Angular/Node/Express.
- **Frontend:** Angular standalone components, Angular Router, Reactive Forms, Signals, RxJS, Angular Material/CDK e PrimeNG.
- **Backend:** servidor SSR Angular Node com Express 5 e endpoints HTTP locais para Mercado Pago.
- **Banco de dados:** Supabase Auth/`profiles` é referenciado; não há schema/migrations no repositório. O carrinho também referencia Firestore, mas essa integração está inconsistente e não compila no estado atual.
- **Arquitetura:** frontend standalone + services/facades/guards; SSR via `src/server.ts`; catálogo em memória; pagamento server-side.
- **Ambiente de desenvolvimento:** npm, Angular CLI, Vite/Vitest, proxy `/api` para `http://localhost:4000`.
- **Produção/deploy:** há configuração `vercel.json` e build SSR. Ambiente de produção efetivamente validado: `NÃO CONFIRMADO`.
- **Estado de compilação auditado:** falha em `npm run build` por imports `@angular/fire/*` não resolvidos e `environment.firebase` inexistente.

## 2. Technology Stack

| Categoria | Tecnologia | Versão declarada | Onde foi confirmada | Observações |
|---|---|---:|---|---|
| Frontend | Angular | `^22.1.0` a `^22.1.3` | `package.json`, `angular.json` | Angular standalone/SSR |
| CLI/build | Angular CLI / `@angular/build` | `^22.1.3` | `package.json` | Builder application, dev-server e unit-test |
| Linguagem | TypeScript | `~6.0.2` | `package.json`, lockfile | Build auditado com compiler Angular |
| Runtime | Node.js | `NÃO CONFIRMADO` | Não há versão fixa no projeto | `@types/node` é `^20.17.19`; isso não confirma runtime |
| Gerenciador | npm | `11.13.0` | `package.json` `packageManager` | README usa `npm.cmd`, mas o ambiente auditado é Linux |
| SSR/backend | Express | `^5.1.0` | `package.json`, `src/server.ts` | Servidor SSR Angular Node |
| SSR | `@angular/ssr` | `^22.1.3` | `package.json` | `outputMode: server` |
| Reatividade | RxJS | `~7.8.0` | `package.json` | Observables e interop com Signals |
| Auth/backend cloud | Supabase JS | `^2.116.0` | `package.json`, `supabase.service.ts` | Auth e consulta de `profiles` |
| Auth/data legado | AngularFire/Firebase | lockfile: `^20.0.1` / `^12.18.0` | `package-lock.json`, imports-fonte | Ausentes de `package.json`; imports não resolvem no build |
| UI | Angular Material/CDK | `^22.1.2` | `package.json` | Material button e CDK |
| UI | PrimeNG/PrimeIcons | `^22.1.0` / `^8.0.0` | `package.json` | Admin usa `ButtonModule` |
| Pagamento | Mercado Pago | `^3.6.1` | `package.json` | Código usa `fetch` diretamente, não o SDK declarado |
| API de jogos | RAWG HTTP API | versão da API: `NÃO CONFIRMADO` | `rawg.service.ts` | Chave está hard-coded no frontend; valor redigido |
| Imagens | Steam Store CDN Cloudflare | `NÃO APLICÁVEL` | `produtos.service.ts` e detalhes | Só imagens por App ID; sem Steam Web API |
| Testes | Vitest | `^4.1.11` | `package.json`, `vitest.config.ts` | 35 arquivos `*.spec.ts` |
| Testes Angular | `@testing-library/angular` | `^19.4.2` | `package.json` | Uso deve ser confirmado por arquivo individual |
| Test DOM | jsdom | `^28.1.0` | `package.json`, `vitest.config.ts` | Ambiente dos testes |
| Build plugin | `@analogjs/vite-plugin-angular` | `^2.7.2` | `package.json`, `vitest.config.ts` | Plugin do Vitest |
| Formatter | Prettier | `^3.8.1` | `package.json`, `.prettierrc` | Não há script de format no package.json |
| Lint | `NÃO ENCONTRADO` | — | Nenhuma configuração/script | Não há ESLint identificado |
| Git | Git | versão `NÃO CONFIRMADA` | `.git`, comandos Git executados | Branch e commits registrados na seção 37 |

## 3. Versions

As versões declaradas estão em `package.json`; o lockfile é `lockfileVersion: 3`. O pacote do projeto é `0.0.0`. Angular packages estão na linha 22.1.x; TypeScript é `~6.0.2`; Vitest é `^4.1.11`; npm requerido pelo manifesto é `11.13.0`. A versão efetiva do Node.js, do Angular CLI instalado fora do lockfile e de serviços externos é `NÃO CONFIRMADO`.

Conflito relevante: `package-lock.json` contém `@angular/fire` `^20.0.1` e `firebase` `^12.18.0` no pacote raiz, mas `package.json` não contém esses pacotes. Os imports correspondentes estão em `app.config.ts` e `carrinho.facade.ts`.

## 4. Dependencies

### dependencies

| Pacote | Versão declarada | Finalidade identificada |
|---|---:|---|
| `@angular/animations` | `^22.1.2` | Animações Angular |
| `@angular/cdk` | `^22.1.2` | Componentes/utilitários CDK |
| `@angular/common` | `^22.1.0` | APIs comuns Angular |
| `@angular/compiler` | `^22.1.0` | Compilação Angular |
| `@angular/core` | `^22.1.0` | Runtime Angular |
| `@angular/forms` | `^22.1.0` | Reactive Forms |
| `@angular/material` | `^22.1.2` | UI Material |
| `@angular/platform-browser` | `^22.1.0` | Renderização browser |
| `@angular/platform-server` | `^22.1.0` | Renderização server |
| `@angular/router` | `^22.1.0` | Rotas |
| `@angular/ssr` | `^22.1.3` | SSR |
| `@supabase/supabase-js` | `^2.116.0` | Cliente Supabase/Auth/queries |
| `express` | `^5.1.0` | HTTP server e SSR handler |
| `mercadopago` | `^3.6.1` | SDK declarado para pagamento, não usado diretamente no servidor auditado |
| `primeicons` | `^8.0.0` | Ícones PrimeNG |
| `primeng` | `^22.1.0` | UI PrimeNG |
| `rxjs` | `~7.8.0` | Observables |
| `tslib` | `^2.3.0` | Helpers TypeScript |

### devDependencies

| Pacote | Versão declarada | Finalidade identificada |
|---|---:|---|
| `@analogjs/vite-plugin-angular` | `^2.7.2` | Plugin Angular para Vite/Vitest |
| `@angular/build` | `^22.1.3` | Builder Angular |
| `@angular/cli` | `^22.1.3` | CLI |
| `@angular/compiler-cli` | `^22.1.0` | Compiler CLI |
| `@testing-library/angular` | `^19.4.2` | Testes Angular |
| `@testing-library/dom` | `^10.4.1` | Testes DOM |
| `@testing-library/user-event` | `^14.6.7` | Eventos de usuário em testes |
| `@types/express` | `^5.0.1` | Tipos Express |
| `@types/node` | `^20.17.19` | Tipos Node |
| `@vitest/coverage-v8` | `^5.0.0` | Cobertura Vitest |
| `jsdom` | `^28.1.0` | DOM de teste |
| `prettier` | `^3.8.1` | Formatter |
| `typescript` | `~6.0.2` | Linguagem/compiler |
| `vitest` | `^4.1.11` | Test runner |

Pacotes presentes somente no lockfile raiz, mas não no manifesto atual: `@angular/fire` e `firebase`. Não foram confirmadas dependências para PostgreSQL direto, ViaCEP, Steam API, Firebase declarativo no `package.json`, ESLint ou Prettier via script.

## 5. Scripts

| Script | Comando | Finalidade |
|---|---|---|
| `ng` | `ng` | Executa a CLI Angular |
| `start` | `ng serve --proxy-config proxy.conf.json` | Servidor de desenvolvimento com proxy `/api` |
| `build` | `ng build` | Build Angular/SSR, configuração padrão production |
| `watch` | `ng build --watch --configuration development` | Build incremental de desenvolvimento |
| `test` | `vitest run` | Executa testes uma vez |
| `test:watch` | `vitest` | Executa Vitest em modo watch |
| `serve:ssr:caribe-gaming` | `node dist/caribe-gaming/server/server.mjs` | Serve o bundle SSR gerado |

Não existem scripts `lint`, `format`, `e2e`, `supabase` ou `edge functions` no `package.json`. O README menciona `ng e2e`, mas esse script não existe e nenhum framework E2E foi encontrado.

## 6. Repository Structure

```text
caribe-gaming/
├── angular.json
├── package.json
├── package-lock.json
├── README.md
├── proxy.conf.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.spec.json
├── vitest.config.ts
├── vercel.json
├── mcp.json
├── .editorconfig
├── .gitignore
├── .npmrc
├── .prettierrc
├── .vscode/
│   ├── extensions.json
│   ├── launch.json
│   └── tasks.json
├── docs/                         # existe; conteúdo relevante não confirmado
├── public/
│   ├── favicon.ico
│   ├── logo-caribes.ico
│   └── img/                      # imagens locais de marca/equipe/interface
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── main.server.ts
│   ├── server.ts
│   ├── server/catalogo-precos.ts
│   ├── styles.css
│   ├── material-theme.scss
│   ├── test.ts
│   ├── environments/environment.ts
│   └── app/
│       ├── app.ts, app.html, app.css
│       ├── app.config.ts, app.config.server.ts
│       ├── app.routes.ts, app.routes.server.ts
│       ├── core/facades/
│       ├── core/guards/
│       ├── core/models/
│       ├── core/services/
│       ├── features/admin/
│       ├── features/carrinho/
│       ├── features/checkout/checkout/
│       ├── features/login/
│       ├── features/perfil/
│       ├── features/produtos/       # catálogo + 20 detalhes hard-coded
│       ├── features/sobrenos/
│       ├── home/home/
│       └── shared/header/ e shared/footer/
```

Há 92 arquivos `.ts`, 34 `.html`, 34 `.css` e 35 `*.spec.ts` sob `src`. A árvore acima agrupa arquivos repetitivos; os nomes concretos constam no workspace. Foram propositalmente omitidos `node_modules/`, `dist/`, `.angular/cache/` e `.git/` por serem dependências instaladas, artefatos gerados/cache e metadados internos. Também não foram reproduzidas imagens binárias nem mapas gerados.

Não existe no repositório uma pasta `supabase/`, migrations, `functions/`, `sql/` ou Edge Functions.

## 7. Configuration

| Arquivo | Finalidade | Impacto |
|---|---|---|
| `package.json` | Manifesto, scripts e dependências | Define instalação e comandos oficiais |
| `package-lock.json` | Lock npm v3 | Registra versões resolvidas e conflito Firebase extra |
| `angular.json` | Projeto/build/serve/test Angular | Configura SSR, assets, estilos, budgets e builders |
| `tsconfig.json` | Opções TypeScript base | Target ES2022, strict injection e checks de fluxo |
| `tsconfig.app.json` | Compilação da aplicação | Inclui `src/**/*.ts`, exclui specs |
| `tsconfig.spec.json` | Compilação de testes | Inclui specs e tipos Vitest |
| `vitest.config.ts` | Runner, plugin e ambiente de testes | `jsdom`, globals, `src/**/*.spec.ts` |
| `proxy.conf.json` | Proxy de desenvolvimento | Encaminha `/api` para `http://localhost:4000` |
| `src/environments/environment.ts` | URL/key pública Supabase e production flag | Alimenta `SupabaseService`; chave foi redigida neste documento |
| `src/app/app.config.ts` | Providers da aplicação | Configura router, hydration, HttpClient e imports Firebase quebrados |
| `src/app/app.config.server.ts` | Providers SSR | Mescla config browser com server rendering |
| `src/app/app.routes.ts` | Rotas client | Define acesso público/auth/admin e wildcard |
| `src/app/app.routes.server.ts` | Rotas SSR | Tem `jogos/:id` duplicada |
| `.prettierrc` | Formatação | largura 100, single quote e parser Angular para HTML |
| `.editorconfig` | Editor | UTF-8, espaços de 2, newline final |
| `.gitignore` | Exclusões Git | Ignora builds, dependências, cache e `.env` |
| `vercel.json` | Rewrite deploy | Reescreve qualquer path para `/index.html`; compatibilidade com SSR não confirmada |
| `mcp.json` | Configuração MCP local | Endpoint HTTP Mercado Pago MCP |
| `.vscode/launch.json` | Debug browser | Configura `ng serve` e `ng test` |
| `.vscode/tasks.json` | Tasks VS Code | Tasks npm `start` e `test` |

## 8. Frontend Architecture

- Os componentes são standalone ou usados como componentes standalone no fluxo atual; não há NgModules de feature no código auditado.
- Páginas/features: home, sobre nós, login, registro, perfil, produtos, detalhes de 20 jogos, carrinho, checkout e admin.
- Core: `AuthService`, `SupabaseService`, `CarrinhoService`, `ProdutosService`, `FavoritosService`, `RawgService`, `MercadoPagoService`, `PainelAdminMockService`; facades `AuthFacade` e `CarrinhoFacade`; guards `authGuard` e `adminGuard`; modelos `UsuarioApp` e `ItemCarrinho`.
- Estado: Angular Signals em carrinho, facades e páginas; `BehaviorSubject` no auth e favoritos; Observables RxJS para auth, HTTP e mocks. Não existe store global dedicado.
- Persistência local: `localStorage` para carrinho e favoritos; `sessionStorage` para `caribe-ref` do pagamento.
- Persistência remota: Supabase Auth/profiles no código; Firestore em `CarrinhoFacade`; nenhum adapter PostgreSQL/Supabase para carrinho/orders.
- HTTP: `provideHttpClient`; RAWG diretamente no browser; Mercado Pago via endpoints locais `/api/mercado-pago/*`.
- Não foram encontrados interceptors, pipes ou directives customizados relevantes.
- Comunicação: templates acessam signals/facades; componentes injetam services/facades diretamente.

## 9. Routes

| Rota | Componente | Guard | Acesso/observações |
|---|---|---|---|
| `/` | lazy `Home` | — | Pública |
| `/sobre-nos` | `Sobrenos` | — | Pública |
| `/jogos` | `Produtos` | — | Catálogo |
| `/jogos/grand-theft-auto-v` | `GrandTheftAutoV` | — | Detalhe |
| `/jogos/the-witcher-3` | `Thewitcher` | — | Detalhe |
| `/jogos/the-sims-4` | `TheSims` | — | Detalhe |
| `/jogos/god-of-war` | `GodOfWar` | — | Detalhe |
| `/jogos/marvels-spider-man-remastered` | `MarvelsSpiderManRemastered` | — | Detalhe |
| `/jogos/call-of-duty-modern-warfare-ii` | `CallOfDutyModernWarfareIi` | — | Detalhe |
| `/jogos/a-plague-tale` | `APlagueTale` | — | Detalhe |
| `/jogos/god-of-war-ragnarök` | `GodOfWarRagnarok` | — | Rota contém caractere Unicode |
| `/jogos/hollow-knight` | `HollowKnight` | — | Detalhe |
| `/jogos/the-last-of-us-II` | `TheLastOfUsPartii` | — | Maiúsculas em `II` |
| `/jogos/red-dead-redemption-2` | `RedDeadRedemption2` | — | Detalhe |
| `/jogos/assassins-creed-iv-black-flag` | `AssassinsCreedBlackFlag` | — | Detalhe |
| `/jogos/yakuza-0` | `Yakuza` | — | Detalhe |
| `/jogos/ea-sports-fc-24` | `Fifa` | — | Detalhe |
| `/jogos/life-is-strange` | `LifeIsStrange` | — | Detalhe |
| `/jogos/the-last-of-Us` | `TheLastOfUs` | — | `Us` com maiúscula inconsistente |
| `/jogos/f1-23` | `F1` | — | Detalhe |
| `/jogos/elden-ring` | `EldenRing` | — | Detalhe |
| `/jogos/cyberpunk-2077` | `Cyberpunk2077` | — | Detalhe |
| `/jogos/marvel-rivals` | `MarvelRivals` | — | Detalhe |
| `/login` | `Login` | — | Pública |
| `/registro` | lazy `Registro` | — | Pública |
| `/carrinho` | lazy `Carrinho` | — | Pública, mas sincronização tenta usar Firebase |
| `/checkout` | `Checkout` | `authGuard` | Autenticada |
| `/admin` | `Admin` | `adminGuard` | Usuário autenticado com `profiles.role === 'admin'` |
| `/perfil` | `Perfil` | `authGuard` | Autenticada |
| `**` | redirect `/` | — | Wildcard |

`app.routes.server.ts` declara `jogos/:id` duas vezes, embora não exista essa rota dinâmica no client. Não há lazy loading para os detalhes, somente `Home`, `Registro` e `Carrinho` usam `loadComponent`. `Produtos` navega para `/produto/:slug`, mas essa rota não existe no arquivo de rotas.

## 10. Authentication

Tecnologia implementada: Supabase Auth via `@supabase/supabase-js`. `SupabaseService` cria o cliente com a URL do ambiente e a anon/publishable key, com persistência/refresh/detect session ativados apenas no browser.

Arquivos: `src/app/core/services/supabase.service.ts`, `src/app/core/services/auth.ts`, `src/app/core/facades/auth.facade.ts`, `src/app/core/guards/auth-guard.ts`, `src/app/core/guards/admin-guard.ts`, telas `login.ts`, `registro.ts`, `perfil.ts` e `environment.ts`.

- Login: `signInWithPassword`.
- Cadastro: `signUp`, enviando `display_name` em `user_metadata`.
- Logout: `signOut`.
- Recuperação: `resetPasswordForEmail`, redirect para `/login`.
- Google: `signInWithOAuth({ provider: 'google' })`; depende de configuração externa no painel Supabase e redirect URLs.
- Sessão: `getSession()` inicializa `BehaviorSubject`; `onAuthStateChange` o atualiza.
- Usuário atual: `UsuarioApp { uid, email, displayName }` exposto por Observable e Signal da facade.
- Papel: consulta `profiles.role`; fallback `customer`. O admin guard busca o papel no banco.
- `authGuard` espera `auth.pronto`, permite SSR e no browser redireciona para `/login` se não houver usuário.
- `adminGuard` permite SSR, exige sessão no browser e redireciona usuário não-admin para `/`.
- A tela `Registro` ainda traduz códigos no formato `auth/...` (Firebase), enquanto `AuthService.traduzirErroAuth` mapeia códigos Supabase e não é usado pela tela.

Fluxo real:

```text
Usuário
  ↓
Login/Registro (Login ou Registro)
  ↓
AuthService
  ↓
SupabaseService.client.auth
  ↓
Sessão Supabase + onAuthStateChange
  ↓
BehaviorSubject<UsuarioApp | null> / AuthFacade.usuarioAtual
  ↓
authGuard/adminGuard + buscarPapel(profiles.role)
  ↓
Checkout, perfil e admin
```

Não foi encontrada autenticação social além da tentativa Google, nem confirmação de e-mail/configuração remota. A autorização server-side para endpoints de pagamento não exige Supabase user token.

## 11. Supabase

- Projeto/URL encontrada: `https://xffraooahgrezxbpevbc.supabase.co` em `src/environments/environment.ts`.
- Cliente: `createClient` em `SupabaseService`.
- Auth: `AuthService` usa password, OAuth Google, reset, signup e signout.
- Tabela referenciada: `profiles`, colunas `id`, `role`, `display_name` aparecem nas queries/comentários.
- RLS, policies, funções, triggers, índices, views e RPCs: `NÃO CONFIRMADO` no repositório.
- Migrations, seeds e Edge Functions: não encontrados.
- `orders`/`order_items` Supabase: não implementados no código; a anotação em `server.ts` diz que seriam uma fase futura.
- Relação frontend: auth e profile são acessados diretamente pelo browser usando a chave pública redigida. O carrinho não usa Supabase; usa imports Firebase/Firestore.

Nenhum secret privado foi reproduzido. A `supabaseAnonKey` no ambiente é uma chave publicável e foi omitida por não ser necessária ao contexto; API key RAWG e todas as variáveis de pagamento foram redigidas como `[SECRET_REDACTED]`.

## 12. Database

### Banco confirmado no código

| Recurso | Evidência | Estrutura confirmada |
|---|---|---|
| Supabase `profiles` | `AuthService.buscarPapel` e `atualizarNomeUsuario` | `id`, `role`, `display_name`; tipos/defaults/FKs/constraints não confirmados |
| Firestore `carrinhos/{uid}` | `CarrinhoFacade` | Documento com `itens` e `atualizadoEm`; regras/índices não confirmados |
| Supabase `orders` | Comentário de `server.ts` apenas | Não existe implementação nem schema no repositório |
| `order_items` | Nenhuma referência de produção confirmada | Não encontrado |

O banco remoto Supabase pode conter mais objetos, mas não há como confirmá-los no workspace. Não há SQL preservável, tabela completa, coluna tipada, foreign key, unique, check, trigger, policy RLS ou migration versionada para documentar. O README menciona hipoteticamente `001_init.sql`, mas esse arquivo não existe.

## 13. Models

### `UsuarioApp`

Arquivo: `src/app/core/models/usuario-app.ts`. Finalidade: adaptar o usuário Supabase ao contrato usado pelas facades/templates.

```ts
export interface UsuarioApp {
  uid: string;
  email: string | null;
  displayName: string | null;
}
```

### `ItemCarrinho`

Arquivo: `src/app/core/models/item-carrinho.ts`. Finalidade: item local/remoto do carrinho.

```ts
export interface ItemCarrinho {
  id?: number | string;
  nome: string;
  preco: number;
  quantidade?: number;
  imagemUrl?: string;
  plataforma?: string;
  categoria?: string;
}
```

### `Produto`

Arquivo: `src/app/core/services/produtos.service.ts`. Campos: `id`, `nome`, `steamAppId?`, `genero`, `plataforma`, `precoOriginal`, `precoPromocional`, `desconto`, `categorias`, `slug`, `imagem?`, `imagemPosicao?`, `descricaoCustom?`. A fonte interna `ItemCatalogo` usa `plat`, `orig`, `promo`, `desc`, `imagemCustom` e é mapeada para `Produto`.

### Tipos de pagamento/admin

`PreferenciaMercadoPago` e `PagamentoMercadoPago` estão em `mercado-pago.service.ts`; `PedidoPendente` e `UsuarioCadastrado` estão em `painel-admin-mock.service.ts`. Não existem interfaces de `Order`, `OrderItem`, schema SQL ou modelo de estoque.

## 14. Services

| Service | Arquivo | Responsabilidade | Dependências/APIs/persistência |
|---|---|---|---|
| `SupabaseService` | `src/app/core/services/supabase.service.ts` | Criar cliente Supabase SSR-aware | `@supabase/supabase-js`, environment |
| `AuthService` | `src/app/core/services/auth.ts` | Auth, sessão, profile e role | `SupabaseService`, Supabase Auth/`profiles` |
| `CarrinhoService` | `src/app/core/services/carrinho.service.ts` | Estado local, quantidades e total | Signals, browser `localStorage` |
| `ProdutosService` | `src/app/core/services/produtos.service.ts` | Catálogo hard-coded e imagens | RxJS `of`, Steam CDN |
| `FavoritosService` | `src/app/core/services/favoritos.service.ts` | Favoritos locais | `BehaviorSubject`, `localStorage` |
| `RawgService` | `src/app/core/services/rawg.service.ts` | Detalhes/screenshots RAWG | `HttpClient`, RAWG API, chave client-side redigida |
| `MercadoPagoService` | `src/app/core/services/mercado-pago.service.ts` | Criar preferência/consultar pagamento | `HttpClient`, endpoints locais |
| `PainelAdminMockService` | `src/app/core/services/painel-admin-mock.service.ts` | Dados fictícios do painel | RxJS `of`, memória local |

### Código completo dos services principais

#### `src/app/core/services/supabase.service.ts`

```ts
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly client: SupabaseClient = createClient(
    environment.supabaseUrl,
    environment.supabaseAnonKey,
    {
      auth: {
        persistSession: this.isBrowser,
        autoRefreshToken: this.isBrowser,
        detectSessionInUrl: this.isBrowser,
      },
    },
  );
}
```

#### `src/app/core/services/auth.ts`

```ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';
import type { AuthError, User } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { UsuarioApp } from '../models/usuario-app';

const converter = (u: User | null | undefined): UsuarioApp | null =>
  u
    ? {
        uid: u.id,
        email: u.email ?? null,
        displayName: (u.user_metadata?.['display_name'] as string | undefined) ?? null,
      }
    : null;

export function traduzirErroAuth(erro: unknown): string {
  const codigo = (erro as { code?: string })?.code ?? '';
  const mapa: Record<string, string> = {
    user_already_exists: 'Este e-mail já está cadastrado.',
    invalid_credentials: 'E-mail ou senha incorretos.',
    weak_password: 'Senha fraca. Use ao menos 6 caracteres.',
    email_not_confirmed: 'Confirme seu e-mail antes de entrar.',
    over_request_rate_limit: 'Muitas tentativas. Aguarde um pouco.',
  };
  return mapa[codigo] ?? 'Não foi possível concluir. Tente novamente.';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sb = inject(SupabaseService).client;
  private readonly estado = new BehaviorSubject<UsuarioApp | null>(null);
  readonly pronto: Promise<void>;

  constructor() {
    this.pronto = this.sb.auth
      .getSession()
      .then(({ data }) => this.estado.next(converter(data.session?.user)));
    this.sb.auth.onAuthStateChange((_evento, sessao) => this.estado.next(converter(sessao?.user)));
  }

  get usuarioAtual$(): Observable<UsuarioApp | null> { return this.estado.asObservable(); }
  get usuarioAtualSnapshot(): UsuarioApp | null { return this.estado.value; }

  private comoObservable(p: PromiseLike<{ error: AuthError | null }>): Observable<void> {
    return from(Promise.resolve(p).then(({ error }) => { if (error) throw error; }));
  }

  login(email: string, senha: string): Observable<void> {
    return this.comoObservable(this.sb.auth.signInWithPassword({ email, password: senha }));
  }

  loginComGoogle(): Observable<void> {
    return this.comoObservable(
      this.sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }),
    );
  }

  recuperarSenha(email: string): Observable<void> {
    return this.comoObservable(
      this.sb.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/login` }),
    );
  }

  registrar(email: string, senha: string, nome: string): Observable<void> {
    return this.comoObservable(
      this.sb.auth.signUp({ email, password: senha, options: { data: { display_name: nome } } }),
    );
  }

  logout(): Observable<void> { return this.comoObservable(this.sb.auth.signOut()); }

  atualizarNomeUsuario(nome: string): Observable<void> {
    return from((async () => {
      const { error } = await this.sb.auth.updateUser({ data: { display_name: nome } });
      if (error) throw error;
      const uid = this.estado.value?.uid;
      if (uid) {
        const r = await this.sb.from('profiles').update({ display_name: nome }).eq('id', uid);
        if (r.error) throw r.error;
      }
    })());
  }

  async buscarPapel(uid: string): Promise<string> {
    const { data } = await this.sb.from('profiles').select('role').eq('id', uid).single();
    return (data?.role as string | undefined) ?? 'customer';
  }
}
```

#### `src/app/core/services/carrinho.service.ts`

```ts
import { isPlatformBrowser } from '@angular/common';
import { Injectable, signal, computed, effect, inject, PLATFORM_ID } from '@angular/core';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoService {
  private platformId = inject(PLATFORM_ID);
  private readonly chaveStorage = 'caribe-gaming-carrinho';
  private carrinho = signal<ItemCarrinho[]>(this.carregarCarrinhoSalvo());
  itens = computed(() => this.carrinho());
  quantidade = computed(() => this.carrinho().reduce((acc, item) => acc + (item.quantidade || 1), 0));
  total = computed(() => this.carrinho().reduce((total, item) => total + item.preco * (item.quantidade || 1), 0));
  carrinhoVazio = computed(() => this.carrinho().length === 0);

  constructor() { effect(() => { this.salvarCarrinho(this.carrinho()); }); }
  definirItens(itens: ItemCarrinho[]) { this.carrinho.set(itens); }

  adicionar(produto: ItemCarrinho) {
    this.carrinho.update((lista) => {
      const id = produto.id;
      const indexExistente = id !== undefined && id !== null
        ? lista.findIndex((item) => String(item.id) === String(id))
        : lista.findIndex((item) => item.nome === produto.nome);
      if (indexExistente > -1) {
        const novaLista = [...lista];
        const itemExistente = novaLista[indexExistente];
        novaLista[indexExistente] = { ...itemExistente, quantidade: (itemExistente.quantidade || 1) + (produto.quantidade || 1) };
        return novaLista;
      }
      return [...lista, { ...produto, quantidade: produto.quantidade || 1 }];
    });
  }

  aumentarQuantidade(indice: number) {
    this.carrinho.update((lista) => {
      const novaLista = [...lista];
      novaLista[indice] = { ...novaLista[indice], quantidade: (novaLista[indice].quantidade || 1) + 1 };
      return novaLista;
    });
  }

  diminuirQuantidade(indice: number) {
    this.carrinho.update((lista) => {
      const novaLista = [...lista];
      const quantidadeAtual = novaLista[indice].quantidade || 1;
      if (quantidadeAtual <= 1) return lista;
      novaLista[indice] = { ...novaLista[indice], quantidade: quantidadeAtual - 1 };
      return novaLista;
    });
  }

  removerPorIndice(indice: number) { this.carrinho.update((lista) => lista.filter((_, index) => index !== indice)); }
  limpar() { this.carrinho.set([]); if (this.estaNoNavegador()) localStorage.removeItem(this.chaveStorage); }
  private estaNoNavegador(): boolean { return isPlatformBrowser(this.platformId); }
  private carregarCarrinhoSalvo(): ItemCarrinho[] {
    if (!this.estaNoNavegador()) return [];
    const dadosSalvos = localStorage.getItem(this.chaveStorage);
    if (!dadosSalvos) return [];
    try { return JSON.parse(dadosSalvos) as ItemCarrinho[]; } catch { return []; }
  }
  private salvarCarrinho(itens: ItemCarrinho[]) {
    if (!this.estaNoNavegador()) return;
    localStorage.setItem(this.chaveStorage, JSON.stringify(itens));
  }
}
```

Os demais services estão nos caminhos listados acima. `rawg.service.ts`, `mercado-pago.service.ts`, `produtos.service.ts` e `painel-admin-mock.service.ts` estão reproduzidos nas seções específicas abaixo para preservar seus contratos e integrações.

## 15. Facades

### `AuthFacade` — `src/app/core/facades/auth.facade.ts`

Responsabilidade: expor usuário, login/registro, nome e papel administrativo via Signals. Usa `AuthService`; `ehAdmin` consulta `profiles.role` e serve principalmente para UI, enquanto o guard decide acesso.

```ts
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap, map, from } from 'rxjs';
import { AuthService } from '../services/auth';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private readonly authService = inject(AuthService);
  usuarioAtual = toSignal(this.authService.usuarioAtual$, { initialValue: null });
  estaLogado(): boolean { return !!this.usuarioAtual(); }
  ehAdmin = toSignal(
    this.authService.usuarioAtual$.pipe(
      switchMap((u) => (u ? from(this.authService.buscarPapel(u.uid)) : of('customer'))),
      map((papel) => papel === 'admin'),
    ), { initialValue: false },
  );
  nomeExibicao = computed(() => {
    const usuario = this.usuarioAtual();
    return usuario?.displayName || usuario?.email || '';
  });
  realizarLogin(email: string, senha: string) { return this.authService.login(email, senha); }
  realizarRegistro(email: string, senha: string, nome: string) { return this.authService.registrar(email, senha, nome); }
  atualizarNomeUsuario(nome: string) { return this.authService.atualizarNomeUsuario(nome); }
  sair() { this.authService.logout().subscribe(); }
}
```

### `CarrinhoFacade` — `src/app/core/facades/carrinho.facade.ts`

Responsabilidade: delegar o carrinho local, observar Firebase Auth, sincronizar um documento Firestore `carrinhos/{uid}`, mesclar itens locais/nuvem e reagir a atualizações remotas. Importa `Auth`, `user`, `Firestore`, `doc`, `docData` e `setDoc` de `@angular/fire`. Essa implementação não pode ser compilada no estado auditado porque esses imports não estão resolvendo e `environment.firebase` não existe.

```ts
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { CarrinhoService } from '../services/carrinho.service';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({ providedIn: 'root' })
export class CarrinhoFacade {
  private carrinhoService = inject(CarrinhoService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private platformId = inject(PLATFORM_ID);
  private user$ = user(this.auth);
  private firestoreSub?: Subscription;
  private userId = signal<string | null>(null);
  private isCarregandoNuvem = false;
  itens = this.carrinhoService.itens;
  quantidade = this.carrinhoService.quantidade;
  total = this.carrinhoService.total;
  carrinhoVazio = this.carrinhoService.carrinhoVazio;

  constructor() { if (isPlatformBrowser(this.platformId)) this.iniciarMonitoramentoAuth(); }

  private iniciarMonitoramentoAuth(): void {
    this.user$.subscribe((usr) => {
      if (usr) {
        const uidAnterior = this.userId();
        this.userId.set(usr.uid);
        if (uidAnterior !== usr.uid) this.sincronizarComFirestore(usr.uid);
      } else {
        const estavaLogado = !!this.userId();
        this.userId.set(null);
        if (this.firestoreSub) { this.firestoreSub.unsubscribe(); this.firestoreSub = undefined; }
        if (estavaLogado) this.carrinhoService.limpar();
      }
    });
  }

  adicionarProduto(produto: ItemCarrinho): void { this.carrinhoService.adicionar(produto); this.salvarSeLogado(); }
  aumentarQuantidade(indice: number): void { this.carrinhoService.aumentarQuantidade(indice); this.salvarSeLogado(); }
  diminuirQuantidade(indice: number): void { this.carrinhoService.diminuirQuantidade(indice); this.salvarSeLogado(); }
  removerItem(indice: number): void { this.carrinhoService.removerPorIndice(indice); this.salvarSeLogado(); }
  limparCarrinho(): void { this.carrinhoService.limpar(); this.salvarSeLogado(); }

  private salvarSeLogado(): void {
    const uid = this.userId();
    if (uid && !this.isCarregandoNuvem) this.salvarNoFirestore(uid, this.itens());
  }

  private sincronizarComFirestore(uid: string): void {
    if (this.firestoreSub) this.firestoreSub.unsubscribe();
    const docRef = doc(this.firestore, `carrinhos/${uid}`);
    let primeiraLeitura = true;
    this.isCarregandoNuvem = true;
    this.firestoreSub = docData(docRef).subscribe({
      next: (dadosNuvem: any) => {
        const itensNuvem: ItemCarrinho[] = dadosNuvem?.itens || [];
        const itensLocais = this.itens();
        if (primeiraLeitura) {
          primeiraLeitura = false;
          this.isCarregandoNuvem = false;
          if (itensLocais.length > 0) {
            const itensMesclados = this.mesclarCarrinhos(itensNuvem, itensLocais);
            this.carrinhoService.definirItens(itensMesclados);
            this.salvarNoFirestore(uid, itensMesclados);
          } else this.carrinhoService.definirItens(itensNuvem);
        } else if (!this.saoIguais(itensNuvem, itensLocais)) this.carrinhoService.definirItens(itensNuvem);
      },
      error: (err) => { console.error('Erro ao sincronizar carrinho com Firestore:', err); this.isCarregandoNuvem = false; },
    });
  }

  private mesclarCarrinhos(nuvem: ItemCarrinho[], local: ItemCarrinho[]): ItemCarrinho[] {
    const mapa = new Map<string, ItemCarrinho>();
    nuvem.forEach((item) => { const chave = item.id !== undefined && item.id !== null ? String(item.id) : item.nome; mapa.set(chave, { ...item, quantidade: item.quantidade || 1 }); });
    local.forEach((item) => {
      const chave = item.id !== undefined && item.id !== null ? String(item.id) : item.nome;
      if (mapa.has(chave)) { const itemExistente = mapa.get(chave)!; itemExistente.quantidade = (itemExistente.quantidade || 1) + (item.quantidade || 1); }
      else mapa.set(chave, { ...item, quantidade: item.quantidade || 1 });
    });
    return Array.from(mapa.values());
  }

  private saoIguais(a: ItemCarrinho[], b: ItemCarrinho[]): boolean { return a.length === b.length && JSON.stringify(a) === JSON.stringify(b); }

  private async salvarNoFirestore(uid: string, itens: ItemCarrinho[]): Promise<void> {
    try { await setDoc(doc(this.firestore, `carrinhos/${uid}`), { itens, atualizadoEm: new Date().toISOString() }); }
    catch (err) { console.error('Erro ao salvar carrinho no Firestore:', err); }
  }
}
```

## 16. Guards

### `authGuard` — `src/app/core/guards/auth-guard.ts`

Objetivo: proteger checkout/perfil no browser. No SSR retorna `true`; no browser espera `AuthService.pronto`, permite usuário atual ou navega para `/login`.

```ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = async () => {
  const navegador = isPlatformBrowser(inject(PLATFORM_ID));
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!navegador) return true;
  await auth.pronto;
  if (auth.usuarioAtualSnapshot) return true;
  router.navigate(['/login']);
  return false;
};
```

### `adminGuard` — `src/app/core/guards/admin-guard.ts`

Objetivo: exigir sessão e `profiles.role === 'admin'`; sem sessão vai para `/login`, papel diferente vai para `/`.

```ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = async () => {
  const navegador = isPlatformBrowser(inject(PLATFORM_ID));
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!navegador) return true;
  await auth.pronto;
  const usuario = auth.usuarioAtualSnapshot;
  if (!usuario) { router.navigate(['/login']); return false; }
  const papel = await auth.buscarPapel(usuario.uid);
  if (papel === 'admin') return true;
  router.navigate(['/']);
  return false;
};
```

## 17. Components

| Componente | TS | Template/style | Responsabilidade e dependências |
|---|---|---|---|
| `Home` | `src/app/home/home/home.ts` | `home.html/css` | Landing/home; serviços compartilhados conforme template |
| `Produtos` | `src/app/features/produtos/produtos.ts` | `produtos.html/css` | Lista, filtro/preço/categoria, navegação e favoritos; `ProdutosService`, `FavoritosService`, router |
| detalhes | 20 pastas em `src/app/features/produtos/` | cada uma possui `.ts/.html/.css/.spec.ts` | Detalhe, RAWG, screenshots, Steam CDN, comentários/favoritos locais; cada TS usa `RawgService` |
| `Login` | `src/app/features/login/login.ts` | `login.html/css` | Login, Google e recuperação; `AuthService`, Router, Reactive Forms |
| `Registro` | `src/app/features/login/registro.ts` | `registro.html/css` | Cadastro e validação de senha; `AuthService`, Router, Reactive Forms |
| `Carrinho` | `src/app/features/carrinho/carrinho.ts` | `carrinho.html/css` | Exibição/remoção/limpeza; `CarrinhoFacade`, `AuthFacade` |
| `Checkout` | `src/app/features/checkout/checkout/checkout.ts` | `checkout.html/css` | Formulário, pagamento e retorno; `CarrinhoFacade`, `AuthFacade`, `MercadoPagoService` |
| `Perfil` | `src/app/features/perfil/perfil.ts` | `perfil.html/css` | Alterar nome; `AuthFacade`, Reactive Forms |
| `Admin` | `src/app/features/admin/admin.ts` | `admin.html/css` | Contadores de catálogo/pedidos/usuários; `ProdutosService`, `PainelAdminMockService`, PrimeNG |
| `Sobrenos` | `src/app/features/sobrenos/sobrenos.ts` | `sobrenos.html/css` | Página institucional |
| `Header/Footer` | `src/app/shared/header/`, `footer/` | templates/styles/specs | Navegação e rodapé compartilhados |

### Código completo dos componentes críticos

#### `src/app/features/checkout/checkout/checkout.ts`

```ts
import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarrinhoFacade } from '../../../core/facades/carrinho.facade';
import { AuthFacade } from '../../../core/facades/auth.facade';
import { MercadoPagoService } from '../../../core/services/mercado-pago.service';

@Component({ selector: 'app-checkout', standalone: true, imports: [CommonModule, ReactiveFormsModule, RouterLink], templateUrl: './checkout.html', styleUrl: './checkout.css' })
export class Checkout implements OnInit {
  carrinhoFacade = inject(CarrinhoFacade);
  authFacade = inject(AuthFacade);
  private mercadoPagoService = inject(MercadoPagoService);
  private activatedRoute = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  compraFinalizada = signal(false);
  metodoPagamento = signal<'pix' | 'cartao' | 'boleto'>('pix');
  segurancaAberta = signal(false);
  processandoPagamento = signal(false);
  erroPagamento = signal<string | null>(null);
  private emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  formulario: FormGroup = this.fb.group({ nome: ['', [Validators.required, Validators.minLength(3)]], email: ['', [Validators.required, Validators.pattern(this.emailPattern)]], endereco: ['', [Validators.required, Validators.minLength(5)]] });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.activatedRoute.queryParamMap.subscribe((params) => {
        const paymentId = params.get('payment_id');
        if (paymentId) {
          this.processandoPagamento.set(true);
          this.mercadoPagoService.consultarPagamento(paymentId).subscribe({
            next: (pagamento) => {
              this.processandoPagamento.set(false);
              const minhaRef = sessionStorage.getItem('caribe-ref');
              if (pagamento.status === 'approved' && pagamento.externalReference === minhaRef) { this.carrinhoFacade.limparCarrinho(); sessionStorage.removeItem('caribe-ref'); this.compraFinalizada.set(true); }
              else if (pagamento.status === 'pending' || pagamento.status === 'in_process') this.erroPagamento.set('Pagamento pendente (Pix/boleto). Ele será confirmado assim que for compensado.');
              else this.erroPagamento.set(`Pagamento não aprovado: ${pagamento.status}.`);
            },
            error: () => { this.processandoPagamento.set(false); this.erroPagamento.set('Não foi possível confirmar o status do pagamento.'); },
          });
        }
      });
    }
    const usuario = this.authFacade.usuarioAtual();
    if (usuario) { if (usuario.displayName) this.formulario.patchValue({ nome: usuario.displayName }); if (usuario.email) this.formulario.patchValue({ email: usuario.email }); }
  }
  campoInvalido(nomeCampo: string): boolean { const campo = this.formulario.get(nomeCampo); return !!(campo && campo.invalid && (campo.dirty || campo.touched)); }
  selecionarPagamento(metodo: 'pix' | 'cartao' | 'boleto') { this.metodoPagamento.set(metodo); }
  toggleSeguranca() { this.segurancaAberta.update((v) => !v); }
  finalizar() {
    if (!this.formulario.valid) { this.formulario.markAllAsTouched(); return; }
    const email = this.formulario.get('email')?.value as string;
    this.processandoPagamento.set(true); this.erroPagamento.set(null);
    this.mercadoPagoService.criarPreferencia(this.carrinhoFacade.itens(), email).subscribe({
      next: (preferencia) => { if (isPlatformBrowser(this.platformId)) { sessionStorage.setItem('caribe-ref', preferencia.externalReference); window.location.assign(preferencia.initPoint); } },
      error: (error) => { this.processandoPagamento.set(false); this.erroPagamento.set(error?.error?.error || 'Não foi possível iniciar o pagamento. Tente novamente.'); },
    });
  }
}
```

`login.ts`, `registro.ts`, `perfil.ts`, `carrinho.ts` e `admin.ts` são os arquivos de implementação apresentados na auditoria e seguem exatamente os caminhos acima; seus templates e styles são arquivos separados, não inline. Os detalhes de jogos repetem a estrutura RAWG/Steam, com variações de descrição, slug, App ID, comentários e avaliações em `localStorage`.

## 18. External APIs

| Nome | Finalidade | Arquivo/endpoint | Método/auth | Dados/uso |
|---|---|---|---|---|
| Supabase Auth | Cadastro, login, sessão, reset, Google | `supabase.service.ts`/`auth.ts`; URL do projeto | SDK, chave pública redigida | Usuário e sessão |
| Supabase REST | Profile/role/nome | `.from('profiles')` | SDK, sessão do browser | `role`, `display_name` |
| RAWG | Detalhe e screenshots | `rawg.service.ts` | GET com API key client-side redigida | Dados chegam aos componentes de detalhes |
| Mercado Pago | Checkout Pro, consulta e webhook | `src/server.ts` | Server `fetch`, Bearer secret redigido | Preferência, pagamento, status |
| Steam Store CDN | Imagens de catálogo/detalhes | `ProdutosService` e detalhes | URL pública | Assets por Steam App ID |
| Firebase Auth/Firestore | Sincronização de carrinho pretendida | `carrinho.facade.ts` | SDK imports não resolvidos | Documento `carrinhos/{uid}` |
| ViaCEP | — | Nenhuma ocorrência confirmada | — | Não implementado |

## 19. RAWG

`src/app/core/services/rawg.service.ts` usa `https://api.rawg.io/api` e faz:

- `GET https://api.rawg.io/api/games/{jogoIdOuSlug}?key=[SECRET_REDACTED]`
- `GET https://api.rawg.io/api/games/{jogoIdOuSlug}/screenshots?key=[SECRET_REDACTED]`

Interfaces: `RawgGameResponse`, `RawgScreenshotResponse` e `DetalhesJogo`. Campos usados/normalizados incluem id, name, description_raw, released, developers, publishers, esrb_rating, platforms, background_image e screenshots `id/image/width/height`.

Os componentes de detalhe injetam `RawgService` e usam slug/App ID para carregar detalhe e screenshots. A chave RAWG está literal no TypeScript client-side no estado auditado; não deve ser tratada como secreta recuperável. Seu valor foi redigido aqui.

## 20. Steam

Não há Steam Web API, autenticação Steam, ownership check, ativação de licença ou backend Steam. A integração confirmada é apenas o armazenamento de `steamAppId` nos 20 itens e uso desse ID para imagens. IDs presentes: `271590`, `292030`, `1222670`, `1593500`, `1817070`, `1938090`, `752590`, `2322010`, `367520`, `1174180`, `242050`, `638970`, `2195250`, `319630`, `1888930`, `2108330`, `1245620`, `1091500`, `2767030`, `2531310`.

## 21. Steam Store CDN

`ProdutosService.obterProdutos()` monta imagens com:

```text
https://cdn.cloudflare.steamstatic.com/steam/apps/{steamAppId}/library_600x900.jpg
```

O componente de catálogo usa a imagem vertical `library_600x900.jpg`. Componentes de detalhes também montam imagens de capa/header a partir do App ID; os formatos específicos devem ser confirmados no respectivo `.html/.ts`. Não há download local nem serviço Steam separado.

## 22. ViaCEP

Não encontrado. Não há endpoint `viacep.com.br`, service, busca/validação de CEP, parser de resposta ou tratamento de erro ViaCEP. O checkout possui apenas um campo textual `endereco`, obrigatório e com mínimo de 5 caracteres; não há campo CEP confirmado.

## 23. Mercado Pago

Frontend: `MercadoPagoService` chama `/api/mercado-pago/preference` e `/api/mercado-pago/payment/:id`. O checkout envia somente IDs, quantidades e e-mail; o servidor recalcula nomes/preços a partir de `src/server/catalogo-precos.ts`.

Backend em `src/server.ts`:

- `POST /api/mercado-pago/preference`: valida e-mail, 1–50 entradas, IDs existentes e quantidade inteira 1–99; ignora itens gratuitos; gera UUID como `external_reference`; cria preferência em `https://api.mercadopago.com/checkout/preferences`; usa `MERCADOPAGO_ACCESS_TOKEN` no servidor.
- `GET /api/mercado-pago/payment/:id`: aceita somente id numérico, consulta `https://api.mercadopago.com/v1/payments/{id}`, valida external reference e valor, e retorna status.
- `POST /api/mercado-pago/webhook`: lê `MERCADOPAGO_WEBHOOK_SECRET` e access token, valida HMAC SHA-256 de `x-signature`, `data.id` e `x-request-id`, e reconcilia payment notifications.
- `PUBLIC_APP_URL` default: `http://localhost:4000`; `MERCADOPAGO_WEBHOOK_URL` é enviado à preferência.
- Status internos: `pending`, `paid`, `failed`; status Mercado Pago usado: `approved`, `rejected`, `cancelled`, `pending`, `in_process`.
- `pedidos` é `Map` em memória e desaparece ao reiniciar o processo.
- Após retorno aprovado, o frontend só limpa o carrinho se o `externalReference` coincidir com `sessionStorage['caribe-ref']`.

O pacote `mercadopago` está declarado, mas o código auditado usa `fetch` nativo. Não existe order persistido, associação confirmada com usuário Supabase, fulfillment, estoque/chaves ou entrega automática. O endereço e `metodoPagamento` são coletados/alterados na tela, mas não são enviados ao backend.

Secrets redigidos: `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET` e qualquer valor de API key.

## 24. Cart

O carrinho tem três camadas: `Carrinho` (UI), `CarrinhoFacade` e `CarrinhoService`; o modelo é `ItemCarrinho`. `CarrinhoService` mantém Signal, calcula quantidade/total, impede redução abaixo de 1, mescla itens por id/nome e persiste em `localStorage['caribe-gaming-carrinho']`.

`CarrinhoFacade` tenta persistência multidispositivo em Firestore `carrinhos/{uid}`: observa Firebase Auth, carrega `itens`, mescla local+nuvem no primeiro login, salva `atualizadoEm` ISO e reage a `docData`. Logout limpa o carrinho local. Essa implementação é incongruente com a autenticação Supabase e não compila porque AngularFire não está resolvido e não há configuração Firebase no ambiente.

Fluxo pretendido no código:

```text
Dispositivo A
  ↓ login Firebase (não alinhado ao AuthService Supabase)
Adicionar produto
  ↓ CarrinhoFacade
Firestore carrinhos/{uid}
  ↓ docData
Dispositivo B
  ↓ login Firebase
Buscar itens e mesclar/carregar
  ↓
LocalStorage + Signals
```

Não há `cart_items` no código; não há carrinho Supabase confirmado. Não há controle confirmado de concorrência além da comparação JSON e do flag local `isCarregandoNuvem`.

## 25. Checkout

Componente: `src/app/features/checkout/checkout/checkout.ts`; rota protegida por `authGuard`. Formulário: `nome` obrigatório mínimo 3, `email` obrigatório com regex, `endereco` obrigatório mínimo 5. Método visual: `pix`, `cartao`, `boleto`, default `pix`.

Fluxo: valida formulário, envia itens `{id, quantity}` e e-mail a `MercadoPagoService`, grava `externalReference` no `sessionStorage`, redireciona para `initPoint`, lê `payment_id` na volta, consulta o backend e limpa carrinho apenas em `approved` com referência igual.

Não existe busca CEP/ViaCEP. Endereço não é enviado. Método de pagamento não é enviado. Não há criação de order persistente nem resumo server-side associado ao usuário autenticado.

## 26. Orders

Não existe tabela/modelo `orders` ou `order_items` no repositório. O único objeto equivalente é `const pedidos = new Map<string, Pedido>()` em `src/server.ts`, com `totalCentavos`, `status` e `paymentId?`. Ele é criado depois que Mercado Pago aceita a preferência, reconciliado por `external_reference` e perdido no restart.

Não há status persistido, relação com usuário Supabase, relação com produtos, itens de pedido, fulfillment ou relação durável com Mercado Pago. O painel exibe pedidos fictícios via `PainelAdminMockService`.

## 27. Business Rules

- Catálogo contém 20 itens com preços em strings no frontend; servidor possui tabela paralela `PRECOS` em centavos.
- Preço do pagamento é recalculado no servidor; valores enviados pelo browser não são aceitos.
- Quantidade do pagamento deve ser inteira entre 1 e 99; no máximo 50 entradas.
- E-mail server-side deve corresponder a regex simples e ter até 254 caracteres.
- Itens com preço zero não passam pelo gateway; se todos forem gratuitos, o pedido é rejeitado como “Nada a pagar”.
- Carrinho incrementa quantidade ao adicionar id existente; reduzir não remove abaixo de 1; remover/limpar são ações explícitas.
- Carrinho local é salvo automaticamente; logout Firebase limpa carrinho local quando havia usuário.
- Checkout exige login, campos válidos e carrinho enviado ao backend; o backend não verifica que o caller está autenticado.
- Compra só é marcada na UI como concluída se pagamento `approved` e referência de sessão coincidirem.
- Admin depende de `profiles.role === 'admin'`; fallback é `customer`.
- Senha de cadastro/login exige mínimo de 6 caracteres no frontend.
- RAWG e Steam são fontes de apresentação; não controlam preço/disponibilidade.

## 28. Main Flows

```text
Cadastro: Registro → AuthService.registrar → Supabase Auth.signUp → sessão/confirm email externo → Home
Login: Login → AuthService.login → Supabase Auth.signInWithPassword → AuthService state → Home
Logout: Header/Profile → AuthFacade.sair → AuthService.logout → Supabase signOut → estado nulo
Busca/lista: Produtos → ProdutosService.obterProdutos → lista hard-coded + Steam CDN → catálogo
Detalhes: rota de jogo → componente específico → RawgService → RAWG detail/screenshots → tela
Adicionar: detalhe/lista → CarrinhoFacade.adicionarProduto → CarrinhoService Signal → localStorage (+ Firestore pretendido)
Alterar/remover: Carrinho → facade → service → Signal/localStorage (+ Firestore pretendido)
Checkout: Checkout → authGuard/AuthFacade → MercadoPagoService → Express `/api/mercado-pago/preference` → Mercado Pago
Retorno: Mercado Pago → `/checkout?payment_id` → MercadoPagoService → Express payment → reconciliação Map → UI/limpeza local
Webhook: Mercado Pago → Express webhook → HMAC → reconciliação Map → status em memória
Admin: `/admin` → adminGuard → AuthService.buscarPapel → Admin → ProdutosService + mock admin → contadores
```

Não há fluxo implementado de busca CEP, criação de order persistente, webhook que atualize banco, entrega de chave ou sincronização Supabase multidispositivo.

## 29. Source Code

Os arquivos centrais completos estão nesta seção e nas seções 14–16; os códigos são os presentes no snapshot auditado.

### `src/app/app.routes.ts`

```ts
import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { Perfil } from './features/perfil/perfil';
import { Home } from './home/home/home';
import { Produtos } from './features/produtos/produtos';
import { Carrinho } from './features/carrinho/carrinho';
import { Checkout } from './features/checkout/checkout/checkout';
import { Thewitcher } from './features/produtos/thewitcher3/thewitcher/thewitcher';
import { Admin } from './features/admin/admin';
import { adminGuard } from './core/guards/admin-guard';
import { authGuard } from './core/guards/auth-guard';
import { TheSims } from './features/produtos/thesims4/thesims/thesims';
import { EldenRing } from './features/produtos/elden-ring/elden-ring';
import { GrandTheftAutoV } from './features/produtos/grandtheftautov/grandtheftautov/grandtheftautov';
import { GodOfWar } from './features/produtos/godofwar/godofwar/godofwar';
import { MarvelsSpiderManRemastered } from './features/produtos/marvels-spider-man-remastered/marvels-spider-man-remastered';
import { CallOfDutyModernWarfareIi } from './features/produtos/call-of-duty-modern-warfare-ii/call-of-duty-modern-warfare-ii';
import { APlagueTale } from './features/produtos/a-plague-tale/a-plague-tale';
import { GodOfWarRagnarok } from './features/produtos/god-of-war-ragnarok/god-of-war-ragnarok';
import { HollowKnight } from './features/produtos/hollow-knight/hollow-knight';
import { RedDeadRedemption2 } from './features/produtos/red-dead-redemption-2/red-dead-redemption-2';
import { AssassinsCreedBlackFlag } from './features/produtos/assassins-creed-black-flag/assassins-creed-black-flag';
import { Yakuza } from './features/produtos/yakuza/yakuza';
import { Fifa } from './features/produtos/fifa/fifa';
import { LifeIsStrange } from './features/produtos/life-is-strange/life-is-strange';
import { TheLastOfUs } from './features/produtos/the-last-of-us/the-last-of-us';
import { F1 } from './features/produtos/f1/f1';
import { Cyberpunk2077 } from './features/produtos/cyberpunk-2077/cyberpunk-2077';
import { MarvelRivals } from './features/produtos/marvel-rivals/marvel-rivals';
import { TheLastOfUsPartii } from './features/produtos/the-last-of-us-part-ii/the-last-of-us-part-ii';
import { Sobrenos } from './features/sobrenos/sobrenos';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home/home').then((m) => m.Home) },
  { path: 'sobre-nos', component: Sobrenos },
  { path: 'jogos', component: Produtos },
  { path: 'jogos/grand-theft-auto-v', component: GrandTheftAutoV },
  { path: 'jogos/the-witcher-3', component: Thewitcher },
  { path: 'jogos/the-sims-4', component: TheSims },
  { path: 'jogos/god-of-war', component: GodOfWar },
  { path: 'jogos/marvels-spider-man-remastered', component: MarvelsSpiderManRemastered },
  { path: 'jogos/call-of-duty-modern-warfare-ii', component: CallOfDutyModernWarfareIi },
  { path: 'jogos/a-plague-tale', component: APlagueTale },
  { path: 'jogos/god-of-war-ragnarök', component: GodOfWarRagnarok },
  { path: 'jogos/hollow-knight', component: HollowKnight },
  { path: 'jogos/the-last-of-us-II', component: TheLastOfUsPartii },
  { path: 'jogos/red-dead-redemption-2', component: RedDeadRedemption2 },
  { path: 'jogos/assassins-creed-iv-black-flag', component: AssassinsCreedBlackFlag },
  { path: 'jogos/yakuza-0', component: Yakuza },
  { path: 'jogos/ea-sports-fc-24', component: Fifa },
  { path: 'jogos/life-is-strange', component: LifeIsStrange },
  { path: 'jogos/the-last-of-Us', component: TheLastOfUs },
  { path: 'jogos/f1-23', component: F1 },
  { path: 'jogos/elden-ring', component: EldenRing },
  { path: 'jogos/cyberpunk-2077', component: Cyberpunk2077 },
  { path: 'jogos/marvel-rivals', component: MarvelRivals },
  { path: 'login', component: Login },
  { path: 'registro', loadComponent: () => import('./features/login/registro').then((m) => m.Registro) },
  { path: 'carrinho', loadComponent: () => import('./features/carrinho/carrinho').then((m) => m.Carrinho) },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
```

### `src/app/core/services/mercado-pago.service.ts`

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCarrinho } from '../models/item-carrinho';

export interface PreferenciaMercadoPago { id: string; initPoint: string; sandboxInitPoint?: string; externalReference: string; }
export interface PagamentoMercadoPago { id: number; status: string; externalReference: string; }

@Injectable({ providedIn: 'root' })
export class MercadoPagoService {
  private http = inject(HttpClient);
  criarPreferencia(itens: ItemCarrinho[], email: string): Observable<PreferenciaMercadoPago> {
    return this.http.post<PreferenciaMercadoPago>('/api/mercado-pago/preference', {
      items: itens.map((item) => ({ id: item.id, quantity: item.quantidade || 1 })), payer: { email },
    });
  }
  consultarPagamento(paymentId: string): Observable<PagamentoMercadoPago> {
    return this.http.get<PagamentoMercadoPago>(`/api/mercado-pago/payment/${paymentId}`);
  }
}
```

### Arquivos de código relevantes não duplicados integralmente

- `src/server.ts`: código completo do backend de pagamento está no arquivo real e foi auditado; a lógica e endpoints estão descritos na seção 23.
- `src/server/catalogo-precos.ts`: `PRECOS` contém os 20 ids e preços em centavos listados na seção 27.
- `src/app/core/services/produtos.service.ts`: fonte hard-coded dos 20 jogos e mapeamento Steam CDN; contrato completo na seção 13.
- `src/app/core/facades/carrinho.facade.ts`: código completo na seção 15.
- Templates/styles e os 20 detalhes são arquivos separados. Não foram concatenados aqui para evitar repetir 68 arquivos visuais; seus caminhos reais estão na estrutura e não há geração automática presumida.

## 30. Dependency Map

```text
LoginComponent
  ↓
AuthService
  ↓
SupabaseService
  ↓
Supabase Auth
  ↓
AuthService.estado / AuthFacade.usuarioAtual
```

```text
CarrinhoComponent
  ↓
CarrinhoFacade
  ↓
CarrinhoService
  ↓
localStorage
  ↘ (implementação pretendida) Firebase Auth/Firestore carrinhos/{uid}
```

```text
CheckoutComponent
  ↓
MercadoPagoService
  ↓
Express src/server.ts
  ↓
Mercado Pago API
  ↓
Map pedidos em memória
```

```text
AdminComponent
  ↓
adminGuard → AuthService.buscarPapel → Supabase profiles.role
  ↓
ProdutosService + PainelAdminMockService
```

```text
DetalheJogo / componentes de jogos
  ↓
RawgService → RAWG API
  ↓
template do detalhe
  ↘ Steam App ID → Steam Store CDN
```

## 31. Environment Variables

### Variáveis realmente lidas pelo código

| Variável | Uso | Segurança |
|---|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | Bearer server-side para preferência/consulta | `[SECRET_REDACTED]`; não colocar no frontend |
| `MERCADOPAGO_WEBHOOK_SECRET` | HMAC do webhook | `[SECRET_REDACTED]` |
| `PUBLIC_APP_URL` | URLs de retorno Mercado Pago | Valor default local `http://localhost:4000`; produção depende de configuração |
| `MERCADOPAGO_WEBHOOK_URL` | URL de notificação enviada à preferência | Valor externo não confirmado |
| `PORT` | Porta do Express SSR | Default `4000` |

`SUPABASE_URL`/`SUPABASE_KEY` não são lidas de `process.env`; estão hard-coded em `src/environments/environment.ts`, com a URL pública identificada e a chave omitida. `RAWG_API_KEY` também não é uma variável: a chave está literal em `rawg.service.ts` e foi redigida.

Não foram encontradas `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `VITE_*`, `FIREBASE_*`, ViaCEP ou variáveis PostgreSQL em arquivos do projeto.

## 32. Commands

```bash
npm install
npm start
npm run build
npm test -- --run
npm run test:watch
npm run watch
npm run serve:ssr:caribe-gaming
```

O README documenta também PowerShell com `MERCADOPAGO_ACCESS_TOKEN`, `PUBLIC_APP_URL` e `MERCADOPAGO_WEBHOOK_URL`, seguido de `npm.cmd run build` e `npm.cmd run serve:ssr:caribe-gaming`; os nomes das variáveis são confirmados pelo código. Não há comando confirmado para lint, format, Supabase CLI, migrations ou Edge Functions.

## 33. Tests

- Ferramenta configurada: Vitest `^4.1.11`, plugin Angular Analog, `jsdom`, globals e `src/test.ts`.
- Foram encontrados 35 arquivos `*.spec.ts`, cobrindo app, home, header/footer, login, auth, guard, perfil, carrinho, checkout, produtos e detalhes de jogos.
- A maior parte dos testes é smoke/component creation. `checkout.spec.ts` testa criação do componente; `auth-guard.spec.ts` testa apenas existência da função; não há testes confirmados para pagamento, webhook, reconciliação, integridade de preço, persistência order, schema Supabase, RAWG, Steam ou ViaCEP.
- `auth.spec.ts` injeta `Auth`, mas a implementação exporta `AuthService`.
- Resultado auditado de `npm test -- --run`: falha; múltiplas suites não resolvem `@angular/fire/*`, há providers ausentes de `ActivatedRoute`, e pelo menos um spec tem erro de sintaxe (`'from' expected` em `elden-ring.spec.ts`).
- Resultado auditado de `npm run build`: falha; imports AngularFire não resolvem, `environment.firebase` não existe e há parâmetros implicitamente `any` em `CarrinhoFacade` após o caminho quebrado.
- Não há configuração E2E confirmada, apesar do README mencionar `ng e2e`.

## 34. Existing Documentation

`README.md` é o documento principal. Ele descreve Angular CLI 22.1.3, desenvolvimento, build, testes Vitest e fluxo Mercado Pago Checkout Pro. Também documenta variáveis de pagamento, proxy para SSR e limitações de produção: persistência de pedidos, validação/notificação, fulfillment, catálogo server-side e disponibilidade ainda precisam ser implementados.

`docs/` existe, mas conteúdo relevante adicional não foi confirmado nesta auditoria. Comentários em `AuthService`, `CarrinhoFacade` e `server.ts` registram intenção de migração futura para Supabase/orders, mas não substituem implementação real. O README cita `ng e2e`, embora não exista script/configuração E2E.

## 35. Current Issues / Technical Debt

| Problema | Arquivo | Evidência | Impacto | Status |
|---|---|---|---|---|
| Firebase imports não resolvem | `app.config.ts`, `carrinho.facade.ts` | Build/Test falham em `@angular/fire/*`; não está no `package.json` | Aplicação não compila/testa limpo | Confirmado |
| Config Firebase ausente | `app.config.ts`, `environment.ts` | `environment.firebase` é acessado, mas objeto só tem Supabase | Erro TS/build | Confirmado |
| Lockfile diverge do manifesto | `package.json`, `package-lock.json` | AngularFire/Firebase no lockfile raiz, ausentes no manifesto | Instalação reproduzível inconsistente | Confirmado |
| Auth duplicado | `auth.ts`, `carrinho.facade.ts` | Supabase Auth para login, Firebase Auth para carrinho | Sessões podem divergir; sincronização não usa usuário Supabase | Confirmado |
| Orders só em memória | `src/server.ts` | `new Map<string, Pedido>()` | Perda após restart, sem histórico/fulfillment | Confirmado |
| Checkout não vincula usuário/order | `server.ts`, `checkout.ts` | endpoint não exige auth; só recebe e-mail/itens | Sem ownership durável e risco operacional | Confirmado |
| Endereço/método ignorados | `checkout.ts` | `endereco` e `metodoPagamento` não entram na requisição | Dados da UI não chegam ao pagamento/order | Confirmado |
| Chave RAWG no frontend | `rawg.service.ts` | API key literal no código | Pode ser abusada/rotacionada | Confirmado; valor redigido |
| Rota de produto inexistente | `produtos.ts`, `app.routes.ts` | Navegação `/produto/:slug`, nenhuma rota correspondente | Links podem cair no wildcard | Confirmado |
| Rotas inconsistentes | `app.routes.ts` | `ragnarök`, `the-last-of-us-II`, `the-last-of-Us` e slugs divergentes | URLs frágeis/links quebrados | Confirmado |
| SSR route duplicada | `app.routes.server.ts` | `jogos/:id` aparece duas vezes | Configuração redundante/ambígua | Confirmado |
| Admin mock | `admin.ts`, `painel-admin-mock.service.ts` | usuários/pedidos são arrays fictícios; ações não persistem | Painel não representa dados reais | Confirmado |
| Teste stale | `auth.spec.ts` | injeta `Auth`, implementação exporta `AuthService` | Falha de teste | Confirmado |
| Cobertura de pagamentos ausente | `src/**/*.spec.ts` | nenhum teste de endpoint/webhook/reconciliação | Regressões financeiras não detectadas | Confirmado |
| `PUBLIC_APP_URL` default local | `server.ts` | fallback `http://localhost:4000` | Retornos inválidos em produção se não configurado | Confirmado |
| `vercel.json` rewrite genérico | `vercel.json` | todo path vai para `/index.html` | Compatibilidade com SSR/backend não confirmada | Atenção |
| README/comandos divergentes | `README.md`, `package.json` | README usa `npm.cmd` e `ng e2e`; não há script e2e | Instruções não portáveis/completas | Confirmado |
| Sem banco versionado | repositório inteiro | sem `supabase/`, SQL/migrations/schema | Estrutura remota não reproduzível | Confirmado |

## 36. Project Status

| Área | Status | Evidência |
|---|---|---|
| Frontend | PARCIAL | Páginas, rotas e UI existem; build falha |
| Auth | PARCIAL | Supabase Auth implementado, mas integração Firebase paralela/quebrada |
| Supabase | PARCIAL | Cliente/Auth/profile referenciados, sem schema/migrations |
| Catálogo | IMPLEMENTADO | 20 produtos hard-coded e service |
| RAWG | IMPLEMENTADO | Service e uso em detalhes; chave client-side |
| Steam | PARCIAL | App IDs/imagens CDN; sem API/entrega |
| Steam CDN | IMPLEMENTADO | URLs de imagens montadas por App ID |
| Carrinho | PARCIAL | LocalStorage implementado; sync Firestore não compila |
| Multidispositivo | PARCIAL | Fluxo Firestore escrito, mas dependência/configuração quebrada |
| ViaCEP | NÃO ENCONTRADO | Nenhuma integração |
| Checkout | PARCIAL | Formulário e preferência Mercado Pago; sem order persistente |
| Orders | PARCIAL | Map transitório apenas |
| Mercado Pago | IMPLEMENTADO | Preferência, consulta e webhook HMAC presentes |
| Webhook | PARCIAL | Validação/reconciliação em memória, sem persistência/fulfillment |
| Testes | PARCIAL | 35 specs, execução atual falha e cobertura de integrações é ausente |

## 37. Git

- Branch atual: `feat/migracao-supabase`.
- Estado no momento da auditoria: branch está `behind 2` em relação ao upstream; há alterações locais staged/working-tree reportadas em `package.json`, auth facade, guards, auth service, modelo `usuario-app`, `SupabaseService` e environment.
- HEAD: `ec01c5c` (`Merge branch 'tayssafreire' ...`).
- Commits recentes relevantes: `6fc7045 fix(payment): calcula preço no servidor e vincula pedido ao pagamento`; `7bd0b04 API Mercado Pago`.
- Remoto exibido pelo histórico: `https://github.com/NicoleSotnas/caribe-gaming.git`.
- `.gitignore` ignora `/dist`, `/node_modules`, `/.angular/cache`, coverage, logs, IDEs e `.env`/`.env.*.local`.
- `.git` não foi incluído na árvore. Não foram reproduzidos segredos nem conteúdo de objetos Git.

## 38. Instructions for AI Coding Agents

1. Leia este arquivo antes de modificar o projeto.
2. Considere o código real do repositório como fonte principal.
3. Não invente APIs, arquivos, funções ou dependências.
4. Preserve a arquitetura existente quando possível.
5. Não troque tecnologias sem solicitação explícita.
6. Não altere versões de dependências sem justificar.
7. Não exponha secrets.
8. Não coloque tokens privados no frontend.
9. Antes de criar um novo arquivo, verifique se já existe algo equivalente.
10. Antes de alterar uma função, verifique todos os lugares que a utilizam.
11. Preserve os contratos existentes entre services, facades, componentes e backend.
12. Ao propor mudanças, informe exatamente quais arquivos serão alterados.
13. Ao criar código, forneça código completo e pronto para copiar.
14. Considere este documento como um snapshot do projeto e confirme o código real quando o repositório estiver disponível.

## Validation Notes

- Diretórios omitidos propositalmente: `node_modules/`, `dist/`, `.angular/cache/` e `.git/`; são dependências, artefatos/cache ou metadados internos.
- Informações redigidas: chave RAWG literal, chave pública Supabase e qualquer possível valor de access token/secret Mercado Pago. Variáveis privadas aparecem somente como nomes e `[SECRET_REDACTED]`.
- O documento foi escrito a partir dos arquivos presentes no snapshot auditado; nenhum arquivo de aplicação foi corrigido durante a tarefa.