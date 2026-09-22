# CARIBE GAMING — AI PROJECT CONTEXT

## 0. Snapshot Metadata

| Campo | Estado auditado |
|---|---|
| Project | `caribe-gaming` |
| Branch | `tayssafreire` |
| HEAD | `30d775175d68d098153fd6b72739556faace4b5f` (`30d7751`) |
| Base/upstream | `origin/tayssafreire` confirmado; `origin/main` também existe. Relação `origin/main...HEAD`: 15 commits atrás / 1 à frente. Merge-base: confirmado no Git, hash omitido por brevidade. |
| Audit date | 2026-09-21 |
| Working tree | Inicialmente limpo. Após esta auditoria, contém este arquivo novo não rastreado. |
| Staged changes | Nenhuma antes da geração; nenhuma além deste arquivo após a geração. |
| Unstaged changes | Nenhuma antes da geração. |
| Untracked files | `AI_PROJECT_CONTEXT.md`, criado nesta auditoria. |
| Deleted files | Nenhum confirmado pelo `git status`. |
| Build status | FAIL. `npm run build` terminou com código 1; ver seção 37. |
| Test status | FAIL. `npm test -- --watch=false` terminou com código 1 durante a compilação; ver seção 36. |

## 1. Project Overview

Aplicação de comércio de jogos chamada Caribe Gaming. O repositório contém uma aplicação Angular standalone com SSR/Express, catálogo estático de jogos, autenticação Firebase, favoritos locais, carrinho local com sincronização Firestore e um fluxo inicial de checkout Mercado Pago. Persistência de pedidos, estoque, entrega de chaves e banco relacional não foram encontrados.

## 2. Current Project Status

| Área | Status | Evidência |
|---|---|---|
| Frontend | IMPLEMENTADO, MAS QUEBRADO | Angular em `src/app`; build falha. |
| Backend/SSR | PARCIAL | `src/server.ts` usa Express e Angular SSR; execução completa não validada por build falho. |
| Auth | IMPLEMENTADO, MAS QUEBRADO | Firebase Auth em `auth.ts`; imports não resolvem no build. |
| Supabase | NÃO ENCONTRADO | Nenhum uso de Supabase no código/configuração. |
| Database | PARCIAL | Firestore é usado para carrinhos; não há persistência de pedidos. |
| Catalog | IMPLEMENTADO | Lista estática em `ProdutosService`; preços oficiais no servidor. |
| RAWG | IMPLEMENTADO, MAS COM CHAVE NO FRONTEND | `RawgService` chama detalhes e screenshots. |
| Steam | PARCIAL | Há `steamAppId`/imagens; Steam Web API não foi encontrada. |
| Steam Store CDN | IMPLEMENTADO | Uso em imagens de produtos, conforme referências do catálogo. |
| Cart | IMPLEMENTADO, MAS QUEBRADO NO BUILD | Signals, localStorage e Firestore. |
| Multidevice cart | PARCIAL | `docData` em `carrinhos/{uid}` e atualização em tempo real; sem controle de concorrência. |
| Checkout | PARCIAL | Formulário e chamada de preferência existem; integração depende do SSR configurado. |
| ViaCEP | NÃO ENCONTRADO | Nenhum service, endpoint ou consumidor confirmado. |
| Orders | PARCIAL | `Map` em memória no servidor, sem persistência. |
| Mercado Pago | PARCIAL | Preferência, consulta e webhook no SSR; backend legado paralelo. |
| Webhook | IMPLEMENTADO, MAS NÃO VALIDADO | HMAC existe em `src/server.ts`; sem teste executado. |
| Admin | PARCIAL | Guard por e-mail fixo e painel mock; sem autorização server-side confirmada. |
| Tests | IMPLEMENTADO, MAS QUEBRADO | 34 arquivos `.spec.ts`; compilação falha. |
| Build | IMPLEMENTADO, MAS QUEBRADO | `npm run build` falha. |
| Deploy | PARCIAL | `vercel.json` existe; não há validação de produção. |

## 3. Git / Branch State

