import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Auth, user } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
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

  private user$ = user(this.auth);
  private firestoreSub?: Subscription;
  private userId = signal<string | null>(null);
  private isCarregandoNuvem = false;

  // Exposição das propriedades reativas para todo o resto do app
  itens = this.carrinhoService.itens;
  quantidade = this.carrinhoService.quantidade;
  total = this.carrinhoService.total;
  carrinhoVazio = this.carrinhoService.carrinhoVazio;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.iniciarMonitoramentoAuth();
    }
  }

  // 1. Escuta Login / Logout
  private iniciarMonitoramentoAuth(): void {
    this.user$.subscribe((usr) => {
      if (usr) {
        const uidAnterior = this.userId();
        this.userId.set(usr.uid);

        // Se logou ou trocou de usuário, busca os itens da nuvem
        if (uidAnterior !== usr.uid) {
          this.sincronizarComFirestore(usr.uid);
        }
      } else {
        const estavaLogado = !!this.userId();
        this.userId.set(null);

        if (this.firestoreSub) {
          this.firestoreSub.unsubscribe();
          this.firestoreSub = undefined;
        }

        // Ao deslogar, limpa o carrinho local para segurança
        if (estavaLogado) {
          this.carrinhoService.limpar();
        }
      }
    });
  }

  // Adiciona produto: atualiza LocalStorage e envia para a Nuvem (se logado)
  adicionarProduto(produto: ItemCarrinho): void {
    this.carrinhoService.adicionar(produto);
    this.salvarSeLogado();
  }

  // Remove produto: atualiza LocalStorage e envia para a Nuvem (se logado)
  removerItem(indice: number): void {
    this.carrinhoService.removerPorIndice(indice);
    this.salvarSeLogado();
  }

  // Limpa carrinho: limpa LocalStorage e atualiza a Nuvem (se logado)
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

  // 2. Busca na nuvem (Firestore) e preenche a máquina atual
  private sincronizarComFirestore(uid: string): void {
    if (this.firestoreSub) {
      this.firestoreSub.unsubscribe();
    }

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
            // Caso tenha itens no dispositivo antes de logar, junta com o que está na nuvem
            const itensMesclados = this.mesclarCarrinhos(itensNuvem, itensLocais);
            this.carrinhoService.definirItens(itensMesclados);
            this.salvarNoFirestore(uid, itensMesclados);
          } else {
            // Caso do PC/Outro dispositivo novo: carrega direto da nuvem para o LocalStorage do PC!
            this.carrinhoService.definirItens(itensNuvem);
          }
        } else {
          // Atualização em tempo real caso o carrinho seja modificado em outro dispositivo aberto
          if (!this.saoIguais(itensNuvem, itensLocais)) {
            this.carrinhoService.definirItens(itensNuvem);
          }
        }
      },
      error: (err) => {
        console.error('Erro ao sincronizar carrinho com Firestore:', err);
        this.isCarregandoNuvem = false;
      },
    });
  }

  // 3. Junta os itens da nuvem com os locais sem duplicar
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

  // 4. Compara se duas listas são iguais para evitar chamadas redundantes
  private saoIguais(a: ItemCarrinho[], b: ItemCarrinho[]): boolean {
    if (a.length !== b.length) return false;
    return JSON.stringify(a) === JSON.stringify(b);
  }

  // 5. Salva na nuvem no documento carrinhos/{uid}
  private async salvarNoFirestore(uid: string, itens: ItemCarrinho[]): Promise<void> {
    try {
      const docRef = doc(this.firestore, `carrinhos/${uid}`);
      await setDoc(docRef, {
        itens,
        atualizadoEm: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Erro ao salvar carrinho no Firestore:', err);
    }
  }
}
