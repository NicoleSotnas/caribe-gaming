import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutosService, Produto } from '../../core/services/produtos.service';

// Interface estendida para suportar o estado local do favorito
export interface ProdutoComFavorito extends Produto {
  favorito?: boolean;
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class ProdutosComponent implements OnInit {
  private produtosService = inject(ProdutosService);
  produtos: ProdutoComFavorito[] = [];

  ngOnInit(): void {
    this.produtosService.obterProdutos().subscribe({
      next: (dados) => {
        // Inicializa a propriedade de favorito como false para cada produto
        this.produtos = dados.map(p => ({ ...p, favorito: false }));
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  toggleFavorito(produto: ProdutoComFavorito): void {
    produto.favorito = !produto.favorito;
  }

  adicionarAoCarrinho(produto: ProdutoComFavorito): void {
    console.log('Produto adicionado ao carrinho:', produto);
  }
}