- Branch atual: `tayssafreire`.
- HEAD: commit `30d7751`, assunto `Mercado Pago API teste1`, datado de 2026-09-21.
- Upstream confirmado: `origin/tayssafreire`.
- Relação confirmada com `origin/main`: branch local está 15 commits à frente e 1 atrás.
- Commits recentes relevantes: `30d7751 Mercado Pago API teste1`; `6fc7045 fix(payment): calcula preço no servidor e vincula pedido ao pagamento`; `7bd0b04 API Mercado Pago`; `d96b461 alteracao visual carrinho`.
- Antes desta auditoria: não havia staged, unstaged, untracked ou deletions.
- O histórico também contém `server/mp-backend/node_modules` versionado; esses artefatos são omitidos da árvore abaixo.

## 4. Changes Not Yet Committed

### Staged

Nenhuma alteração staged.

### Unstaged

Nenhuma alteração unstaged detectada antes da criação deste documento.

### Untracked

- `AI_PROJECT_CONTEXT.md`: snapshot técnico criado por esta auditoria; finalidade identificada: documentar o estado real para outras IAs.

### Deleted

Nenhum arquivo deletado confirmado.

## 5. Technology Stack

| Categoria | Tecnologia | Versão | Evidência | Estado |
|---|---|---|---|---|
| Frontend | Angular | declarada `^22.1.x`; lockfile presente | `package.json`, `angular.json` | IMPLEMENTADO, MAS QUEBRADO |
| Linguagem | TypeScript | `~6.0.2` | `package.json` | IMPLEMENTADO |
| Runtime | Node.js | executado `v22.22.3` | comando `node --version` | CONFIRMADO |
| Package manager | npm | executado `11.13.0`; `packageManager` declarado | `package.json` | CONFIRMADO |
| SSR | Angular SSR + Express | Angular `^22.1.3`, Express `^5.1.0` | `src/server.ts`, `angular.json` | PARCIAL |
| Auth/DB | Firebase / AngularFire | Firebase `^12.18.0`, AngularFire `^20.0.1` | configuração e imports | IMPLEMENTADO, MAS QUEBRADO |
| Banco | Firestore | versão resolvida NÃO CONFIRMADA | `CarrinhoFacade` | PARCIAL |
| Reatividade | Signals | versão Angular | services/facades | IMPLEMENTADO |
| HTTP | RxJS + Angular HttpClient | RxJS `~7.8.0` | services | IMPLEMENTADO |
| UI | Angular Material, PrimeNG, PrimeIcons | declaradas | `package.json`/styles | IMPLEMENTADO/NÃO CONFIRMADO por componente |
| Testes | Vitest via Angular CLI, jsdom | Vitest `^4.0.8`, jsdom `^28.0.0` | `package.json`, `angular.json` | QUEBRADO |
| Pagamentos | Mercado Pago | SDK `^3.6.1` | backend legado; SSR usa `fetch` | PARCIAL |
| APIs | RAWG | NÃO CONFIRMADO | `RawgService` | IMPLEMENTADO |
| Supabase/PostgreSQL | NÃO ENCONTRADO | NÃO CONFIRMADO | busca no repositório | NÃO ENCONTRADO |

## 6. Versions

- Versões declaradas estão em `package.json`; lockfile é `package-lock.json`, lockfileVersion 3.
- Angular principal: `^22.1.0` a `^22.1.2`; CLI/build/SSR chegam a `^22.1.3`.
- TypeScript declarado: `~6.0.2`; `@types/node` `^20.17.19` não representa a versão do runtime.
- Runtime efetivamente executado nesta auditoria: Node `v22.22.3`, npm `11.13.0`.
- Versões resolvidas de todos os pacotes não foram reproduzidas neste documento; devem ser lidas do lockfile. A disponibilidade efetiva de `@angular/fire/auth` e `@angular/fire/firestore` não foi confirmada, pois o build não consegue resolvê-los.

## 7. Dependencies

### dependencies

`@angular/animations ^22.1.2`, `@angular/cdk ^22.1.2`, `@angular/common ^22.1.0`, `@angular/compiler ^22.1.0`, `@angular/core ^22.1.0`, `@angular/fire ^20.0.1`, `@angular/forms ^22.1.0`, `@angular/material ^22.1.2`, `@angular/platform-browser ^22.1.0`, `@angular/platform-server ^22.1.0`, `@angular/router ^22.1.0`, `@angular/ssr ^22.1.3`, `express ^5.1.0`, `firebase ^12.18.0`, `mercadopago ^3.6.1`, `primeicons ^8.0.0`, `primeng ^22.1.0`, `rxjs ~7.8.0`, `tslib ^2.3.0`.

