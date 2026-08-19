import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProdutosService } from '../../core/services/produtos.service';
import { CarrinhoFacade } from '../../core/facades/carrinho.facade';

interface ProdutoComFavorito {
  id: string;
  nome: string;
  precoOriginal: string;
  precoPromocional: string;
  desconto: number;
  genero: string;
  plataforma: string;
  imagem: string;
  favorito: boolean;
}

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './produtos.html',
  styleUrls: ['./produtos.css']
})
export class Produtos implements OnInit {
  private produtosService = inject(ProdutosService);
  private router = inject(Router); // Injeção do Router
  private carrinhoFacade = inject(CarrinhoFacade);

  produtos: ProdutoComFavorito[] = [];

  ngOnInit(): void {
    this.produtosService.obterProdutos().subscribe({
      next: (dados) => {
        this.produtos = dados.map(p => ({ ...p, favorito: false }));
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  toggleFavorito(produto: ProdutoComFavorito): void {
    produto.favorito = !produto.favorito;
  }

  private converterPreco(preco: string): number {
    return Number(preco.replace('R$', '').replace(',', '.').trim());
  }

  adicionarAoCarrinho(produto: ProdutoComFavorito): void {
    const preco = this.converterPreco(produto.precoPromocional);

    this.carrinhoFacade.adicionarProduto({
      id: Number(produto.id),
      nome: produto.nome,
      preco,
      quantidade: 1,
      imagemUrl: produto.imagem,
      plataforma: produto.plataforma,
      categoria: produto.genero,
    });

    console.log(`${produto.nome} foi adicionado ao carrinho.`);
  }

  // Método para redirecionar para a página do jogo
  irParaPaginaDoJogo(produto: ProdutoComFavorito): void {
    if (produto.id === '2' || produto.nome.toLowerCase().includes('witcher')) {
      this.router.navigate(['/jogos/the-witcher-3']);
    }
  }
}