import { Injectable, inject, signal, effect } from '@angular/core';
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

  private user$ = user(this.auth);
  private firestoreSub?: Subscription;
  private userId = signal<string | null>(null);

  // Exposição das propriedades reativas
  itens = this.carrinhoService.itens;
  quantidade = this.carrinhoService.quantidade;
  total = this.carrinhoService.total;
  carrinhoVazio = this.carrinhoService.carrinhoVazio;

  constructor() {
    // 1. Escuta mudanças na autenticação
    this.user$.subscribe((usr) => {
      if (usr) {
        this.userId.set(usr.uid);
        this.sincronizarComFirestore(usr.uid);
      } else {
        this.userId.set(null);
        if (this.firestoreSub) this.firestoreSub.unsubscribe();
      }
    });

    // 2. Efeito para salvar alterações no Firestore se estiver logado
    effect(() => {
      const uid = this.userId();
      const itensAtuais = this.itens();

      if (uid) {
        this.salvarNoFirestore(uid, itensAtuais);
      }
    });
  }

  adicionarProduto(produto: ItemCarrinho): void {
    this.carrinhoService.adicionar(produto);
  }

  removerItem(indice: number): void {
    this.carrinhoService.removerPorIndice(indice);
  }

  limparCarrinho(): void {
    this.carrinhoService.limpar();
  }

  /**
   * Sincroniza e realiza o merge entre dados da nuvem e do carrinho local
   */
  private sincronizarComFirestore(uid: string): void {
    const docRef = doc(this.firestore, `carrinhos/${uid}`);

    this.firestoreSub = docData(docRef).subscribe((dadosNuvem: any) => {
      const itensNuvem: ItemCarrinho[] = dadosNuvem?.itens || [];
      const itensLocais = this.itens();

      if (itensLocais.length > 0) {
        const itensMesclados = this.mesclarCarrinhos(itensNuvem, itensLocais);
        this.salvarNoFirestore(uid, itensMesclados);
      }
    });
  }

  private mesclarCarrinhos(nuvem: ItemCarrinho[], local: ItemCarrinho[]): ItemCarrinho[] {
    const mapa = new Map<string, ItemCarrinho>();

    nuvem.forEach((item) => mapa.set(item.id, { ...item }));
    local.forEach((item) => {
      if (mapa.has(item.id)) {
        const itemExistente = mapa.get(item.id)!;
        itemExistente.quantidade += item.quantidade;
      } else {
        mapa.set(item.id, { ...item });
      }
    });

    return Array.from(mapa.values());
  }

  private async salvarNoFirestore(uid: string, itens: ItemCarrinho[]): Promise<void> {
    const docRef = doc(this.firestore, `carrinhos/${uid}`);
    await setDoc(docRef, {
      itens,
      atualizadoEm: new Date().toISOString(),
    });
  }
}