Finalidades confirmadas: Angular UI/runtime/SSR/forms/router; AngularFire/Firebase Auth e Firestore; Express servidor; Mercado Pago SDK no backend legado; RxJS observables; PrimeNG/Material para UI.

### devDependencies

`@angular/build ^22.1.3`, `@angular/cli ^22.1.3`, `@angular/compiler-cli ^22.1.0`, `@types/express ^5.0.1`, `@types/node ^20.17.19`, `jsdom ^28.0.0`, `prettier ^3.8.1`, `typescript ~6.0.2`, `vitest ^4.0.8`.

Não foi encontrada dependência de Supabase, PostgreSQL/ORM, ViaCEP ou Testing Library. O lockfile contém o conjunto resolvido correspondente ao package.json; nenhuma dependência extra relevante foi confirmada fora dele.

## 8. Scripts

| Script | Comando | Uso |
|---|---|---|
| `ng` | `ng` | CLI Angular |
| `start` | `ng serve --proxy-config proxy.conf.json` | desenvolvimento |
| `build` | `ng build` | build browser/SSR |
| `watch` | `ng build --watch --configuration development` | build incremental |
| `test` | `ng test` | testes Angular |
| `serve:ssr:caribe-gaming` | `node dist/caribe-gaming/server/server.mjs` | servir build SSR |

## 9. Repository Structure

```text
angular.json
package.json
package-lock.json
proxy.conf.json
vercel.json
README.md
docs/
public/img/
server/mp-backend/index.js
server/mp-backend/mp-backend.env
server/mp-backend/package.json
src/index.html
src/main.ts
src/main.server.ts
src/server.ts
src/styles.css
src/app/app.*
src/app/core/{facades,guards,models,services}
src/app/features/{admin,carrinho,checkout,login,perfil,produtos,sobrenos}
src/app/home/home/*
src/app/shared/{footer,header}/*
```

Diretórios omitidos propositalmente: `node_modules`, `server/mp-backend/node_modules`, `.angular`, `dist` e caches; são dependências/artefatos gerados. O `server/mp-backend/node_modules` também aparece versionado no histórico, mas não é fonte da aplicação.

## 10. Configuration Files

- `package.json`/`package-lock.json`: dependências e scripts.
- `angular.json`: aplicação `caribe-gaming`, browser `src/main.ts`, server `src/main.server.ts`, SSR `src/server.ts`, `outputMode: server`.
- `tsconfig*.json`: ES2022, strict injection parameters, includes separados para app e specs.
- `proxy.conf.json`: `/api` para `http://127.0.0.1:3000`.
- `src/environments/environment.ts`: configuração Firebase com valores redigidos neste documento.
- `vercel.json`: rewrite de qualquer caminho para `/index.html`; compatibilidade com SSR não foi validada.
- Não foram encontrados configurações ESLint, CI, Docker, migrations ou configuração Supabase.

## 11. Environment Variables

| Nome | Onde | Finalidade | Exposição |
|---|---|---|---|
| `MERCADOPAGO_ACCESS_TOKEN` | `src/server.ts` | API Mercado Pago | privada; valor não incluído |
| `MERCADOPAGO_WEBHOOK_SECRET` | `src/server.ts` | HMAC do webhook | privada; valor não incluído |
| `MERCADOPAGO_WEBHOOK_URL` | `src/server.ts` | URL de notificação | configuração server-side |
| `PUBLIC_APP_URL` | `src/server.ts` | URLs de retorno do checkout | configuração pública |
| `PORT` | `src/server.ts` | porta do Express SSR; default 4000 | configuração |
| `pm_id` | `src/server.ts` | condição para iniciar servidor | configuração |
| `MP_ACCESS_TOKEN` | `server/mp-backend/index.js`, `mp-backend.env` | token do backend legado | privada; `[SECRET_REDACTED]` |

`environment.ts` contém configuração Firebase e `rawg.service.ts` contém uma chave RAWG hardcoded. Os valores foram deliberadamente omitidos/redigidos. O arquivo `server/mp-backend/mp-backend.env` contém uma credencial Mercado Pago versionada: `[SECRET_REDACTED]`.

## 12. Frontend Architecture

