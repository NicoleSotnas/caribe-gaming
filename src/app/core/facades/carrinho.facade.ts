import {
  Injectable,
  inject,
  signal,
  PLATFORM_ID,
  EnvironmentInjector,
  runInInjectionContext,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { CarrinhoService } from '../services/carrinho.service';
import { ItemCarrinho } from '../models/item-carrinho';

@Injectable({
  providedIn: 'root',
})
export class CarrinhoFacade {
  private carrinhoService = inject(CarrinhoService);
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private platformId = inject(PLATFORM_ID);
  private injector = inject(EnvironmentInjector);

  private user$ = user(this.auth);
  private userId = signal<string | null>(null);
  private isCarregandoNuvem = false;

  itens = this.carrinhoService.itens;
  quantidade = this.carrinhoService.quantidade;
  total = this.carrinhoService.total;
  carrinhoVazio = this.carrinhoService.carrinhoVazio;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMonitoramentoAuth();
    }
  }

  private iniciarMonitoramentoAuth(): void {
    this.user$.subscribe((usr) => {
      if (usr) {
        const uidAnterior = this.userId();
        this.userId.set(usr.uid);

        if (uidAnterior !== usr.uid) {
          this.sincronizarComFirestore(usr.uid);
        }
      } else {
        const estavaLogado = !!this.userId();
        this.userId.set(null);

        if (estavaLogado) {
          this.carrinhoService.limpar();
        }
      }
    });
  }

  adicionarProduto(produto: ItemCarrinho): void {
    this.carrinhoService.adicionar(produto);
    this.salvarSeLogado();
  }

  aumentarQuantidade(indice: number): void {
    this.carrinhoService.aumentarQuantidade(indice);
    this.salvarSeLogado();
  }

  diminuirQuantidade(indice: number): void {
    this.carrinhoService.diminuirQuantidade(indice);
    this.salvarSeLogado();
  }

  removerItem(indice: number): void {
    this.carrinhoService.removerPorIndice(indice);
    this.salvarSeLogado();
  }

  limparCarrinho(): void {
    this.carrinhoService.limpar();
    this.salvarSeLogado();
  }

  private salvarSeLogado(): void {
    const uid = this.userId();
    if (uid && !this.isCarregandoNuvem) {
      this.salvarNoFirestore(uid, this.itens());
    }
  }

  // Sincronização via getDoc direto (elimina qualquer conflito de tipo de Observable do docData)
  private async sincronizarComFirestore(uid: string): Promise<void> {
    this.isCarregandoNuvem = true;

    try {
      await runInInjectionContext(this.injector, async () => {
        const docRef = doc(this.firestore, `carrinhos/${uid}`);
        const snapshot = await getDoc(docRef);

        const itensLocais = this.itens();

        if (snapshot.exists()) {
          const dadosNuvem = snapshot.data() as any;
          const itensNuvem: ItemCarrinho[] = dadosNuvem?.itens || [];

          if (itensLocais.length > 0) {
            const itensMesclados = this.mesclarCarrinhos(itensNuvem, itensLocais);
            this.carrinhoService.definirItens(itensMesclados);
            await this.salvarNoFirestore(uid, itensMesclados);
          } else {
            this.carrinhoService.definirItens(itensNuvem);
          }
        } else {
          // Se não existe na nuvem mas tem itens locais, salva na nuvem
          if (itensLocais.length > 0) {
            await this.salvarNoFirestore(uid, itensLocais);
          }
        }
      });
    } catch (err) {
      console.error('Erro ao sincronizar carrinho com Firestore:', err);
    } finally {
      this.isCarregandoNuvem = false;
    }
  }

  private mesclarCarrinhos(nuvem: ItemCarrinho[], local: ItemCarrinho[]): ItemCarrinho[] {
    const mapa = new Map<string, ItemCarrinho>();

    nuvem.forEach((item) => {
      const chave = item.id !== undefined && item.id !== null ? String(item.id) : item.nome;
      mapa.set(chave, { ...item, quantidade: item.quantidade || 1 });
    });

    local.forEach((item) => {
      const chave = item.id !== undefined && item.id !== null ? String(item.id) : item.nome;
      if (mapa.has(chave)) {
        const itemExistente = mapa.get(chave)!;
        itemExistente.quantidade = (itemExistente.quantidade || 1) + (item.quantidade || 1);
      } else {
        mapa.set(chave, { ...item, quantidade: item.quantidade || 1 });
      }
    });

    return Array.from(mapa.values());
  }

  private async salvarNoFirestore(uid: string, itens: ItemCarrinho[]): Promise<void> {
    try {
      await runInInjectionContext(this.injector, async () => {
        const docRef = doc(this.firestore, `carrinhos/${uid}`);
        await setDoc(docRef, {
          itens,
          atualizadoEm: new Date().toISOString(),
        });
      });
    } catch (err) {
      console.error('Erro ao salvar carrinho no Firestore:', err);
    }
  }
}