Angular standalone com `provideRouter`, `provideHttpClient`, hidratação de cliente e providers Firebase. Components usam templates HTML e CSS por feature. Services são injetáveis; `AuthFacade` e `CarrinhoFacade` expõem estado. Signals são usados no carrinho e auth; RxJS é usado em Firebase/Auth/HTTP. Não há Supabase nem camada backend de catálogo. SSR protege localStorage com `isPlatformBrowser` no carrinho.

## 13. Routes

| Rota | Componente | Guard | Lazy | Estado |
|---|---|---|---|---|
| `/` | Home | - | loadComponent | implementada |
| `/sobre-nos`, `/jogos` | Sobrenos, Produtos | - | parcial | implementadas |
| `/jogos/...` | páginas individuais de jogos | - | não | implementadas |
| `/login`, `/registro` | Login, Registro | - | Registro lazy | implementadas |
| `/carrinho` | Carrinho | - | lazy | implementada |
| `/checkout` | Checkout | `authGuard` | não | implementada, dependente de build |
| `/perfil` | Perfil | `authGuard` | não | implementada, dependente de build |
| `/admin` | Admin | `adminGuard` | não | implementada, mock |
| `**` | redirect para `/` | - | - | implementada |

Inconsistências confirmadas: há navegação para `/produto/...` no código, mas essa rota não existe; as rotas declaradas usam `/jogos/...`. Existem slugs com capitalização inconsistente (`the-last-of-us-II` e `the-last-of-Us`). `app.routes.server.ts` contém declaração duplicada de `jogos/:id` segundo auditoria do arquivo. `DetalheJogo` existe, mas a rota genérica não foi confirmada como consumidora.

## 14. Authentication

Firebase Auth com e-mail/senha, Google popup, registro com `displayName`, logout, recuperação de senha e atualização de nome. `AuthService.usuarioAtual$` usa `user(this.auth)`; `AuthFacade` converte para signal. Recuperação de senha existe no service, mas não foi confirmada uma tela consumidora. Não há Supabase Auth, refresh customizado ou OAuth além do provider Google Firebase.

## 15. Authorization / Roles

`authGuard` permite usuário Firebase autenticado para checkout/perfil. `adminGuard` compara o e-mail com `admin@email.com`; `AuthFacade.ehAdmin` repete a mesma regra. Não foi encontrada role persistida, custom claim, verificação backend, RLS ou policy versionada. Isso é proteção de navegação/visual, não autorização server-side confirmada. O painel admin usa `PainelAdminMockService`.

## 16. Supabase

NÃO ENCONTRADO. Não há client, URL, migrations, RPC, Edge Functions, storage, realtime, policies ou seeds Supabase. Comentário em `src/server.ts` menciona uma futura migração de pedidos para Supabase, portanto: PLANEJADO — NÃO IMPLEMENTADO.

## 17. Database

| Armazenamento | Estrutura | PK/FK/constraints/RLS | Estado |
|---|---|---|---|
| Firestore | documento `carrinhos/{uid}` com `itens` e `atualizadoEm` | regras/RLS não encontradas | PARCIAL |
| Pedidos | `Map<string, Pedido>` no processo Node | desaparece ao reiniciar; sem FK/RLS | PARCIAL |
| SQL | nenhuma tabela/migration/view/index confirmada | NÃO CONFIRMADO | NÃO ENCONTRADO |

Não foram encontradas functions, triggers, migrations ou policies de banco versionadas. Catálogo e preços são código TypeScript, não tabela persistente.

## 18. Models / Interfaces / Types

- `ItemCarrinho` em `src/app/core/models/item-carrinho.ts`: `id?: number|string`, `nome`, `preco`, `quantidade?`, `imagemUrl?`, `plataforma?`, `categoria?`.
- `DetalhesJogo`, `RawgGameResponse` e `RawgScreenshotResponse` em `rawg.service.ts` modelam respostas RAWG.
- `PreferenciaMercadoPago` e `PagamentoMercadoPago` em `mercado-pago.service.ts` modelam o contrato frontend.
- `Pedido` em `src/server.ts`: `totalCentavos`, `status` (`pending|paid|failed`) e `paymentId?`.
- `PRECOS` em `src/server/catalogo-precos.ts` mapeia IDs string para nome e preço em centavos.

## 19. Services

- `AuthService`: Firebase Auth; login, Google, registro, reset, logout, atualização de nome e usuário atual.
- `CarrinhoService`: signal local, quantidades, totais e localStorage `caribe-gaming-carrinho`.
- `ProdutosService`: catálogo estático, filtros e metadados de produtos; detalhes da lista completa estão no arquivo.
- `FavoritosService`: favoritos no cliente; persistência exata deve ser lida no arquivo.
- `RawgService`: GET para detalhes e screenshots RAWG.
- `MercadoPagoService`: POST de preferência com somente id/quantidade e GET de pagamento.
- `PainelAdminMockService`: dados mock do painel; não é backend real.

## 20. Facades

- `AuthFacade`: signal do usuário, estado logado, nome exibido e comparação de admin; delega ao `AuthService`.
- `CarrinhoFacade`: observa Firebase user, carrega/mescla/salva Firestore, expõe signals do `CarrinhoService`.

## 21. Guards

- `authGuard` em `src/app/core/guards/auth-guard.ts`: `user(auth).pipe(take(1))`; aceita usuário, navega para `/login` e retorna `false` caso contrário.
- `adminGuard` em `src/app/core/guards/admin-guard.ts`: aceita somente e-mail `admin@email.com`; caso contrário navega para `/` e retorna `false`.
- Ambos dependem de AngularFire Auth e atualmente participam dos erros de resolução do build.

## 22. Components / Features

- `auth`: login e registro em `features/login`; Firebase Auth via service/facade.
- `catalog`: `features/produtos/produtos` com lista estática, filtros e favoritos.
- `product`: múltiplas páginas específicas sob `features/produtos`; `detalhe-jogo` existe como componente genérico.
- `cart`: `features/carrinho`, `CarrinhoFacade`, `CarrinhoService`, `ItemCarrinho`.
- `checkout`: formulário em `features/checkout/checkout`, `MercadoPagoService` e retorno de pagamento.
- `orders/payments`: não há feature de pedidos persistidos; status é resolvido pelo backend em memória.
- `profile`: perfil protegido, usa facade de auth.
- `admin`: painel com service mock e guard por e-mail.
- `shared`: header e footer.
- `home`: página inicial.
- `sobrenos`: página Sobre Nós.

## 23. External APIs

| API | Finalidade | Arquivo | Endpoint/método | Auth | Estado |
|---|---|---|---|---|---|
| Firebase Auth/Firestore | auth/carrinho | app config, services | SDK | config Firebase | PARCIAL |
| RAWG | detalhes/screenshots | `rawg.service.ts` | `/api/games/{id}` e `/screenshots`, GET | chave query | IMPLEMENTADO |
| Mercado Pago atual | preference/payment/webhook | `src/server.ts` | `/api/mercado-pago/*` e API MP | env server | PARCIAL |
| Mercado Pago legado | preference | `server/mp-backend/index.js` | `/api/mp/preference` | env server | PARCIAL |
| ViaCEP | CEP | NÃO ENCONTRADO | NÃO ENCONTRADO | NÃO CONFIRMADO | NÃO ENCONTRADO |

## 24. RAWG

`RawgService` chama `https://api.rawg.io/api/games/{jogoIdOuSlug}?key=...` e `/games/{id}/screenshots?key=...`. Modelos incluem nome, descrição, lançamento, desenvolvedoras, publishers, classificação, plataformas e imagem. A chave está no bundle frontend: segredo/credencial redigida, risco de exposição. Não há tratamento de erro customizado confirmado. Consumidores são páginas de produtos/detalhes que solicitam dados sob demanda.

## 25. Steam

O catálogo possui `steamAppId` para produtos e links/imagens associados. Não foi encontrado login Steam, Steam Web API, validação de licença, estoque ou entrega de chaves. Declarar Steam API seria incorreto: estado atual é PARCIAL, com uso de IDs/assets.

## 26. Steam Store CDN

Há uso real de imagens da CDN pública da Steam no catálogo/produtos. O formato exato das URLs deve ser mantido conforme `ProdutosService`; a auditoria confirmou referências a `steamcdn/store.steampowered`, mas não há fallback ou download de assets confirmado. App IDs entram nos dados de catálogo. Não é uma integração de API Steam.

## 27. ViaCEP

NÃO ENCONTRADO. Não há service, endpoint, validação de CEP, modelo de resposta ou consumidor ViaCEP confirmado. O checkout possui campos de endereço, mas isso não prova integração CEP.

## 28. Mercado Pago

Há duas implementações. A atual em `src/server.ts` usa `fetch` para `/checkout/preferences` e `/v1/payments/{id}`, recalcula preço por ID usando `PRECOS`, cria `external_reference` UUID, envia `X-Idempotency-Key` e recebe webhook HMAC. O frontend usa `/api/mercado-pago/preference` e `/payment/{id}`. A implementação legada usa SDK `mercadopago` e `/api/mp/preference` na porta 3000; o proxy aponta para essa porta, mas os caminhos não coincidem. `MERCADOPAGO_ACCESS_TOKEN`, webhook secret e URLs são server-side; a credencial em `mp-backend.env` está versionada e foi redigida. Não há reconciliação persistente, fulfillment ou teste automatizado confirmado.

## 29. Cart

O carrinho usa Signals e localStorage no navegador. `CarrinhoFacade` observa login Firebase, carrega `carrinhos/{uid}`, soma itens locais e remotos no primeiro login, salva com `setDoc` e reage a mudanças via `docData`. Logout limpa o carrinho local. Não há Firestore transaction, controle de concorrência ou regras de acesso versionadas confirmadas. Multidispositivo é PARCIAL.

## 30. Checkout

`Checkout` contém formulário de nome, e-mail e endereço, busca usuário atual e usa o carrinho. `MercadoPagoService` envia IDs/quantidades e e-mail; o servidor calcula nomes/preços. O endereço é validado no frontend, mas não foi confirmado no payload/pedido do servidor. O retorno consulta pagamento e só então limpa o carrinho. Pix/cartão/boleto aparecem como opções visuais; método específico não foi confirmado no payload Mercado Pago.

## 31. Orders / Payments

### Order

Pedido é uma entrada em `Map` em memória indexada por `externalReference`, contendo total, status e paymentId. Não há tabela/coleção persistente.

### Payment

Servidor consulta pagamento Mercado Pago e confere `external_reference` e `transaction_amount` contra preço oficial. Estados aprovados viram `paid`; rejeitados/cancelados viram `failed`.

### Webhook

Endpoint `/api/mercado-pago/webhook` valida assinatura HMAC SHA-256 e chama reconciliação para eventos `payment`. Idempotência lógica existe no status/consulta, mas não há armazenamento durable.

### Fulfillment

NÃO ENCONTRADO. Não há entrega de chave, estoque ou conclusão de pedido persistente.

## 32. Business Rules

- Preços do pagamento vêm de `src/server/catalogo-precos.ts`, em centavos, não do cliente.
- Cada item enviado deve ter ID conhecido e quantidade inteira de 1 a 99.
- Até 50 itens de entrada são aceitos; itens gratuitos são ignorados no gateway.
- E-mail do payer precisa passar regex básica e ter no máximo 254 caracteres.
- Carrinho soma quantidades por ID; sem ID, usa nome.
- Decremento não reduz abaixo de 1; remoção é por índice.
- Admin é o e-mail fixo `admin@email.com`.
- Checkout e perfil exigem usuário Firebase; admin exige regra de e-mail.

## 33. Main Application Flows

- Cadastro/login: tela Login/Registro -> `AuthFacade` -> `AuthService` -> Firebase Auth.
- Catálogo: Home/Produtos -> `ProdutosService` -> lista estática; detalhes -> `RawgService` -> RAWG.
- Favoritos: componentes -> `FavoritosService` -> armazenamento local conforme implementação existente.
- Carrinho: Produto -> `CarrinhoFacade` -> `CarrinhoService` -> localStorage; usuário logado -> Firestore.
- Checkout: Checkout -> `MercadoPagoService` -> `/api/mercado-pago/preference` -> Mercado Pago; retorno -> `/payment/{id}` -> reconciliação.
- CEP: NÃO ENCONTRADO.
- Admin: rota -> `adminGuard` -> Admin -> dados mock; backend authorization não confirmada.
- Webhook: Mercado Pago -> `/api/mercado-pago/webhook` -> HMAC -> `reconciliar` -> Map em memória.

## 34. Dependency Map

```text
Login/Registro -> AuthFacade -> AuthService -> AngularFire Auth -> Firebase Auth
Perfil/Checkout -> authGuard -> AngularFire Auth
Produto -> ProdutosService -> lista estática / Steam CDN
Detalhes -> RawgService -> RAWG API
Produto/Carrinho -> CarrinhoFacade -> CarrinhoService -> localStorage
CarrinhoFacade -> AngularFire Firestore -> carrinhos/{uid}
Checkout -> MercadoPagoService -> src/server.ts -> Mercado Pago
src/server.ts -> catalogo-precos.ts
Admin -> adminGuard -> e-mail fixo -> painel mock
```

## 35. Source Code

Arquivos críticos completos existem no repositório. Abaixo estão os contratos compactos mais relevantes em estado atual; credenciais foram redigidas. Arquivos grandes como `src/server.ts` (209 linhas), `CarrinhoFacade` (178 linhas), `ProdutosService` e `Checkout` foram omitidos por tamanho; o arquivo real é a fonte de verdade.

### `src/app/core/models/item-carrinho.ts`

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

### `src/app/core/facades/auth.facade.ts`

```ts
import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../services/auth';

const EMAIL_ADMIN = 'admin@email.com';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authService = inject(AuthService);
  usuarioAtual = toSignal(this.authService.usuarioAtual$, { initialValue: null });
  estaLogado(): boolean { return !!this.usuarioAtual(); }
  ehAdmin = computed(() => this.usuarioAtual()?.email === EMAIL_ADMIN);
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

### `src/app/core/services/rawg.service.ts` e `src/app/core/services/mercado-pago.service.ts`

Os arquivos completos estão no repositório. Seus contratos são: RAWG GET de detalhes/screenshots com chave query redigida; Mercado Pago POST de IDs/quantidades para `/api/mercado-pago/preference` e GET de `/api/mercado-pago/payment/:id`. A chave RAWG real não é reproduzida neste documento.

### `src/server/catalogo-precos.ts`

É a tabela TypeScript oficial de 20 IDs, nomes e preços em centavos. O código completo atual está no arquivo; nenhum segredo está presente nele.

## 36. Tests

- Framework declarado: Angular CLI unit-test builder com Vitest e jsdom.
- Inventário: 34 arquivos `.spec.ts`, cobrindo app, auth guard/service, carrinho, checkout, login, perfil, home, header/footer, Sobre Nós, Produtos e páginas individuais.
- A maioria aparenta testar criação; cobertura comportamental, Firestore, Mercado Pago, webhook, RAWG, rotas inválidas, persistência e concorrência não foi confirmada.
- `npm test -- --watch=false`: FAIL, código 1, durante compilação. Erros confirmados: módulos `@angular/fire/auth`/`firestore` não resolvidos, tipos de usuário inferidos como `{}`, import de `Auth` não exportado pelo spec, sintaxe inválida em `elden-ring.spec.ts` e nomes de classes divergentes em specs de God of War, GTA V e The Sims.
- O backend legado possui script de teste que falharia (`no test specified`), mas não foi executado porque não é script raiz.

## 37. Build / Runtime Status

- `npm run build`: FAIL, código 1.
- Causa observada: resolução de `@angular/fire/auth` e `@angular/fire/firestore` falha; também há erros de tipos em auth/checkout/perfil e erros de specs incluídas no pipeline Angular.
- Impacto: bundle SSR/browser não foi gerado com sucesso; `serve:ssr:caribe-gaming` não foi validado.
- `npm test -- --watch=false`: FAIL, código 1, pelas falhas de compilação listadas acima.
- Nenhuma dependência foi instalada/atualizada nesta auditoria.

## 38. Current Issues / Technical Debt

| Problema | Arquivo | Evidência | Impacto | Estado |
|---|---|---|---|---|
| AngularFire não resolve no build | services/facades/guards | TS2307 | app não compila | IMPLEMENTADO, MAS QUEBRADO |
| tipos Firebase viram `{}` | auth facade/checkout/perfil | TS2339 | compilação falha | IMPLEMENTADO, MAS QUEBRADO |
| specs importam classes inexistentes/sintaxe inválida | specs de jogos | TS1005/TS2724 | testes falham | IMPLEMENTADO, MAS QUEBRADO |
| rota `/produto` ausente | Produtos/Home vs routes | navegação para caminho não declarado | links podem cair no wildcard | CONFIRMADO |
| duas APIs Mercado Pago incompatíveis | `src/server.ts`, `server/mp-backend` e proxy | caminhos/variáveis/portas diferentes | checkout local pode não atingir endpoint atual | PARCIAL |
| pedidos só em memória | `src/server.ts` | `Map` | perda após restart | PARCIAL |
| credencial MP versionada | `server/mp-backend/mp-backend.env` | token presente, valor redigido | exposição de segredo | CRÍTICO |
| chave RAWG no frontend | `rawg.service.ts` | hardcoded | exposição/abuso de quota | CRÍTICO |
| admin só por e-mail no cliente | guards/facade | comparação fixa | sem segurança server-side confirmada | PARCIAL |
| checkout não persiste endereço/pedido | checkout/server | ausência no contrato do servidor | pedido incompleto | PARCIAL |

## 39. Security Audit Notes

- Segredo MP versionado em `server/mp-backend/mp-backend.env`: valor omitido como `[SECRET_REDACTED]`.
- Chave RAWG hardcoded no frontend: valor omitido.
- Configuração Firebase pública no bundle é esperada para client config, mas regras Firebase não estão versionadas/confirmadas.
- Access token Mercado Pago atual é lido de env no servidor; não foi reproduzido.
- Webhook possui HMAC e comparação timing-safe, porém não há testes nem persistência idempotente durable.
- Preço é recalculado no servidor para a preferência e conferido na consulta de pagamento.
- Admin não possui check server-side/role/RLS confirmado.
- Carrinho usa localStorage; não guardar dados sensíveis foi confirmado como regra do código.
- Input de checkout e itens tem validações básicas; validação completa de autorização, estoque e fulfillment não existe.

## 40. Documentation

`README.md`, `docs/` e comentários em código existem. README descreve variáveis Mercado Pago e comandos, mas usa exemplo de `PUBLIC_APP_URL` em `localhost:4200`, enquanto o SSR default é 4000 e `src/server.ts` usa 4000; isso é divergência documental/configuracional. Comentários do servidor mencionam futura tabela Supabase, que é PLANEJADO — NÃO IMPLEMENTADO. Não foi encontrada documentação de schema, RLS ou API formal.

## 41. Deployment / Infrastructure

SSR Express está configurado em `angular.json`/`src/server.ts`; porta default 4000. `proxy.conf.json` aponta `/api` para 127.0.0.1:3000, onde o backend legado pode rodar. `vercel.json` contém rewrite para `/index.html`, mas produção não foi validada e compatibilidade com SSR é NÃO CONFIRMADA. Não há CI/CD, Docker, staging, domínio ou Supabase Edge Function confirmados.

## 42. AI Coding Instructions

1. Este documento é um snapshot do repositório e pode ficar desatualizado.
2. O código real do repositório é a fonte de verdade.
3. Antes de alterar um arquivo, confirme sua existência e conteúdo.
4. Não invente arquivos, APIs, tabelas ou dependências.
5. Não troque tecnologia sem solicitação explícita.
6. Não atualize dependências sem necessidade.
7. Não exponha secrets.
8. Não coloque tokens privados no frontend.
9. Verifique impactos em arquivos consumidores antes de alterar contratos.
10. Preserve nomes e contratos existentes quando não houver motivo para quebrá-los.
11. Considere alterações não commitadas como trabalho em andamento.
12. Não sobrescreva alterações locais sem analisar seu impacto.
13. Antes de alterar banco, verifique migrations e schema existente.
14. Antes de criar service/component, procure implementação equivalente.
15. Ao alterar pagamentos, trate preço, autenticação, idempotência e webhook como áreas críticas.
16. Ao alterar carrinho, considere persistência, login/logout e multidispositivo.
17. Ao concluir uma alteração arquitetural, atualize este contexto.

## 43. Snapshot Change Summary

Primeiro snapshot — não existe contexto anterior para comparação.

- ADICIONADO: `AI_PROJECT_CONTEXT.md`, criado como arquivo não rastreado nesta auditoria.
- ALTERADO: nenhum arquivo da aplicação, configuração, dependência ou banco.
- REMOVIDO: nenhum.
- DEPENDÊNCIAS: nenhuma alteração local detectada.
- BANCO: nenhuma migration/schema alterado; Firestore de carrinho e `Map` de pedidos apenas documentados.
- INTEGRAÇÕES: estado atual documentado para Firebase, RAWG, Steam CDN e Mercado Pago; ViaCEP/Supabase não encontrados.
- STATUS: build e testes falham no estado auditado; não foram feitas correções.
